"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Calendar, Clock, MapPin, Users, FileText, User, GraduationCap, Briefcase, Video, Mic, Building2, Link2 } from "lucide-react";
import Modal from "./Modal";
import FormDropdown from "./FormDropdown";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import FormButton from "./FormButton";

// Meeting types
export type MeetingType = "scheduled" | "requested" | "follow_up" | "emergency";
export type MeetingFormat = "in_person" | "virtual";
export type VirtualType = "video" | "audio";
export type MeetingContext = "parent" | "student" | "teacher";

// Participant interfaces
export interface MeetingParticipant {
  id: string;
  name: string;
  type: "parent" | "student" | "teacher" | "staff";
  role?: string;
  email?: string;
  photo?: string;
}

// Child/Student reference for meetings
export interface MeetingChildReference {
  id: string;
  name: string;
  classLevel: string;
}

// Props for the modal
export interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meetingData: ScheduledMeetingData) => void;
  context: MeetingContext;
  // Pre-filled data based on context
  primaryParticipant?: MeetingParticipant;
  children?: MeetingChildReference[];
  // Available options for dropdowns
  availableTeachers?: MeetingParticipant[];
  availableStaff?: MeetingParticipant[];
  availableLocations?: string[];
}

// Data returned when scheduling a meeting
export interface ScheduledMeetingData {
  meetingType: MeetingType | "custom";
  customMeetingType?: string;
  meetingFormat: MeetingFormat;
  virtualType?: VirtualType;
  subject: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  meetingLink?: string;
  participantId: string;
  participantName: string;
  participantType: "parent" | "student" | "teacher" | "staff";
  childId?: string;
  childName?: string;
  childClass?: string;
  teacherId?: string;
  teacherName?: string;
  teacherRole?: string;
  notes?: string;
}

// Default teachers list (can be overridden via props)
const DEFAULT_TEACHERS: MeetingParticipant[] = [
  { id: "tch-001", name: "Mr. Adeyemi Olumide", type: "teacher", role: "Class Teacher" },
  { id: "tch-002", name: "Mrs. Okonkwo Chioma", type: "teacher", role: "Mathematics Teacher" },
  { id: "tch-003", name: "Mr. Johnson Babatunde", type: "teacher", role: "English Teacher" },
  { id: "tch-004", name: "Mrs. Bakare Folake", type: "teacher", role: "Science Teacher" },
  { id: "tch-005", name: "Mr. Eze Chukwuemeka", type: "teacher", role: "Principal" },
  { id: "tch-006", name: "Mrs. Nwosu Adaeze", type: "teacher", role: "Vice Principal" },
  { id: "tch-007", name: "Mr. Afolabi Dayo", type: "teacher", role: "Guidance Counselor" },
];

// Default in-person locations
const DEFAULT_IN_PERSON_LOCATIONS = [
  "Room 101",
  "Room 102",
  "Room 103",
  "Conference Room A",
  "Conference Room B",
  "Principal's Office",
  "Vice Principal's Office",
  "Staff Room",
  "Guidance Counselor's Office",
  "Library Meeting Room",
  "School Hall",
  "Sports Complex",
];

// Virtual meeting platforms
const VIRTUAL_PLATFORMS = [
  { value: "zoom", label: "Zoom" },
  { value: "google_meet", label: "Google Meet" },
  { value: "microsoft_teams", label: "Microsoft Teams" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "other", label: "Other" },
];

// Meeting type options
const MEETING_TYPE_OPTIONS = [
  { value: "scheduled", label: "Scheduled Meeting" },
  { value: "requested", label: "Requested Meeting" },
  { value: "follow_up", label: "Follow-up Meeting" },
  { value: "emergency", label: "Emergency Meeting" },
  { value: "custom", label: "Custom Type..." },
];

// Duration options in minutes
const DURATION_OPTIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

// Common meeting subjects
const SUBJECT_SUGGESTIONS = [
  "Academic Progress Review",
  "Behavioral Concern Discussion",
  "Term Results Discussion",
  "Subject Performance Review",
  "Attendance Discussion",
  "Extra-curricular Activities",
  "Career Guidance Session",
  "Learning Support Plan",
  "Disciplinary Matter",
  "General Check-in",
  "Parent-Teacher Conference",
  "Fee Discussion",
  "Scholarship Review",
];

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSchedule,
  context,
  primaryParticipant,
  children = [],
  availableTeachers = DEFAULT_TEACHERS,
  availableStaff = [],
  availableLocations = DEFAULT_IN_PERSON_LOCATIONS,
}: ScheduleMeetingModalProps) {
  // Form state
  const [meetingType, setMeetingType] = useState<string>("scheduled");
  const [customMeetingType, setCustomMeetingType] = useState("");
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat>("in_person");
  const [virtualType, setVirtualType] = useState<VirtualType>("video");
  const [virtualPlatform, setVirtualPlatform] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [notes, setNotes] = useState("");
  const [showSubjectSuggestions, setShowSubjectSuggestions] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form field refs for scroll-to-error functionality
  const formFieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMeetingType("scheduled");
      setCustomMeetingType("");
      setMeetingFormat("in_person");
      setVirtualType("video");
      setVirtualPlatform("");
      setMeetingLink("");
      setSubject("");
      setDate("");
      setTime("");
      setDuration("30");
      setLocation("");
      setSelectedChildId(children.length === 1 ? children[0].id : "");
      setSelectedTeacherId("");
      setNotes("");
      setErrors({});
    }
  }, [isOpen, children]);

  // Reset location when meeting format changes
  useEffect(() => {
    setLocation("");
    setVirtualPlatform("");
    setMeetingLink("");
  }, [meetingFormat]);

  // Get modal title based on context
  const getModalTitle = () => {
    switch (context) {
      case "parent":
        return "Schedule Parent Meeting";
      case "student":
        return "Schedule Student Meeting";
      case "teacher":
        return "Schedule Teacher Meeting";
      default:
        return "Schedule Meeting";
    }
  };

  // Get modal subtitle
  const getModalSubtitle = () => {
    if (primaryParticipant) {
      return `Meeting with ${primaryParticipant.name}`;
    }
    return "Fill in the meeting details below";
  };

  // Prepare child options for dropdown
  const childOptions = useMemo(() => {
    return children.map((child) => ({
      value: child.id,
      label: `${child.name} (${child.classLevel})`,
    }));
  }, [children]);

  // Prepare teacher options for dropdown
  const teacherOptions = useMemo(() => {
    return availableTeachers.map((teacher) => ({
      value: teacher.id,
      label: `${teacher.name}${teacher.role ? ` (${teacher.role})` : ""}`,
    }));
  }, [availableTeachers]);

  // Prepare location options for dropdown
  const locationOptions = useMemo(() => {
    return availableLocations.map((loc) => ({
      value: loc,
      label: loc,
    }));
  }, [availableLocations]);

  // Get selected child details
  const selectedChild = useMemo(() => {
    return children.find((c) => c.id === selectedChildId);
  }, [children, selectedChildId]);

  // Get selected teacher details
  const selectedTeacher = useMemo(() => {
    return availableTeachers.find((t) => t.id === selectedTeacherId);
  }, [availableTeachers, selectedTeacherId]);

  // Field order for scroll-to-first-error (in display order)
  const fieldOrder = [
    "customMeetingType",
    "subject",
    "child",
    "teacher",
    "date",
    "time",
    "location",
    "virtualPlatform",
  ];

  // Scroll to first error field
  const scrollToFirstError = (errorFields: string[]) => {
    // Find the first field with an error based on field order
    const firstErrorField = fieldOrder.find((field) => errorFields.includes(field));
    if (firstErrorField && formFieldRefs.current[firstErrorField]) {
      formFieldRefs.current[firstErrorField]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Custom meeting type validation
    if (meetingType === "custom" && !customMeetingType.trim()) {
      newErrors.customMeetingType = "Please enter a custom meeting type";
    }

    if (!subject.trim()) {
      newErrors.subject = "Meeting subject is required";
    }

    if (!date) {
      newErrors.date = "Meeting date is required";
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Meeting date cannot be in the past";
      }
    }

    if (!time) {
      newErrors.time = "Meeting time is required";
    }

    // Location validation based on format
    if (meetingFormat === "in_person" && !location) {
      newErrors.location = "Meeting location is required";
    }

    if (meetingFormat === "virtual") {
      if (!virtualPlatform) {
        newErrors.virtualPlatform = "Please select a meeting platform";
      }
    }

    if (context === "parent" && children.length > 0 && !selectedChildId) {
      newErrors.child = "Please select a child for this meeting";
    }

    if (!selectedTeacherId) {
      newErrors.teacher = "Please select a teacher/staff member";
    }

    setErrors(newErrors);

    // Scroll to first error if validation fails
    const errorFields = Object.keys(newErrors);
    if (errorFields.length > 0) {
      scrollToFirstError(errorFields);
    }

    return errorFields.length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Determine location based on format
    const finalLocation = meetingFormat === "virtual"
      ? VIRTUAL_PLATFORMS.find((p) => p.value === virtualPlatform)?.label || virtualPlatform
      : location;

    const meetingData: ScheduledMeetingData = {
      meetingType: meetingType as MeetingType | "custom",
      customMeetingType: meetingType === "custom" ? customMeetingType.trim() : undefined,
      meetingFormat,
      virtualType: meetingFormat === "virtual" ? virtualType : undefined,
      subject: subject.trim(),
      date,
      time,
      duration: parseInt(duration),
      location: finalLocation,
      meetingLink: meetingFormat === "virtual" && meetingLink ? meetingLink.trim() : undefined,
      participantId: primaryParticipant?.id || "",
      participantName: primaryParticipant?.name || "",
      participantType: primaryParticipant?.type || "parent",
      notes: notes.trim() || undefined,
    };

    // Add child info if applicable
    if (selectedChild) {
      meetingData.childId = selectedChild.id;
      meetingData.childName = selectedChild.name;
      meetingData.childClass = selectedChild.classLevel;
    }

    // Add teacher info
    if (selectedTeacher) {
      meetingData.teacherId = selectedTeacher.id;
      meetingData.teacherName = selectedTeacher.name;
      meetingData.teacherRole = selectedTeacher.role;
    }

    onSchedule(meetingData);
    onClose();
  };

  // Filter subject suggestions
  const filteredSuggestions = useMemo(() => {
    if (!subject.trim()) return SUBJECT_SUGGESTIONS;
    return SUBJECT_SUGGESTIONS.filter((s) =>
      s.toLowerCase().includes(subject.toLowerCase())
    );
  }, [subject]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      subtitle={getModalSubtitle()}
      icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
      maxWidth="2xl"
      footer={
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <FormButton variant="secondary" onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton variant="primary" onClick={handleSubmit} icon={<Calendar className="w-4 h-4" />}>
            Schedule Meeting
          </FormButton>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Primary Participant Info Card */}
        {primaryParticipant && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/30 midnight:border-cyan-500/30 purple:border-pink-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {primaryParticipant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {primaryParticipant.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 capitalize">
                  {primaryParticipant.type}{primaryParticipant.role ? ` • ${primaryParticipant.role}` : ""}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Meeting Type & Subject Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <FormDropdown
              label="Meeting Type"
              icon={<FileText className="w-full h-full" />}
              value={meetingType}
              onChange={(val) => {
                setMeetingType(val);
                if (val !== "custom") {
                  setCustomMeetingType("");
                }
              }}
              options={MEETING_TYPE_OPTIONS}
              required
            />
            {/* Custom Meeting Type Input - shown when "Custom Type..." is selected */}
            {meetingType === "custom" && (
              <div
                className="animate-in slide-in-from-top-2 duration-200"
                ref={(el) => { formFieldRefs.current.customMeetingType = el; }}
              >
                <FormInput
                  label="Custom Meeting Type"
                  icon={<FileText className="w-full h-full" />}
                  value={customMeetingType}
                  onChange={setCustomMeetingType}
                  placeholder="Enter your custom meeting type"
                  required
                  error={errors.customMeetingType}
                />
              </div>
            )}
          </div>

          {/* Subject with suggestions */}
          <div className="relative" ref={(el) => { formFieldRefs.current.subject = el; }}>
            <FormInput
              label="Meeting Subject"
              icon={<FileText className="w-full h-full" />}
              value={subject}
              onChange={(val) => {
                setSubject(val);
                setShowSubjectSuggestions(true);
              }}
              placeholder="e.g., Academic Progress Review"
              required
              error={errors.subject}
            />
            {showSubjectSuggestions && subject.length > 0 && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 max-h-48 overflow-y-auto z-50">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setSubject(suggestion);
                      setShowSubjectSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Child Selection (for parent context with multiple children) */}
        {context === "parent" && children.length > 0 && (
          <div ref={(el) => { formFieldRefs.current.child = el; }}>
            <FormDropdown
              label="Regarding Child"
              icon={<GraduationCap className="w-full h-full" />}
              value={selectedChildId}
              onChange={setSelectedChildId}
              options={childOptions}
              placeholder="Select a child"
              required
              error={errors.child}
            />
          </div>
        )}

        {/* Teacher/Staff Selection */}
        <div ref={(el) => { formFieldRefs.current.teacher = el; }}>
          <FormDropdown
            label="Meeting With (Teacher/Staff)"
            icon={<Briefcase className="w-full h-full" />}
            value={selectedTeacherId}
            onChange={setSelectedTeacherId}
            options={teacherOptions}
            placeholder="Select a teacher or staff member"
            required
            error={errors.teacher}
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div ref={(el) => { formFieldRefs.current.date = el; }}>
            <FormInput
              label="Meeting Date"
              icon={<Calendar className="w-full h-full" />}
              type="date"
              value={date}
              onChange={setDate}
              placeholder="Select date"
              required
              error={errors.date}
            />
          </div>

          <div ref={(el) => { formFieldRefs.current.time = el; }}>
            <FormInput
              label="Meeting Time"
              icon={<Clock className="w-full h-full" />}
              type="time"
              value={time}
              onChange={setTime}
              placeholder="Select time"
              required
              error={errors.time}
            />
          </div>
        </div>

        {/* Duration */}
        <FormDropdown
          label="Duration"
          icon={<Clock className="w-full h-full" />}
          value={duration}
          onChange={setDuration}
          options={DURATION_OPTIONS}
          required
        />

        {/* Meeting Format Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center flex-shrink-0 opacity-70">
              <div className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                <Users className="w-full h-full" />
              </div>
            </div>
            <span>Meeting Format</span>
            <span className="text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 ml-1">*</span>
          </label>

          {/* In-Person / Virtual Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMeetingFormat("in_person")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                meetingFormat === "in_person"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                  : "border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-medium">In-Person</span>
            </button>
            <button
              type="button"
              onClick={() => setMeetingFormat("virtual")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                meetingFormat === "virtual"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-700 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300"
                  : "border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="font-medium">Virtual</span>
            </button>
          </div>

          {/* Virtual Type Selection (Video/Audio) - Only show when Virtual is selected */}
          {meetingFormat === "virtual" && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {/* Video / Audio Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVirtualType("video")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                    virtualType === "video"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Video Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVirtualType("audio")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                    virtualType === "audio"
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">Audio Only</span>
                </button>
              </div>

              {/* Platform Selection */}
              <div ref={(el) => { formFieldRefs.current.virtualPlatform = el; }}>
                <FormDropdown
                  label="Meeting Platform"
                  icon={<Video className="w-full h-full" />}
                  value={virtualPlatform}
                  onChange={setVirtualPlatform}
                  options={VIRTUAL_PLATFORMS}
                  placeholder="Select a platform"
                  required
                  error={errors.virtualPlatform}
                />
              </div>

              {/* Meeting Link (Optional) */}
              <FormInput
                label="Meeting Link"
                icon={<Link2 className="w-full h-full" />}
                value={meetingLink}
                onChange={setMeetingLink}
                placeholder="https://zoom.us/j/... (optional)"
              />
            </div>
          )}

          {/* In-Person Location - Only show when In-Person is selected */}
          {meetingFormat === "in_person" && (
            <div
              className="animate-in slide-in-from-top-2 duration-200"
              ref={(el) => { formFieldRefs.current.location = el; }}
            >
              <FormDropdown
                label="Location"
                icon={<MapPin className="w-full h-full" />}
                value={location}
                onChange={setLocation}
                options={locationOptions}
                placeholder="Select meeting location"
                required
                error={errors.location}
              />
            </div>
          )}
        </div>

        {/* Notes */}
        <FormTextarea
          label="Additional Notes"
          icon={<FileText className="w-full h-full" />}
          value={notes}
          onChange={setNotes}
          placeholder="Add any additional notes or agenda items for this meeting..."
          rows={3}
          optional
        />

        {/* Meeting Summary Preview */}
        {date && time && selectedTeacher && (meetingFormat === "in_person" ? location : virtualPlatform) && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 midnight:from-emerald-900/20 midnight:to-teal-900/20 purple:from-emerald-900/20 purple:to-teal-900/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/30 midnight:border-emerald-500/30 purple:border-emerald-500/30">
            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 midnight:text-emerald-300 purple:text-emerald-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Meeting Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-emerald-700 dark:text-emerald-400 midnight:text-emerald-400 purple:text-emerald-400">
              <div>
                <span className="font-medium">Date:</span>{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div>
                <span className="font-medium">Time:</span> {time}
              </div>
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {DURATION_OPTIONS.find((d) => d.value === duration)?.label}
              </div>
              <div>
                <span className="font-medium">With:</span> {selectedTeacher.name}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <span className="font-medium">Format:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  meetingFormat === "in_person"
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                }`}>
                  {meetingFormat === "in_person" ? (
                    <>
                      <Building2 className="w-3 h-3" />
                      In-Person
                    </>
                  ) : (
                    <>
                      {virtualType === "video" ? <Video className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                      Virtual ({virtualType === "video" ? "Video" : "Audio"})
                    </>
                  )}
                </span>
              </div>
              {meetingFormat === "in_person" && location && (
                <div className="col-span-2">
                  <span className="font-medium">Location:</span> {location}
                </div>
              )}
              {meetingFormat === "virtual" && virtualPlatform && (
                <div className="col-span-2">
                  <span className="font-medium">Platform:</span> {VIRTUAL_PLATFORMS.find((p) => p.value === virtualPlatform)?.label}
                </div>
              )}
              {meetingFormat === "virtual" && meetingLink && (
                <div className="col-span-2 truncate">
                  <span className="font-medium">Link:</span> {meetingLink}
                </div>
              )}
              {selectedChild && (
                <div className="col-span-2">
                  <span className="font-medium">Regarding:</span> {selectedChild.name} ({selectedChild.classLevel})
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
