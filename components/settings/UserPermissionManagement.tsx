"use client";

import { useState, useEffect } from "react";
import { Shield, Check, X, User as UserIcon, Mail, Edit2, Save } from "lucide-react";
import {
  MOCK_USERS,
  loadUserPermissionOverrides,
  saveUserPermissionOverrides,
  getUserPermissions,
  type User,
  type Permission,
  type UserPermissionOverride,
} from "@/lib/calendarPermissions";

export default function UserPermissionManagement() {
  const [permissionOverrides, setPermissionOverrides] = useState<UserPermissionOverride[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);
  const [overrideRole, setOverrideRole] = useState(false);

  useEffect(() => {
    const overrides = loadUserPermissionOverrides();
    setPermissionOverrides(overrides);
  }, []);

  const handleEditUser = (user: User) => {
    const currentPermissions = getUserPermissions(user.id);
    const override = permissionOverrides.find((o) => o.userId === user.id);

    setEditingUserId(user.id);
    setEditPermissions(override?.permissions || currentPermissions);
    setOverrideRole(override?.overrideRole || false);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditPermissions([]);
    setOverrideRole(false);
  };

  const handleSavePermissions = (user: User) => {
    const newOverride: UserPermissionOverride = {
      userId: user.id,
      userName: user.name,
      permissions: editPermissions,
      overrideRole,
    };

    const updatedOverrides = permissionOverrides.filter((o) => o.userId !== user.id);

    // Only save if override is enabled or permissions differ from role defaults
    if (overrideRole || editPermissions.length > 0) {
      updatedOverrides.push(newOverride);
    }

    setPermissionOverrides(updatedOverrides);
    saveUserPermissionOverrides(updatedOverrides);
    setEditingUserId(null);
    setEditPermissions([]);
    setOverrideRole(false);
  };

  const handleResetToRole = (userId: string) => {
    const updatedOverrides = permissionOverrides.filter((o) => o.userId !== userId);
    setPermissionOverrides(updatedOverrides);
    saveUserPermissionOverrides(updatedOverrides);
  };

  const togglePermission = (permission: Permission) => {
    if (editPermissions.includes(permission)) {
      setEditPermissions(editPermissions.filter((p) => p !== permission));
    } else {
      setEditPermissions([...editPermissions, permission]);
    }
  };

  const availablePermissions: Permission[] = ["view", "create", "edit", "delete"];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-700 midnight:border-cyan-700 purple:border-pink-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              User Permission Management
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
              Configure individual user permissions for calendar event management. By default, users inherit permissions from their role.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_USERS.map((user) => {
          const isEditing = editingUserId === user.id;
          const currentPermissions = isEditing ? editPermissions : getUserPermissions(user.id);
          const hasOverride = permissionOverrides.some((o) => o.userId === user.id);

          return (
            <div
              key={user.id}
              className="bg-surface rounded-lg border border-line p-4"
            >
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-ink">
                          {user.name}
                        </h4>
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-[#22262e] text-gray-700 dark:text-gray-300 text-xs font-medium rounded capitalize">
                          {user.role}
                        </span>
                        {hasOverride && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Permissions Display/Edit */}
                  {isEditing ? (
                    <div className="space-y-3 mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`override-${user.id}`}
                          checked={overrideRole}
                          onChange={(e) => setOverrideRole(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`override-${user.id}`}
                          className="text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                          Override role-based permissions
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availablePermissions.map((permission) => (
                          <button
                            key={permission}
                            onClick={() => togglePermission(permission)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              editPermissions.includes(permission)
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 dark:bg-[#22262e] text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {editPermissions.includes(permission) && (
                              <Check className="w-3 h-3 inline mr-1" />
                            )}
                            {permission}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentPermissions.map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          {permission}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSavePermissions(user)}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                        title="Save permissions"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 rounded-lg bg-gray-300 dark:bg-[#22262e] hover:bg-gray-400 dark:hover:bg-[#2a2d35] text-gray-700 dark:text-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Edit permissions"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {hasOverride && (
                        <button
                          onClick={() => handleResetToRole(user.id)}
                          className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-semibold transition-colors"
                          title="Reset to role defaults"
                        >
                          Reset
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
