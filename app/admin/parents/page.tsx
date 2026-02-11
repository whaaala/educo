"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, GraduationCap, UserMinus, Check, Trash2, UserPlus, Users, Shield } from "lucide-react";
import { DataManagementPage } from "@/components/pages";
import ParentCard from "@/components/admin/parents/ParentCard";
import ParentsTable from "@/components/admin/parents/ParentsTable";
import BulkDeleteModal, { BulkDeleteItem } from "@/components/shared/BulkDeleteModal";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { getAllParents, type AdminParent } from "@/lib/mockParents";
import { exportParentsToPDF } from "@/utils/parentsPdfExport";
import { exportParentsToExcel } from "@/utils/parentsExcelExport";
import type { GridCardProps } from "@/types/components";
import {
  parentFilterFields,
  parentSortOptions,
  sortParents,
  filterParents,
  searchParents,
  getCurrencySymbol,
} from "./config";

// Grid card wrapper - adapts ParentCard to GridCardProps interface
function ParentGridCard({ item, isSelected, onSelectionChange }: GridCardProps<AdminParent>) {
  return (
    <ParentCard
      parent={item}
      colorIndex={item.firstName.charCodeAt(0) + item.lastName.charCodeAt(0)}
      isSelected={isSelected}
      onSelectionChange={(_id, selected) => onSelectionChange(selected)}
    />
  );
}

export default function AdminParentsPage() {
  const { settings } = useSchoolSettings();
  const router = useRouter();
  const { addNotification } = useNotifications();

  const [parents, setParents] = useState<AdminParent[]>(getAllParents());

  // Bulk delete modal state
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<BulkDeleteItem[]>([]);

  // Cannot delete modal state (for parents with children)
  const [isCannotBulkDeleteOpen, setIsCannotBulkDeleteOpen] = useState(false);
  const [parentsWithChildren, setParentsWithChildren] = useState<AdminParent[]>([]);
  const [selectedChildrenInModal, setSelectedChildrenInModal] = useState<Record<string, string[]>>({});

  // Add parent modal state
  const [isAddParentModalOpen, setIsAddParentModalOpen] = useState(false);

  // Track selected IDs for the cannot-delete modal logic
  const [currentSelectedIds, setCurrentSelectedIds] = useState<Set<string>>(new Set());

  // Helper to toggle child selection in the bulk modal
  const toggleChildInModal = (parentId: string, childId: string) => {
    setSelectedChildrenInModal((prev) => {
      const parentChildren = prev[parentId] || [];
      if (parentChildren.includes(childId)) {
        return { ...prev, [parentId]: parentChildren.filter((id) => id !== childId) };
      } else {
        return { ...prev, [parentId]: [...parentChildren, childId] };
      }
    });
  };

  // Toggle all children for a parent in the modal
  const toggleAllChildrenForParent = (parentId: string, children: { id: string }[]) => {
    setSelectedChildrenInModal((prev) => {
      const parentChildren = prev[parentId] || [];
      if (parentChildren.length === children.length) {
        return { ...prev, [parentId]: [] };
      } else {
        return { ...prev, [parentId]: children.map((c) => c.id) };
      }
    });
  };

  // Disconnect selected children from a parent in the modal
  const handleDisconnectInModal = (parentId: string) => {
    const childrenToDisconnect = selectedChildrenInModal[parentId] || [];
    if (childrenToDisconnect.length === 0) return;

    setParentsWithChildren((prev) =>
      prev
        .map((parent) => {
          if (parent.id === parentId) {
            return { ...parent, children: parent.children.filter((c) => !childrenToDisconnect.includes(c.id)) };
          }
          return parent;
        })
        .filter((parent) => parent.children.length > 0)
    );

    setParents((prevParents) =>
      prevParents.map((parent) => {
        if (parent.id === parentId) {
          return { ...parent, children: parent.children.filter((c) => !childrenToDisconnect.includes(c.id)) };
        }
        return parent;
      })
    );

    setSelectedChildrenInModal((prev) => {
      const newState = { ...prev };
      delete newState[parentId];
      return newState;
    });

    addNotification({
      type: "success",
      title: "Children Disconnected",
      message: `${childrenToDisconnect.length} child${childrenToDisconnect.length > 1 ? "ren have" : " has"} been disconnected from the parent.`,
    });
  };

  // Delete a parent directly from the modal
  const handleDeleteParentInModal = (parentId: string) => {
    setParents((prevParents) => prevParents.filter((p) => p.id !== parentId));
    setCurrentSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.delete(parentId);
      return newIds;
    });

    addNotification({
      type: "success",
      title: "Parent Deleted",
      message: "The parent has been removed from the system.",
    });
  };

  // Get parents that are now eligible for deletion (no children)
  const getEligibleForDeletion = () => {
    return Array.from(currentSelectedIds)
      .map((id) => parents.find((p) => p.id === id))
      .filter((p) => p && p.children.length === 0) as AdminParent[];
  };

  // Delete all eligible parents from the modal
  const handleDeleteAllEligible = () => {
    const eligibleParents = getEligibleForDeletion();
    if (eligibleParents.length === 0) return;

    const eligibleIds = eligibleParents.map((p) => p.id);
    setParents((prevParents) => prevParents.filter((p) => !eligibleIds.includes(p.id)));
    setCurrentSelectedIds((prevIds) => {
      const newIds = new Set(prevIds);
      eligibleIds.forEach((id) => newIds.delete(id));
      return newIds;
    });

    addNotification({
      type: "success",
      title: "Parents Deleted",
      message: `${eligibleParents.length} parent${eligibleParents.length > 1 ? "s have" : " has"} been removed from the system.`,
    });

    if (parentsWithChildren.length === 0) {
      setIsCannotBulkDeleteOpen(false);
    }
  };

  // Bulk delete handler
  const handleBulkDelete = (selectedIds: Set<string>) => {
    setCurrentSelectedIds(selectedIds);
    const selectedParents = parents.filter((parent) => selectedIds.has(parent.id));

    // Check if any selected parents have children
    const parentsWithActiveChildren = selectedParents.filter(
      (parent) => parent.children && parent.children.length > 0
    );

    if (parentsWithActiveChildren.length > 0) {
      setParentsWithChildren(parentsWithActiveChildren);
      setIsCannotBulkDeleteOpen(true);
      return;
    }

    // All selected parents have no children, proceed with deletion
    const items: BulkDeleteItem[] = selectedParents.map((parent) => ({
      id: parent.id,
      name: `${parent.firstName} ${parent.lastName}`,
      subtitle: parent.email,
      avatar: parent.profilePhoto,
    }));

    setItemsToDelete(items);
    setIsBulkDeleteModalOpen(true);
  };

  // Export handlers
  const handleExportPDF = useCallback(() => {
    const currencySymbol = getCurrencySymbol(settings.currency || "NGN");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "2-digit", day: "2-digit",
    }).replace(/\//g, "-");

    exportParentsToPDF(parents, `parents_${dateStr}.pdf`, {
      currencySymbol,
      schoolName: settings.schoolName || "School Management System",
    });
  }, [parents, settings.currency, settings.schoolName]);

  const handleExportExcel = useCallback(() => {
    const currencySymbol = getCurrencySymbol(settings.currency || "NGN");
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "2-digit", day: "2-digit",
    }).replace(/\//g, "-");

    exportParentsToExcel(parents, `parents_${dateStr}.xlsx`, {
      currencySymbol,
      schoolName: settings.schoolName || "School Management System",
    });
  }, [parents, settings.currency, settings.schoolName]);

  const handleAddParentType = (type: "parent" | "guardian") => {
    setIsAddParentModalOpen(false);
    router.push(`/admin/parents/add?type=${type}`);
  };

  return (
    <DataManagementPage<AdminParent>
      title="Parents"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Admin" },
        { label: "Parents", isActive: true },
      ]}
      data={parents}
      getRowKey={(item) => item.id}
      columns={[]}
      filterFields={parentFilterFields}
      filterFn={filterParents}
      searchFn={searchParents}
      searchPlaceholder="Search parents..."
      sortOptions={parentSortOptions}
      sortFn={sortParents}
      defaultSort="ascending"
      enableDateRange
      enableViewToggle
      gridCardComponent={ParentGridCard}
      gridColumns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      customListRender={(filteredData) => (
        <ParentsTable
          parents={filteredData as AdminParent[]}
          isLoading={false}
          onClearFilters={() => {}}
          hasActiveFilters={false}
          totalParentsCount={parents.length}
        />
      )}
      enableSelection
      bulkActions={[
        {
          id: "delete",
          label: "Delete Parents",
          icon: Trash2,
          variant: "danger",
          onClick: handleBulkDelete,
        },
      ]}
      addButtonConfig={{
        label: "Add Parent",
        onClick: () => setIsAddParentModalOpen(true),
      }}
      enableExport
      exportConfig={{ filename: "parents" }}
      onExportPDF={handleExportPDF}
      onExportExcel={handleExportExcel}
      itemLabel="parent"
      itemLabelPlural="parents"
      emptyStateConfig={{
        title: "No parents found",
        description: "No parents match the current filters.",
      }}
    >
      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={(itemIds) => {
          setParents((prevParents) => prevParents.filter((p) => !itemIds.includes(p.id)));
          setIsBulkDeleteModalOpen(false);
          setItemsToDelete([]);
          addNotification({
            type: "success",
            title: "Parents Deleted",
            message: `${itemIds.length} parent${itemIds.length > 1 ? "s have" : " has"} been removed from the system.`,
          });
        }}
        items={itemsToDelete}
        onRemoveItem={(itemId) => {
          setItemsToDelete((prevItems) => prevItems.filter((item) => item.id !== itemId));
        }}
        onRestoreItem={(item) => {
          setItemsToDelete((prevItems) => [...prevItems, item]);
        }}
        onRestoreAll={(items) => {
          setItemsToDelete((prevItems) => [...prevItems, ...items]);
        }}
        title="Delete Parents"
        warningMessage="This will permanently remove these parents and all associated data. This action cannot be undone."
        confirmButtonText="Delete Parents"
      />

      {/* Cannot Bulk Delete Modal - shown when trying to delete parents with children */}
      <Modal
        isOpen={isCannotBulkDeleteOpen}
        onClose={() => {
          setIsCannotBulkDeleteOpen(false);
          setParentsWithChildren([]);
          setSelectedChildrenInModal({});
        }}
        maxWidth="lg"
        title="Manage Parents & Children"
        subtitle="Disconnect children to enable parent deletion"
        icon={<UserMinus className="w-5 h-5" />}
      >
        <div className="space-y-4">
          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {parentsWithChildren.length} parent{parentsWithChildren.length > 1 ? "s have" : " has"} connected children
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Select and disconnect children below, then delete the parents. You can also delete parents that already have no children connected.
              </p>
            </div>
          </div>

          {/* Parents with Children List */}
          {parentsWithChildren.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Parents with Connected Children:
              </h4>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {parentsWithChildren.map((parent) => {
                  const selectedForParent = selectedChildrenInModal[parent.id] || [];
                  const allSelected = selectedForParent.length === parent.children.length;
                  const someSelected = selectedForParent.length > 0;

                  return (
                    <div
                      key={parent.id}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    >
                      {/* Parent Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {parent.profilePhoto ? (
                            <img
                              src={parent.profilePhoto}
                              alt={`${parent.firstName} ${parent.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {parent.firstName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {parent.firstName} {parent.lastName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedForParent.length} of {parent.children.length} selected
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleAllChildrenForParent(parent.id, parent.children)}
                            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                          >
                            {allSelected ? "Deselect All" : "Select All"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDisconnectInModal(parent.id)}
                            disabled={!someSelected}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            Disconnect
                          </button>
                        </div>
                      </div>

                      {/* Children List */}
                      <div className="flex flex-wrap gap-2">
                        {parent.children.map((child) => {
                          const isSelected = selectedForParent.includes(child.id);
                          return (
                            <div
                              key={child.id}
                              onClick={() => toggleChildInModal(parent.id, child.id)}
                              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                                  isSelected
                                    ? "bg-red-600 border-red-600"
                                    : "border-2 border-gray-300 dark:border-gray-500"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"}`} />
                              <span className={`text-xs font-medium ${isSelected ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}`}>
                                {child.firstName} {child.lastName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Eligible for Deletion Section */}
          {getEligibleForDeletion().length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Ready for Deletion ({getEligibleForDeletion().length}):
                </h4>
                <button
                  type="button"
                  onClick={handleDeleteAllEligible}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete All Eligible
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {getEligibleForDeletion().map((parent) => (
                  <div
                    key={parent.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  >
                    {parent.profilePhoto ? (
                      <img
                        src={parent.profilePhoto}
                        alt={`${parent.firstName} ${parent.lastName}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                        {parent.firstName.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      {parent.firstName} {parent.lastName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteParentInModal(parent.id)}
                      className="ml-1 p-1 rounded hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors cursor-pointer"
                      title="Delete this parent"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success message when all done */}
          {parentsWithChildren.length === 0 && getEligibleForDeletion().length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">All done!</p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  All selected parents have been processed.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <FormButton
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCannotBulkDeleteOpen(false);
                setParentsWithChildren([]);
                setSelectedChildrenInModal({});
              }}
            >
              Close
            </FormButton>
          </div>
        </div>
      </Modal>

      {/* Add Parent/Guardian Selection Modal */}
      <Modal
        isOpen={isAddParentModalOpen}
        onClose={() => setIsAddParentModalOpen(false)}
        maxWidth="sm"
        title="Add Parent or Guardian"
        subtitle="Choose the type of account to create"
        icon={<UserPlus className="w-5 h-5" />}
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleAddParentType("parent")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-gray-900 dark:text-white">Parent</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Biological parent (Father or Mother) of a student
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAddParentType("guardian")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-gray-900 dark:text-white">Guardian</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Legal guardian, sponsor, or caregiver of a student
              </p>
            </div>
          </button>

          <div className="flex items-start gap-2 p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              After creating the account, you can link them to one or more students in the system.
            </p>
          </div>
        </div>
      </Modal>
    </DataManagementPage>
  );
}
