"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import Button from "@/components/shared/Button";
import { usePageLoad } from "@/hooks/usePageLoad";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  Award,
  AlertCircle,
  Download,
  GraduationCap,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  FileImage,
  File,
} from "lucide-react";

// File Preview Modal Component
interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    type: "pdf" | "image" | "document";
    url: string;
    size: string;
    isGraded?: boolean;
    hasAnnotations?: boolean;
  } | null;
}

function FilePreviewModal({ isOpen, onClose, file }: FilePreviewModalProps) {
  if (!isOpen || !file) return null;

  const handleDownload = () => {
    // Create a temporary link to trigger download
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              file.type === "pdf" ? "bg-rose-50 dark:bg-rose-900/20" :
              file.type === "image" ? "bg-purple-50 dark:bg-purple-900/20" :
              "bg-blue-50 dark:bg-blue-900/20"
            }`}>
              {file.type === "pdf" ? (
                <FileText className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              ) : file.type === "image" ? (
                <FileImage className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              ) : (
                <File className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-md">
                {file.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{file.size}</span>
                {file.isGraded && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Graded</span>
                  </>
                )}
                {file.hasAnnotations && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">With Annotations</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
          {file.type === "image" ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-8 text-center">
                      <div class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p class="text-gray-600 dark:text-gray-300 font-medium mb-1">${file.name}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Image preview not available</p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">Click Download to view the file</p>
                    </div>
                  `;
                }}
              />
            </div>
          ) : file.type === "pdf" ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <iframe
                src={file.url}
                className="w-full h-[70vh] rounded-lg border border-gray-200 dark:border-gray-700"
                title={file.name}
                onError={() => {}}
              />
              <div className="hidden pdf-fallback flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-rose-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">PDF preview not available</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Click Download to view the file</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <File className="w-10 h-10 text-blue-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">{file.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Document preview not available</p>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Download to View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Homework type
interface HomeworkQuestion {
  id: string;
  number: number;
  question: string;
  marks: number;
  type: "short" | "long" | "multiple-choice" | "diagram";
  options?: string[];
}

interface SubmittedFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  url: string;
  uploadedAt: string;
  size: string;
}

interface GradedFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "document";
  url: string;
  gradedAt: string;
  size: string;
  hasAnnotations?: boolean;
}

interface Homework {
  id: string;
  childId: string;
  childName: string;
  childPhoto: string;
  class: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  instructions: string;
  teacher: string;
  teacherPhoto: string;
  assignedDate: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  submissionDate?: string;
  submissionNotes?: string;
  grade?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
  attachments?: { name: string; type: string; url: string }[];
  // Homework content
  questions?: HomeworkQuestion[];
  contentType?: "questions" | "essay" | "project" | "worksheet";
  essayPrompt?: string;
  projectDescription?: string;
  // Student submission files
  submittedFiles?: SubmittedFile[];
  // Teacher graded files
  gradedFiles?: GradedFile[];
}

// Mock Data
const MOCK_HOMEWORK: Record<string, Homework> = {
  "hw-001": {
    id: "hw-001",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Physics",
    title: "Complete Chapter 5 Exercise",
    description: "Solve all exercises from Chapter 5: Motion and Force. Show all workings clearly.",
    instructions: "1. Read Chapter 5 carefully before attempting the exercises.\n2. Show all workings and formulas used.\n3. Draw diagrams where necessary.\n4. Write answers in the provided exercise book.\n5. Submit before the due date to avoid late penalties.",
    teacher: "Mrs. Nkechi Eze",
    teacherPhoto: "https://i.pravatar.cc/150?u=nkechi",
    assignedDate: "2024-01-20",
    dueDate: "2024-01-25",
    status: "graded",
    submissionDate: "2024-01-24",
    submissionNotes: "Completed all exercises. Had some difficulty with question 7 but tried my best.",
    grade: "A",
    score: 18,
    maxScore: 20,
    feedback: "Excellent work, Adaeze! Your understanding of motion and force concepts is commendable. The diagrams were well-drawn and calculations were accurate. For question 7, remember to always consider friction in real-world scenarios. Keep up the great work!",
    attachments: [
      { name: "Chapter 5 Exercises.pdf", type: "pdf", url: "#" },
    ],
    contentType: "questions",
    questions: [
      { id: "q1", number: 1, question: "Define motion and give two examples of objects in motion.", marks: 2, type: "short" },
      { id: "q2", number: 2, question: "What is the difference between speed and velocity? Explain with an example.", marks: 3, type: "long" },
      { id: "q3", number: 3, question: "A car travels 120 km in 2 hours. Calculate its average speed.", marks: 2, type: "short" },
      { id: "q4", number: 4, question: "State Newton's First Law of Motion. Why is it also called the Law of Inertia?", marks: 3, type: "long" },
      { id: "q5", number: 5, question: "Which of the following is a unit of force?", marks: 1, type: "multiple-choice", options: ["Meter (m)", "Newton (N)", "Kilogram (kg)", "Second (s)"] },
      { id: "q6", number: 6, question: "A force of 50N acts on a mass of 10kg. Calculate the acceleration produced.", marks: 2, type: "short" },
      { id: "q7", number: 7, question: "Draw a free body diagram of a book resting on a table. Label all the forces acting on it.", marks: 3, type: "diagram" },
      { id: "q8", number: 8, question: "Explain how friction can be both helpful and harmful. Give two examples of each.", marks: 4, type: "long" },
    ],
    submittedFiles: [
      { id: "sf1", name: "Adaeze_Physics_Ch5_Exercise.pdf", type: "pdf", url: "/samples/student-submission.pdf", uploadedAt: "2024-01-24T14:30:00", size: "2.4 MB" },
      { id: "sf2", name: "Question_7_Diagram.jpg", type: "image", url: "/samples/diagram.jpg", uploadedAt: "2024-01-24T14:32:00", size: "856 KB" },
    ],
    gradedFiles: [
      { id: "gf1", name: "Adaeze_Physics_Ch5_GRADED.pdf", type: "pdf", url: "/samples/graded-submission.pdf", gradedAt: "2024-01-25T09:15:00", size: "2.8 MB", hasAnnotations: true },
    ],
  },
  "hw-002": {
    id: "hw-002",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Chemistry",
    title: "Lab Report on Acid-Base Reactions",
    description: "Write a detailed lab report on the acid-base titration experiment conducted in class.",
    instructions: "1. Use the standard lab report format.\n2. Include: Title, Aim, Apparatus, Method, Results, Calculations, Conclusion.\n3. Draw the apparatus setup diagram.\n4. Show all calculations with units.\n5. Minimum 3 pages, handwritten or typed.",
    teacher: "Mr. Chidi Okoro",
    teacherPhoto: "https://i.pravatar.cc/150?u=chidi",
    assignedDate: "2024-01-22",
    dueDate: "2024-01-26",
    status: "submitted",
    submissionDate: "2024-01-25",
    submissionNotes: "Lab report completed with all sections. Attached scanned copy.",
    contentType: "project",
    projectDescription: "Write a comprehensive lab report on the acid-base titration experiment. Your report should include:\n\n**Title:** Determination of the Concentration of an Unknown Acid using Acid-Base Titration\n\n**Aim:** To determine the concentration of hydrochloric acid (HCl) by titrating it against a standard solution of sodium hydroxide (NaOH).\n\n**Required Sections:**\n\n1. **Apparatus and Materials**\n   - List all equipment used (burette, pipette, conical flask, etc.)\n   - List all chemicals and their concentrations\n\n2. **Method/Procedure**\n   - Step-by-step description of the experiment\n   - Include safety precautions taken\n\n3. **Results**\n   - Record all titration readings in a table\n   - Include initial and final burette readings\n   - Calculate the volume of NaOH used\n\n4. **Calculations**\n   - Use the formula: C₁V₁ = C₂V₂\n   - Show all working clearly\n   - Include units in your calculations\n\n5. **Conclusion**\n   - State the concentration of the unknown acid\n   - Discuss sources of error\n   - Suggest improvements\n\n**Assessment Criteria:**\n- Accuracy of results (5 marks)\n- Clarity of method (4 marks)\n- Quality of calculations (4 marks)\n- Diagram quality (3 marks)\n- Conclusion and analysis (4 marks)\n\n**Total: 20 marks**",
    submittedFiles: [
      { id: "sf3", name: "Adaeze_Chemistry_Lab_Report.pdf", type: "pdf", url: "/samples/lab-report.pdf", uploadedAt: "2024-01-25T16:45:00", size: "3.1 MB" },
      { id: "sf4", name: "Apparatus_Setup_Photo.jpg", type: "image", url: "/samples/apparatus.jpg", uploadedAt: "2024-01-25T16:47:00", size: "1.2 MB" },
    ],
  },
  "hw-003": {
    id: "hw-003",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Mathematics",
    title: "Quadratic Equations Worksheet",
    description: "Complete the worksheet on solving quadratic equations using factorization and formula methods.",
    instructions: "1. Solve questions 1-10 using factorization method.\n2. Solve questions 11-20 using quadratic formula.\n3. Show all steps clearly.\n4. Verify your answers by substitution.\n5. Neatness counts!",
    teacher: "Mr. Tunde Adeyemi",
    teacherPhoto: "https://i.pravatar.cc/150?u=tunde",
    assignedDate: "2024-01-23",
    dueDate: "2024-01-27",
    status: "pending",
    attachments: [
      { name: "Quadratic Worksheet.pdf", type: "pdf", url: "#" },
    ],
  },
  "hw-004": {
    id: "hw-004",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "English Language",
    title: "Essay Writing: My Favorite Place",
    description: "Write a 500-word descriptive essay about your favorite place. Use vivid imagery and sensory details.",
    instructions: "1. Choose a place that is meaningful to you.\n2. Use descriptive language and sensory details.\n3. Organize your essay with introduction, body, and conclusion.\n4. Proofread for spelling and grammar.\n5. Word count: 450-550 words.",
    teacher: "Mrs. Funke Adeleke",
    teacherPhoto: "https://i.pravatar.cc/150?u=funke",
    assignedDate: "2024-01-18",
    dueDate: "2024-01-22",
    status: "graded",
    submissionDate: "2024-01-21",
    grade: "B",
    score: 15,
    maxScore: 20,
    feedback: "Good effort, Adaeze! Your essay has a clear structure and some nice descriptive passages. To improve, try to use more varied vocabulary and include more sensory details (sounds, smells, textures). Also, watch out for run-on sentences in the second paragraph.",
    submittedFiles: [
      { id: "sf5", name: "Adaeze_Essay_My_Favorite_Place.pdf", type: "pdf", url: "/samples/essay-submission.pdf", uploadedAt: "2024-01-21T10:15:00", size: "1.2 MB" },
    ],
    gradedFiles: [
      { id: "gf2", name: "Adaeze_Essay_GRADED.pdf", type: "pdf", url: "/samples/essay-graded.pdf", gradedAt: "2024-01-22T14:30:00", size: "1.5 MB", hasAnnotations: true },
    ],
  },
  "hw-005": {
    id: "hw-005",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Biology",
    title: "Cell Structure Diagram",
    description: "Draw and label a detailed diagram of an animal cell and a plant cell. Include all organelles.",
    instructions: "1. Use A4 size paper.\n2. Draw both cells side by side.\n3. Label all organelles clearly.\n4. Use colors to differentiate parts.\n5. Include a comparison table below the diagrams.",
    teacher: "Dr. Amina Bello",
    teacherPhoto: "https://i.pravatar.cc/150?u=amina",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-20",
    status: "overdue",
  },
  "hw-006": {
    id: "hw-006",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "SS 1",
    section: "B",
    subject: "Physics",
    title: "Newton's Laws Problems",
    description: "Solve problems 1-15 from the textbook on Newton's Laws of Motion.",
    instructions: "1. Read the chapter on Newton's Laws first.\n2. Attempt all 15 problems.\n3. Show all workings with proper units.\n4. Draw free body diagrams where applicable.\n5. Box your final answers.",
    teacher: "Mr. Emeka Obi",
    teacherPhoto: "https://i.pravatar.cc/150?u=emeka",
    assignedDate: "2024-01-24",
    dueDate: "2024-01-30",
    status: "pending",
  },
  "hw-007": {
    id: "hw-007",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 2",
    section: "A",
    subject: "Social Studies",
    title: "Nigerian Government Structure",
    description: "Research and write about the three arms of government in Nigeria.",
    instructions: "1. Cover all three arms: Executive, Legislative, Judiciary.\n2. Explain the functions of each arm.\n3. Discuss how they work together.\n4. Include examples of current office holders.\n5. Minimum 2 pages.",
    teacher: "Mr. Yusuf Ibrahim",
    teacherPhoto: "https://i.pravatar.cc/150?u=yusuf",
    assignedDate: "2024-01-25",
    dueDate: "2024-02-01",
    status: "pending",
  },
  "hw-008": {
    id: "hw-008",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 1",
    section: "A",
    subject: "Mathematics",
    title: "Algebra Basics Worksheet",
    description: "Complete exercises 1-20 on basic algebraic expressions and equations.",
    instructions: "1. Solve all 20 exercises showing full working.\n2. Use proper algebraic notation.\n3. Check your answers by substitution.\n4. Highlight any questions you found difficult.\n5. Submit in your math exercise book.",
    teacher: "Mr. Tunde Adeyemi",
    teacherPhoto: "https://i.pravatar.cc/150?u=tunde",
    assignedDate: "2023-11-10",
    dueDate: "2023-11-17",
    status: "graded",
    submissionDate: "2023-11-15",
    grade: "A",
    score: 19,
    maxScore: 20,
    feedback: "Outstanding work! Perfect understanding of algebraic concepts. Your step-by-step approach is excellent.",
    attachments: [
      { name: "Algebra_Basics_Worksheet.pdf", type: "pdf", url: "#" },
    ],
    submittedFiles: [
      { id: "sf6", name: "Adaeze_Algebra_Worksheet.pdf", type: "pdf", url: "/samples/algebra-submission.pdf", uploadedAt: "2023-11-15T09:30:00", size: "1.8 MB" },
    ],
    gradedFiles: [
      { id: "gf3", name: "Adaeze_Algebra_GRADED.pdf", type: "pdf", url: "/samples/algebra-graded.pdf", gradedAt: "2023-11-17T11:00:00", size: "2.1 MB", hasAnnotations: true },
    ],
  },
  "hw-009": {
    id: "hw-009",
    childId: "child-002",
    childName: "Chukwuemeka Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=chukwuemeka",
    class: "JSS 3",
    section: "B",
    subject: "English Language",
    title: "Book Report: Things Fall Apart",
    description: "Write a comprehensive book report on Chinua Achebe's Things Fall Apart.",
    instructions: "1. Include a brief summary of the plot.\n2. Analyze the main characters (Okonkwo, Nwoye, Ezinma).\n3. Discuss the major themes (tradition vs. change, masculinity, colonialism).\n4. Share your personal opinion of the book.\n5. Minimum 1000 words.",
    teacher: "Mrs. Funke Adeleke",
    teacherPhoto: "https://i.pravatar.cc/150?u=funke",
    assignedDate: "2023-10-05",
    dueDate: "2023-10-20",
    status: "graded",
    submissionDate: "2023-10-18",
    grade: "B",
    score: 16,
    maxScore: 20,
    feedback: "Good analysis of themes. Work on deeper character exploration. Your summary was excellent but the character analysis could be more detailed.",
    submittedFiles: [
      { id: "sf7", name: "Chukwuemeka_Things_Fall_Apart_Report.pdf", type: "pdf", url: "/samples/book-report.pdf", uploadedAt: "2023-10-18T15:20:00", size: "2.3 MB" },
      { id: "sf8", name: "Character_Analysis_Notes.jpg", type: "image", url: "/samples/character-notes.jpg", uploadedAt: "2023-10-18T15:22:00", size: "980 KB" },
    ],
    gradedFiles: [
      { id: "gf4", name: "Chukwuemeka_Book_Report_GRADED.pdf", type: "pdf", url: "/samples/book-report-graded.pdf", gradedAt: "2023-10-20T10:45:00", size: "2.6 MB", hasAnnotations: true },
    ],
  },
  "hw-010": {
    id: "hw-010",
    childId: "child-001",
    childName: "Adaeze Okonkwo",
    childPhoto: "https://i.pravatar.cc/150?u=adaeze",
    class: "JSS 1",
    section: "A",
    subject: "Biology",
    title: "Ecosystem Project",
    description: "Create a poster showing the food chain in a local ecosystem.",
    instructions: "1. Choose a local ecosystem (forest, river, farmland).\n2. Draw a clear food chain with at least 5 organisms.\n3. Label producers, primary consumers, secondary consumers, and decomposers.\n4. Use colors to differentiate trophic levels.\n5. Include a brief explanation of energy flow.",
    teacher: "Dr. Amina Bello",
    teacherPhoto: "https://i.pravatar.cc/150?u=amina",
    assignedDate: "2023-09-15",
    dueDate: "2023-09-25",
    status: "graded",
    submissionDate: "2023-09-24",
    grade: "A",
    score: 18,
    maxScore: 20,
    feedback: "Excellent visual representation. Great attention to detail. The food chain is accurate and well-illustrated. Minor improvement: include more details about decomposers.",
    submittedFiles: [
      { id: "sf9", name: "Adaeze_Ecosystem_Poster.jpg", type: "image", url: "/samples/ecosystem-poster.jpg", uploadedAt: "2023-09-24T14:00:00", size: "3.5 MB" },
      { id: "sf10", name: "Adaeze_Ecosystem_Explanation.pdf", type: "pdf", url: "/samples/ecosystem-explanation.pdf", uploadedAt: "2023-09-24T14:05:00", size: "890 KB" },
    ],
    gradedFiles: [
      { id: "gf5", name: "Adaeze_Ecosystem_GRADED.pdf", type: "pdf", url: "/samples/ecosystem-graded.pdf", gradedAt: "2023-09-25T16:30:00", size: "4.2 MB", hasAnnotations: true },
    ],
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusConfig(status: Homework["status"]) {
  switch (status) {
    case "graded":
      return {
        label: "Graded",
        icon: CheckCircle2,
        className: "bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
        dotColor: "bg-emerald-500",
      };
    case "submitted":
      return {
        label: "Submitted",
        icon: Clock,
        className: "bg-blue-50/80 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
        dotColor: "bg-blue-500",
      };
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-50/80 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
        dotColor: "bg-amber-500",
      };
    case "overdue":
      return {
        label: "Overdue",
        icon: AlertTriangle,
        className: "bg-red-50/80 dark:bg-red-950/30 text-red-600 dark:text-red-400",
        dotColor: "bg-red-500",
      };
  }
}

export default function HomeworkDetailPage() {
  const params = useParams();
  const homeworkId = params?.id as string;
  const isPageLoading = usePageLoad(600);

  // State for file preview modal
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    type: "pdf" | "image" | "document";
    url: string;
    size: string;
    isGraded?: boolean;
    hasAnnotations?: boolean;
  } | null>(null);

  const homework = MOCK_HOMEWORK[homeworkId];

  if (isPageLoading) {
    return <PageLoader isLoading={true} />;
  }

  if (!homework) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Homework Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The homework assignment you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/parents/homework">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homework
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const statusConfig = getStatusConfig(homework.status);
  const StatusIcon = statusConfig.icon;

  return (
    <MainLayout>
      <div className="space-y-5 sm:space-y-6">
        {/* Header */}
        <PageHeader
          title="Homework Details"
          breadcrumbs={[
            { label: "Parent Portal", href: "/parents" },
            { label: "Homework", href: "/parents/homework" },
            { label: homework.title },
          ]}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Left Column - Assignment Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Assignment Info Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden">
              {/* Header Section */}
              <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                        <BookOpen className="w-3 h-3" />
                        {homework.subject}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${statusConfig.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                        {statusConfig.label}
                      </span>
                    </div>
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {homework.title}
                    </h1>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {homework.description}
                </p>
              </div>

              {/* Instructions */}
              <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Instructions
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3.5 leading-relaxed">
                  {homework.instructions}
                </div>
              </div>

              {/* Homework Questions/Content */}
              {homework.questions && homework.questions.length > 0 && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Homework Questions
                    <span className="ml-auto text-xs font-normal text-gray-400">
                      {homework.questions.length} questions • {homework.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {homework.questions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                            {q.number}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {q.question}
                            </p>
                            {q.options && (
                              <div className="mt-2 space-y-1.5">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs">
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-3">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                q.type === "short" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                                q.type === "long" ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" :
                                q.type === "multiple-choice" ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
                                "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                              }`}>
                                {q.type === "multiple-choice" ? "MCQ" : q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {q.marks} {q.marks === 1 ? "mark" : "marks"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Description */}
              {homework.projectDescription && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Project Brief
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-4 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    {homework.projectDescription.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <p key={i} className="font-semibold text-gray-800 dark:text-gray-200 mt-3 first:mt-0">{line.replace(/\*\*/g, "")}</p>;
                      }
                      if (line.startsWith("- ")) {
                        return <p key={i} className="ml-4 text-gray-600 dark:text-gray-400">{line}</p>;
                      }
                      return <p key={i} className={line.trim() === "" ? "h-2" : ""}>{line}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {homework.attachments && homework.attachments.length > 0 && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-gray-400" />
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {homework.attachments.map((attachment, idx) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        className="group flex items-center gap-3 p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 transition-colors duration-150"
                      >
                        <div className="p-2 rounded-md bg-rose-50 dark:bg-rose-900/20">
                          <FileText className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        </div>
                        <span className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                          {attachment.name}
                        </span>
                        <Download className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Info (if submitted or graded) */}
              {(homework.status === "submitted" || homework.status === "graded") && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Submission
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">Submitted:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {homework.submissionDate && formatDate(homework.submissionDate)}
                      </span>
                    </div>
                    {homework.submissionNotes && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg p-3">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Note:</span>{" "}
                        {homework.submissionNotes}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Student Submitted Files */}
              {homework.submittedFiles && homework.submittedFiles.length > 0 && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Student&apos;s Submitted Work
                    <span className="ml-auto text-xs font-normal text-gray-400">
                      {homework.submittedFiles.length} {homework.submittedFiles.length === 1 ? "file" : "files"}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {homework.submittedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center gap-3 p-3 rounded-lg bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${
                          file.type === "pdf" ? "bg-rose-50 dark:bg-rose-900/20" :
                          file.type === "image" ? "bg-purple-50 dark:bg-purple-900/20" :
                          "bg-blue-50 dark:bg-blue-900/20"
                        }`}>
                          <FileText className={`w-4 h-4 ${
                            file.type === "pdf" ? "text-rose-500 dark:text-rose-400" :
                            file.type === "image" ? "text-purple-500 dark:text-purple-400" :
                            "text-blue-500 dark:text-blue-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>Uploaded {new Date(file.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPreviewFile({
                                name: file.name,
                                type: file.type,
                                url: file.url,
                                size: file.size,
                                isGraded: false,
                              });
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer active:scale-95"
                            title="View file"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const link = document.createElement("a");
                              link.href = file.url;
                              link.download = file.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer active:scale-95"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher Graded Files */}
              {homework.gradedFiles && homework.gradedFiles.length > 0 && (
                <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-700/40">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    Teacher&apos;s Graded Work
                    <span className="ml-auto text-xs font-normal text-gray-400">
                      {homework.gradedFiles.length} {homework.gradedFiles.length === 1 ? "file" : "files"}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {homework.gradedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center gap-3 p-3 rounded-lg bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${
                          file.type === "pdf" ? "bg-rose-50 dark:bg-rose-900/20" :
                          file.type === "image" ? "bg-purple-50 dark:bg-purple-900/20" :
                          "bg-emerald-50 dark:bg-emerald-900/20"
                        }`}>
                          <FileText className={`w-4 h-4 ${
                            file.type === "pdf" ? "text-rose-500 dark:text-rose-400" :
                            file.type === "image" ? "text-purple-500 dark:text-purple-400" :
                            "text-emerald-500 dark:text-emerald-400"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                              {file.name}
                            </p>
                            {file.hasAnnotations && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                <MessageSquare className="w-3 h-3" />
                                Annotated
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>Graded {new Date(file.gradedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPreviewFile({
                                name: file.name,
                                type: file.type,
                                url: file.url,
                                size: file.size,
                                isGraded: true,
                                hasAnnotations: file.hasAnnotations,
                              });
                            }}
                            className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer active:scale-95"
                            title="View graded file"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const link = document.createElement("a");
                              link.href = file.url;
                              link.download = file.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer active:scale-95"
                            title="Download graded file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    View the graded files to see teacher&apos;s corrections and comments
                  </p>
                </div>
              )}

              {/* Grade and Feedback (if graded) */}
              {homework.status === "graded" && (
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Grade & Feedback
                  </h3>

                  {/* Score Display */}
                  <div className="flex items-center gap-4 sm:gap-5 mb-4 p-3.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                      homework.grade === "A" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      homework.grade === "B" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      homework.grade === "C" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {homework.grade}
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                        {homework.score}<span className="text-gray-300 dark:text-gray-600 font-normal">/</span>{homework.maxScore}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {((homework.score! / homework.maxScore!) * 100).toFixed(0)}% Score
                      </p>
                    </div>
                  </div>

                  {/* Feedback */}
                  {homework.feedback && (
                    <div className="bg-amber-50/40 dark:bg-amber-900/10 rounded-lg p-3.5">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                            Teacher&apos;s Feedback
                          </p>
                          <p className="text-sm text-amber-600/90 dark:text-amber-300/80 leading-relaxed">
                            {homework.feedback}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 sm:space-y-5">
            {/* Student Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Student
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
                  <Image
                    src={homework.childPhoto}
                    alt={homework.childName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {homework.childName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {homework.class} - {homework.section}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Teacher
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
                  <Image
                    src={homework.teacherPhoto}
                    alt={homework.teacher}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {homework.teacher}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {homework.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* Dates Card */}
            <div className="bg-white dark:bg-gray-800/95 rounded-xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Assigned</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {formatDate(homework.assignedDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${homework.status === "overdue" ? "bg-red-400" : "bg-gray-300 dark:bg-gray-600"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 dark:text-gray-500">Due Date</p>
                    <p className={`text-sm ${homework.status === "overdue" ? "text-red-500 dark:text-red-400 font-medium" : "text-gray-700 dark:text-gray-200"}`}>
                      {formatDate(homework.dueDate)}
                    </p>
                  </div>
                </div>
                {homework.submissionDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 dark:text-gray-500">Submitted</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">
                        {formatDate(homework.submissionDate)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Alert */}
            {homework.status === "overdue" && (
              <div className="bg-red-50/50 dark:bg-red-900/10 rounded-xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Assignment Overdue
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/70 mt-0.5 leading-relaxed">
                      Contact the teacher for late submission options.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {homework.status === "pending" && (
              <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                      Awaiting Submission
                    </p>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5 leading-relaxed">
                      Due on {formatDate(homework.dueDate)}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            <Link href="/parents/homework" className="block">
              <Button variant="outline" className="w-full text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Homework
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        file={previewFile}
      />
    </MainLayout>
  );
}
