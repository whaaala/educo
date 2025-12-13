"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import FormInput from "@/components/shared/FormInput";
import FormDropdown from "@/components/shared/FormDropdown";
import FormTextarea from "@/components/shared/FormTextarea";
import { FormSection } from "@/components/shared/FormWizard";
import {
  BookOpen,
  Hash,
  User,
  Building2,
  Calendar,
  Layers,
  MapPin,
  Globe,
  FileText,
  Tag,
  DollarSign,
  BookCopy,
  GraduationCap,
  Loader2,
  ImageIcon,
} from "lucide-react";
import type { Book, BookCategory, BookCondition, BookEducationLevel } from "@/types/library";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, "id" | "createdAt" | "updatedAt">) => void;
  isSaving?: boolean;
  editingBook?: Book | null;
}

interface FormData {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishYear: string;
  edition: string;
  category: BookCategory;
  subject: string;
  educationLevel: BookEducationLevel;
  description: string;
  coverImage: string;
  totalCopies: string;
  location: string;
  condition: BookCondition;
  language: string;
  pages: string;
  price: string;
  acquisitionDate: string;
  tags: string;
}

const INITIAL_FORM_DATA: FormData = {
  isbn: "",
  title: "",
  author: "",
  publisher: "",
  publishYear: new Date().getFullYear().toString(),
  edition: "",
  category: "textbook",
  subject: "",
  educationLevel: "All",
  description: "",
  coverImage: "",
  totalCopies: "1",
  location: "",
  condition: "new",
  language: "English",
  pages: "",
  price: "",
  acquisitionDate: new Date().toISOString().split("T")[0],
  tags: "",
};

const BOOK_CATEGORIES: { value: BookCategory; label: string }[] = [
  { value: "textbook", label: "Textbook" },
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-Fiction" },
  { value: "reference", label: "Reference" },
  { value: "science", label: "Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "literature", label: "Literature" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "sports", label: "Sports" },
  { value: "religion", label: "Religion" },
  { value: "biography", label: "Biography" },
  { value: "periodical", label: "Periodical" },
  { value: "other", label: "Other" },
];

const BOOK_CONDITIONS: { value: BookCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
  { value: "damaged", label: "Damaged" },
];

const EDUCATION_LEVELS: { value: BookEducationLevel; label: string }[] = [
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Tertiary", label: "Tertiary" },
  { value: "All", label: "All Levels" },
];

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "French", label: "French" },
  { value: "Spanish", label: "Spanish" },
  { value: "German", label: "German" },
  { value: "Arabic", label: "Arabic" },
  { value: "Chinese", label: "Chinese" },
  { value: "Yoruba", label: "Yoruba" },
  { value: "Hausa", label: "Hausa" },
  { value: "Igbo", label: "Igbo" },
  { value: "Other", label: "Other" },
];

export default function AddBookModal({
  isOpen,
  onClose,
  onSave,
  isSaving = false,
  editingBook,
}: AddBookModalProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingBook) {
      setFormData({
        isbn: editingBook.isbn,
        title: editingBook.title,
        author: editingBook.author,
        publisher: editingBook.publisher,
        publishYear: editingBook.publishYear.toString(),
        edition: editingBook.edition || "",
        category: editingBook.category,
        subject: editingBook.subject || "",
        educationLevel: editingBook.educationLevel,
        description: editingBook.description || "",
        coverImage: editingBook.coverImage || "",
        totalCopies: editingBook.totalCopies.toString(),
        location: editingBook.location,
        condition: editingBook.condition,
        language: editingBook.language,
        pages: editingBook.pages?.toString() || "",
        price: editingBook.price?.toString() || "",
        acquisitionDate: editingBook.acquisitionDate,
        tags: editingBook.tags?.join(", ") || "",
      });
    } else {
      setFormData(INITIAL_FORM_DATA);
    }
    setErrors({});
  }, [editingBook, isOpen]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.publisher.trim()) newErrors.publisher = "Publisher is required";
    if (!formData.publishYear.trim()) newErrors.publishYear = "Publish year is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.totalCopies.trim() || parseInt(formData.totalCopies) < 1) {
      newErrors.totalCopies = "At least 1 copy is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const bookData: Omit<Book, "id" | "createdAt" | "updatedAt"> = {
      isbn: formData.isbn.trim(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      publisher: formData.publisher.trim(),
      publishYear: parseInt(formData.publishYear),
      edition: formData.edition.trim() || undefined,
      category: formData.category,
      subject: formData.subject.trim() || undefined,
      educationLevel: formData.educationLevel,
      description: formData.description.trim() || undefined,
      coverImage: formData.coverImage.trim() || undefined,
      totalCopies: parseInt(formData.totalCopies),
      availableCopies: editingBook ? editingBook.availableCopies : parseInt(formData.totalCopies),
      location: formData.location.trim(),
      condition: formData.condition,
      status: "available",
      language: formData.language,
      pages: formData.pages ? parseInt(formData.pages) : undefined,
      price: formData.price ? parseFloat(formData.price) : undefined,
      acquisitionDate: formData.acquisitionDate,
      tags: formData.tags.trim() ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
    };

    onSave(bookData);
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingBook ? "Edit Book" : "Add New Book"}
      subtitle={editingBook ? `Editing: ${editingBook.title}` : "Add a new book to the library catalog"}
      icon={<BookOpen className="w-5 h-5" />}
      maxWidth="4xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="ghost" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingBook ? "Saving..." : "Adding..."}
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                {editingBook ? "Save Changes" : "Add Book"}
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Basic Information Section */}
        <FormSection
          title="Basic Information"
          icon={<BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="ISBN"
              icon={<Hash className="w-full h-full" />}
              value={formData.isbn}
              onChange={(val) => handleChange("isbn", val)}
              placeholder="e.g., 978-0-13-468599-1"
              required
              error={errors.isbn}
            />
            <FormInput
              label="Title"
              icon={<BookOpen className="w-full h-full" />}
              value={formData.title}
              onChange={(val) => handleChange("title", val)}
              placeholder="Book title"
              required
              error={errors.title}
            />
            <FormInput
              label="Author"
              icon={<User className="w-full h-full" />}
              value={formData.author}
              onChange={(val) => handleChange("author", val)}
              placeholder="Author name"
              required
              error={errors.author}
            />
            <FormInput
              label="Publisher"
              icon={<Building2 className="w-full h-full" />}
              value={formData.publisher}
              onChange={(val) => handleChange("publisher", val)}
              placeholder="Publisher name"
              required
              error={errors.publisher}
            />
            <FormInput
              label="Publish Year"
              icon={<Calendar className="w-full h-full" />}
              value={formData.publishYear}
              onChange={(val) => handleChange("publishYear", val)}
              placeholder="e.g., 2024"
              type="number"
              required
              error={errors.publishYear}
            />
            <FormInput
              label="Edition"
              icon={<Layers className="w-full h-full" />}
              value={formData.edition}
              onChange={(val) => handleChange("edition", val)}
              placeholder="e.g., 4th Edition (optional)"
            />
          </div>
        </FormSection>

        {/* Classification Section */}
        <FormSection
          title="Classification"
          icon={<Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormDropdown
              label="Category"
              icon={<Layers className="w-full h-full" />}
              value={formData.category}
              onChange={(val) => handleChange("category", val)}
              options={BOOK_CATEGORIES}
              iconBgColor="bg-purple-100 dark:bg-purple-900/30"
              iconColor="text-purple-600 dark:text-purple-400"
              required
            />
            <FormDropdown
              label="Education Level"
              icon={<GraduationCap className="w-full h-full" />}
              value={formData.educationLevel}
              onChange={(val) => handleChange("educationLevel", val as BookEducationLevel)}
              options={EDUCATION_LEVELS}
              iconBgColor="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600 dark:text-blue-400"
              required
            />
            <FormInput
              label="Subject"
              icon={<FileText className="w-full h-full" />}
              value={formData.subject}
              onChange={(val) => handleChange("subject", val)}
              placeholder="e.g., Computer Science (optional)"
            />
          </div>
        </FormSection>

        {/* Inventory Section */}
        <FormSection
          title="Inventory & Location"
          icon={<BookCopy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              label="Total Copies"
              icon={<BookCopy className="w-full h-full" />}
              value={formData.totalCopies}
              onChange={(val) => handleChange("totalCopies", val)}
              placeholder="Number of copies"
              type="number"
              required
              error={errors.totalCopies}
            />
            <FormInput
              label="Location"
              icon={<MapPin className="w-full h-full" />}
              value={formData.location}
              onChange={(val) => handleChange("location", val)}
              placeholder="e.g., Section A, Shelf 3"
              required
              error={errors.location}
            />
            <FormDropdown
              label="Condition"
              icon={<Tag className="w-full h-full" />}
              value={formData.condition}
              onChange={(val) => handleChange("condition", val)}
              options={BOOK_CONDITIONS}
              iconBgColor="bg-emerald-100 dark:bg-emerald-900/30"
              iconColor="text-emerald-600 dark:text-emerald-400"
              required
            />
          </div>
        </FormSection>

        {/* Additional Details Section */}
        <FormSection
          title="Additional Details"
          icon={<FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormDropdown
              label="Language"
              icon={<Globe className="w-full h-full" />}
              value={formData.language}
              onChange={(val) => handleChange("language", val)}
              options={LANGUAGES}
              iconBgColor="bg-amber-100 dark:bg-amber-900/30"
              iconColor="text-amber-600 dark:text-amber-400"
            />
            <FormInput
              label="Pages"
              icon={<FileText className="w-full h-full" />}
              value={formData.pages}
              onChange={(val) => handleChange("pages", val)}
              placeholder="Number of pages (optional)"
              type="number"
            />
            <FormInput
              label="Price"
              icon={<DollarSign className="w-full h-full" />}
              value={formData.price}
              onChange={(val) => handleChange("price", val)}
              placeholder="Book price (optional)"
              type="number"
            />
            <FormInput
              label="Acquisition Date"
              icon={<Calendar className="w-full h-full" />}
              value={formData.acquisitionDate}
              onChange={(val) => handleChange("acquisitionDate", val)}
              type="date"
            />
            <FormInput
              label="Cover Image URL"
              icon={<ImageIcon className="w-full h-full" />}
              value={formData.coverImage}
              onChange={(val) => handleChange("coverImage", val)}
              placeholder="https://example.com/cover.jpg (optional)"
            />
            <FormInput
              label="Tags"
              icon={<Tag className="w-full h-full" />}
              value={formData.tags}
              onChange={(val) => handleChange("tags", val)}
              placeholder="Comma-separated tags (optional)"
            />
          </div>
        </FormSection>

        {/* Description Section */}
        <FormSection
          title="Description"
          icon={<FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
        >
          <FormTextarea
            label="Book Description"
            icon={<FileText className="w-full h-full" />}
            value={formData.description}
            onChange={(val) => handleChange("description", val)}
            placeholder="Enter a brief description of the book..."
            rows={3}
            optional
          />
        </FormSection>
      </div>
    </Modal>
  );
}
