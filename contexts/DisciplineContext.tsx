"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DisciplinaryAction, Complaint, CreateDisciplinaryAction, CreateComplaint } from "@/types/discipline";

interface DisciplineContextType {
  // Disciplinary Actions
  disciplinaryActions: DisciplinaryAction[];
  addDisciplinaryAction: (staffData: any, actionData: CreateDisciplinaryAction) => void;
  updateDisciplinaryAction: (actionId: string, updates: Partial<DisciplinaryAction>) => void;
  deleteDisciplinaryAction: (actionId: string) => void;
  getStaffDisciplinaryActions: (staffId: string) => DisciplinaryAction[];
  getDisciplinaryActionById: (actionId: string) => DisciplinaryAction | undefined;

  // Complaints
  complaints: Complaint[];
  addComplaint: (complaintData: CreateComplaint) => void;
  updateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  deleteComplaint: (complaintId: string) => void;
  getStaffComplaints: (staffId: string) => Complaint[];
  getComplaintById: (complaintId: string) => Complaint | undefined;
}

const DisciplineContext = createContext<DisciplineContextType | undefined>(undefined);

const ACTIONS_STORAGE_KEY = "educo_disciplinary_actions";
const COMPLAINTS_STORAGE_KEY = "educo_complaints";
const VERSION_KEY = "educo_discipline_version";
const CURRENT_VERSION = "1.0";

export function DisciplineProvider({ children }: { children: ReactNode }) {
  const [disciplinaryActions, setDisciplinaryActions] = useState<DisciplinaryAction[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);
      const storedActions = localStorage.getItem(ACTIONS_STORAGE_KEY);
      const storedComplaints = localStorage.getItem(COMPLAINTS_STORAGE_KEY);

      if (storedVersion === CURRENT_VERSION) {
        if (storedActions) {
          const parsedActions = JSON.parse(storedActions);
          setDisciplinaryActions(parsedActions);
          console.log("Discipline Context: Loaded disciplinary actions from localStorage", parsedActions);
        }
        if (storedComplaints) {
          const parsedComplaints = JSON.parse(storedComplaints);
          setComplaints(parsedComplaints);
          console.log("Discipline Context: Loaded complaints from localStorage", parsedComplaints);
        }
      } else {
        // Version mismatch or no data, start fresh
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Discipline Context: Error loading from localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save disciplinary actions to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(disciplinaryActions));
        console.log("Discipline Context: Saved disciplinary actions to localStorage", disciplinaryActions);
      } catch (error) {
        console.error("Discipline Context: Error saving disciplinary actions to localStorage", error);
      }
    }
  }, [disciplinaryActions, isHydrated]);

  // Save complaints to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
        console.log("Discipline Context: Saved complaints to localStorage", complaints);
      } catch (error) {
        console.error("Discipline Context: Error saving complaints to localStorage", error);
      }
    }
  }, [complaints, isHydrated]);

  // Disciplinary Action Functions
  const addDisciplinaryAction = (staffData: any, actionData: CreateDisciplinaryAction) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `DA${timestamp}${random}`;

    const newAction: DisciplinaryAction = {
      id: uniqueId,
      staffId: actionData.staffId,
      staffName: staffData.staffName,
      staffEmail: staffData.staffEmail,
      staffDepartment: staffData.staffDepartment,
      staffPosition: staffData.staffPosition,
      profilePhoto: staffData.profilePhoto,
      incidentType: actionData.incidentType,
      incidentDate: actionData.incidentDate,
      incidentTime: actionData.incidentTime,
      incidentLocation: actionData.incidentLocation,
      severity: actionData.severity,
      status: "reported",
      incidentDescription: actionData.incidentDescription,
      witnessNames: actionData.witnessNames,
      reportedBy: actionData.reportedBy,
      reportedByName: actionData.reportedByName,
      reportedByRole: actionData.reportedByRole,
      reportedDate: new Date().toISOString().split("T")[0],
      followUpRequired: false,
      employeeAcknowledged: false,
      hrReviewed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDisciplinaryActions(prev => [newAction, ...prev]);
    console.log("Discipline Context: Added new disciplinary action", newAction);
  };

  const updateDisciplinaryAction = (actionId: string, updates: Partial<DisciplinaryAction>) => {
    setDisciplinaryActions(prev =>
      prev.map(action =>
        action.id === actionId
          ? { ...action, ...updates, updatedAt: new Date().toISOString() }
          : action
      )
    );
    console.log("Discipline Context: Updated disciplinary action", actionId, updates);
  };

  const deleteDisciplinaryAction = (actionId: string) => {
    setDisciplinaryActions(prev => prev.filter(action => action.id !== actionId));
    console.log("Discipline Context: Deleted disciplinary action", actionId);
  };

  const getStaffDisciplinaryActions = (staffId: string): DisciplinaryAction[] => {
    return disciplinaryActions.filter(action => action.staffId === staffId);
  };

  const getDisciplinaryActionById = (actionId: string): DisciplinaryAction | undefined => {
    return disciplinaryActions.find(action => action.id === actionId);
  };

  // Complaint Functions
  const addComplaint = (complaintData: CreateComplaint) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `CP${timestamp}${random}`;

    const newComplaint: Complaint = {
      id: uniqueId,
      isAnonymous: complaintData.isAnonymous,
      complainantId: complaintData.complainantId,
      complainantName: complaintData.complainantName,
      complainantEmail: complaintData.complainantEmail,
      complainantDepartment: complaintData.isAnonymous ? undefined : complaintData.complainantId,
      complainantPosition: complaintData.isAnonymous ? undefined : complaintData.complainantId,
      againstStaffId: complaintData.againstStaffId,
      againstStaffName: complaintData.againstStaffName,
      complaintType: complaintData.complaintType,
      complaintDate: new Date().toISOString().split("T")[0],
      status: "submitted",
      priority: complaintData.priority,
      subject: complaintData.subject,
      description: complaintData.description,
      incidentDate: complaintData.incidentDate,
      location: complaintData.location,
      witnesses: complaintData.witnesses,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setComplaints(prev => [newComplaint, ...prev]);
    console.log("Discipline Context: Added new complaint", newComplaint);
  };

  const updateComplaint = (complaintId: string, updates: Partial<Complaint>) => {
    setComplaints(prev =>
      prev.map(complaint =>
        complaint.id === complaintId
          ? { ...complaint, ...updates, updatedAt: new Date().toISOString() }
          : complaint
      )
    );
    console.log("Discipline Context: Updated complaint", complaintId, updates);
  };

  const deleteComplaint = (complaintId: string) => {
    setComplaints(prev => prev.filter(complaint => complaint.id !== complaintId));
    console.log("Discipline Context: Deleted complaint", complaintId);
  };

  const getStaffComplaints = (staffId: string): Complaint[] => {
    return complaints.filter(
      complaint => complaint.complainantId === staffId || complaint.againstStaffId === staffId
    );
  };

  const getComplaintById = (complaintId: string): Complaint | undefined => {
    return complaints.find(complaint => complaint.id === complaintId);
  };

  const value: DisciplineContextType = {
    disciplinaryActions,
    addDisciplinaryAction,
    updateDisciplinaryAction,
    deleteDisciplinaryAction,
    getStaffDisciplinaryActions,
    getDisciplinaryActionById,
    complaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    getStaffComplaints,
    getComplaintById,
  };

  return (
    <DisciplineContext.Provider value={value}>
      {children}
    </DisciplineContext.Provider>
  );
}

export function useDiscipline() {
  const context = useContext(DisciplineContext);
  if (context === undefined) {
    throw new Error("useDiscipline must be used within a DisciplineProvider");
  }
  return context;
}
