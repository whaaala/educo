"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number; // percentage from left
  startTime: number;
}

export interface ReactionOverlayProps {
  /** Call this with an emoji string to trigger a floating reaction */
  reactions: FloatingReaction[];
}

// Duration in ms for each emoji to float up and fade
const ANIMATION_DURATION = 3000;

export function useReactionOverlay() {
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const counterRef = useRef(0);

  const addReaction = useCallback((emoji: string) => {
    const id = `reaction-${Date.now()}-${counterRef.current++}`;
    // Random horizontal position between 10% and 90%
    const x = 10 + Math.random() * 80;
    const newReaction: FloatingReaction = {
      id,
      emoji,
      x,
      startTime: Date.now(),
    };
    setReactions((prev) => [...prev, newReaction]);

    // Remove after animation
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, ANIMATION_DURATION);
  }, []);

  return { reactions, addReaction };
}

export function ReactionOverlay({ reactions }: ReactionOverlayProps) {
  if (reactions.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {reactions.map((reaction) => (
        <div
          key={reaction.id}
          className="absolute bottom-0 text-5xl"
          style={{
            left: `${reaction.x}%`,
            animation: `floatUpReaction ${ANIMATION_DURATION}ms ease-out forwards`,
          }}
        >
          {reaction.emoji}
        </div>
      ))}

      {/* CSS keyframe animation */}
      <style>{`
        @keyframes floatUpReaction {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-40vh) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-80vh) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ReactionOverlay;
