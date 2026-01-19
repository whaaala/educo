"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Briefcase } from "lucide-react";
import Modal from "@/components/shared/Modal";
import FormInput from "@/components/shared/FormInput";
import FormButton from "@/components/shared/FormButton";
import type { AdminParent } from "@/lib/mockParents";

interface EditParentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminParent>) => void;
  parent: AdminParent;
}

interface ContactFormData {
  phone: string;
  email: string;
  occupation: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
}

export default function EditParentContactModal({
  isOpen,
  onClose,
  onSave,
  parent,
}: EditParentContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    phone: "",
    email: "",
    occupation: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with parent data
  useEffect(() => {
    if (parent && isOpen) {
      setFormData({
        phone: parent.phone || "",
        email: parent.email || "",
        occupation: parent.occupation || "",
        addressLine1: parent.address?.line1 || "",
        addressLine2: parent.address?.line2 || "",
        city: parent.address?.city || "",
        state: parent.address?.state || "",
        postalCode: parent.address?.postalCode || "",
      });
      setHasChanges(false);
    }
  }, [parent, isOpen]);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        phone: formData.phone,
        email: formData.email,
        occupation: formData.occupation,
        address: {
          line1: formData.addressLine1,
          line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: parent.address?.country || "Nigeria",
        },
      });
    }
  };

  const handleClose = () => {
    setErrors({});
    setHasChanges(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="3xl"
      title="Edit Contact Info"
      subtitle={`${parent.firstName} ${parent.lastName}`}
      icon={<Phone className="w-5 h-5" />}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact & Occupation Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormInput
            label="Phone Number"
            type="text"
            icon={<Phone className="w-full h-full" />}
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            error={errors.phone}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            icon={<Mail className="w-full h-full" />}
            placeholder="Enter email address"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            error={errors.email}
            required
          />
          <FormInput
            label="Occupation"
            type="text"
            icon={<Briefcase className="w-full h-full" />}
            placeholder="Enter occupation"
            value={formData.occupation}
            onChange={(value) => handleChange("occupation", value)}
          />
        </div>

        {/* Address Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormInput
            label="Address Line 1"
            type="text"
            icon={<MapPin className="w-full h-full" />}
            placeholder="Street address"
            value={formData.addressLine1}
            onChange={(value) => handleChange("addressLine1", value)}
          />
          <FormInput
            label="Address Line 2"
            type="text"
            icon={<MapPin className="w-full h-full" />}
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.addressLine2}
            onChange={(value) => handleChange("addressLine2", value)}
          />
        </div>

        {/* City, State, Postal Row */}
        <div className="grid grid-cols-3 gap-3">
          <FormInput
            label="City"
            type="text"
            icon={<MapPin className="w-full h-full" />}
            placeholder="City"
            value={formData.city}
            onChange={(value) => handleChange("city", value)}
          />
          <FormInput
            label="State"
            type="text"
            icon={<MapPin className="w-full h-full" />}
            placeholder="State"
            value={formData.state}
            onChange={(value) => handleChange("state", value)}
          />
          <FormInput
            label="Postal Code"
            type="text"
            icon={<MapPin className="w-full h-full" />}
            placeholder="Postal code"
            value={formData.postalCode}
            onChange={(value) => handleChange("postalCode", value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <FormButton type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </FormButton>
          <button
            type="submit"
            disabled={!hasChanges}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
              hasChanges
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
