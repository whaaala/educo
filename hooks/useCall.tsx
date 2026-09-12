"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import CallModal, { CallType, Participant } from "@/components/communication/CallModal";
import { stopAllMediaTracks } from "@/lib/utils/stopAllMedia";

interface CallState {
  isOpen: boolean;
  participant: Participant | null;
  additionalParticipants: Participant[];
  callType?: CallType;
  roomId?: string;
  showTypeSelection: boolean;
  callContext?: string;
}

interface CallContextType {
  // Start a call with type selection
  startCall: (participant: Participant, options?: StartCallOptions) => void;
  // Start a specific type of call directly
  startVideoCall: (participant: Participant, options?: StartCallOptions) => void;
  startVoiceCall: (participant: Participant, options?: StartCallOptions) => void;
  startChat: (participant: Participant, options?: StartCallOptions) => void;
  // Start a conference call with multiple participants
  startConference: (
    participants: Participant[],
    callType?: CallType,
    options?: StartCallOptions
  ) => void;
  // Close the call modal
  closeCall: () => void;
  // Check if a call is active
  isCallActive: boolean;
}

interface StartCallOptions {
  roomId?: string;
  callContext?: string;
  additionalParticipants?: Participant[];
}

const CallContext = createContext<CallContextType | null>(null);

interface CallProviderProps {
  children: ReactNode;
  currentUser: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
}

export function CallProvider({ children, currentUser }: CallProviderProps) {
  const [callState, setCallState] = useState<CallState>({
    isOpen: false,
    participant: null,
    additionalParticipants: [],
    showTypeSelection: true,
  });

  const startCall = useCallback(
    (participant: Participant, options?: StartCallOptions) => {
      setCallState({
        isOpen: true,
        participant,
        additionalParticipants: options?.additionalParticipants || [],
        showTypeSelection: true,
        roomId: options?.roomId,
        callContext: options?.callContext,
      });
    },
    []
  );

  const startVideoCall = useCallback(
    (participant: Participant, options?: StartCallOptions) => {
      setCallState({
        isOpen: true,
        participant,
        additionalParticipants: options?.additionalParticipants || [],
        callType: "video",
        showTypeSelection: false,
        roomId: options?.roomId,
        callContext: options?.callContext,
      });
    },
    []
  );

  const startVoiceCall = useCallback(
    (participant: Participant, options?: StartCallOptions) => {
      setCallState({
        isOpen: true,
        participant,
        additionalParticipants: options?.additionalParticipants || [],
        callType: "voice",
        showTypeSelection: false,
        roomId: options?.roomId,
        callContext: options?.callContext,
      });
    },
    []
  );

  const startChat = useCallback(
    (participant: Participant, options?: StartCallOptions) => {
      setCallState({
        isOpen: true,
        participant,
        additionalParticipants: options?.additionalParticipants || [],
        callType: "chat",
        showTypeSelection: false,
        roomId: options?.roomId,
        callContext: options?.callContext,
      });
    },
    []
  );

  const startConference = useCallback(
    (
      participants: Participant[],
      callType?: CallType,
      options?: StartCallOptions
    ) => {
      if (participants.length === 0) return;

      const [primary, ...additional] = participants;
      setCallState({
        isOpen: true,
        participant: primary,
        additionalParticipants: additional,
        callType,
        showTypeSelection: !callType,
        roomId: options?.roomId,
        callContext: options?.callContext || "Conference Call",
      });
    },
    []
  );

  const closeCall = useCallback(() => {
    // NUCLEAR: Stop all media tracks FIRST before updating state
    console.log('[useCall] closeCall - stopping all media tracks');
    stopAllMediaTracks();

    // Then update state to close modal
    setCallState({
      isOpen: false,
      participant: null,
      additionalParticipants: [],
      showTypeSelection: true,
    });
  }, []);

  return (
    <CallContext.Provider
      value={{
        startCall,
        startVideoCall,
        startVoiceCall,
        startChat,
        startConference,
        closeCall,
        isCallActive: callState.isOpen,
      }}
    >
      {children}
      {callState.participant && (
        <CallModal
          isOpen={callState.isOpen}
          onClose={closeCall}
          participant={callState.participant}
          additionalParticipants={callState.additionalParticipants}
          currentUser={currentUser}
          callType={callState.callType}
          roomId={callState.roomId}
          showTypeSelection={callState.showTypeSelection}
          callContext={callState.callContext}
        />
      )}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
}

// Helper hook to get mock current user (replace with real auth in production)
export function useMockCurrentUser() {
  return {
    id: `user-${Date.now()}`,
    name: "Current User",
    avatar: `https://i.pravatar.cc/150?u=current-user`,
    role: "Staff",
  };
}
