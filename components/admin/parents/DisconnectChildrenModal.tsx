"use client";

import { useState } from "react";
import { AlertTriangle, UserMinus, GraduationCap, X, Check } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormButton from "@/components/shared/FormButton";
import type { AdminParent } from "@/lib/mockParents";

interface DisconnectChildrenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (disconnectedChildIds: string[]) => void;
  parent: AdminParent;
}

export default function DisconnectChildrenModal({
  isOpen,
  onClose,
  onConfirm,
  parent,
}: DisconnectChildrenModalProps) {
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const toggleChild = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const selectAll = () => {
    if (selectedChildren.length === parent.children.length) {
      setSelectedChildren([]);
    } else {
      setSelectedChildren(parent.children.map((c) => c.id));
    }
  };

  const handleConfirm = () => {
    if (selectedChildren.length === 0) return;
    setIsConfirming(true);
    // Simulate processing
    setTimeout(() => {
      onConfirm(selectedChildren);
      setSelectedChildren([]);
      setIsConfirming(false);
    }, 500);
  };

  const handleClose = () => {
    setSelectedChildren([]);
    setIsConfirming(false);
    onClose();
  };

  const allSelected = selectedChildren.length === parent.children.length;
  const someSelected = selectedChildren.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      title="Disconnect Children"
      subtitle={`From ${parent.firstName} ${parent.lastName}`}
      icon={<UserMinus className="w-5 h-5" />}
      footer={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedChildren.length} of {parent.children.length} selected
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <FormButton type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </FormButton>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedChildren.length === 0 || isConfirming}
              className="px-4 sm:px-6 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isConfirming ? "Processing..." : "Disconnect Selected"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Warning Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Important Notice
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Disconnecting children from this parent will remove the parent-child relationship.
              The children will remain in the system but will no longer be linked to this parent.
              This action can be reversed by re-assigning the parent later.
            </p>
          </div>
        </div>

        {/* Select All Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Select Children to Disconnect
          </h3>
          <button
            type="button"
            onClick={selectAll}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
        </div>

        {/* Children List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {parent.children.map((child) => {
            const isSelected = selectedChildren.includes(child.id);
            return (
              <div
                key={child.id}
                onClick={() => toggleChild(child.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? "bg-red-600 border-red-600"
                      : "border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Child Avatar */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Child Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {child.firstName} {child.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {child.classLevel} • ID: {child.id}
                  </p>
                </div>

                {/* Status indicator */}
                {isSelected && (
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 flex-shrink-0">
                    Will be disconnected
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        {someSelected && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              After disconnecting all children, you will be able to delete this parent from the system.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
