"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PerformanceReview, CreatePerformanceReview } from "@/types/performance";

interface PerformanceContextType {
  reviews: PerformanceReview[];
  addReview: (reviewData: CreatePerformanceReview & {
    staffName: string;
    staffEmail: string;
    staffDepartment: string;
    staffPosition: string;
    profilePhoto?: string;
  }) => void;
  updateReview: (reviewId: string, updates: Partial<PerformanceReview>) => void;
  deleteReview: (reviewId: string) => void;
  getStaffReviews: (staffId: string) => PerformanceReview[];
  getReviewById: (reviewId: string) => PerformanceReview | undefined;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

const STORAGE_KEY = "educo_performance_reviews";
const VERSION_KEY = "educo_performance_version";
const CURRENT_VERSION = "1.0";

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem(VERSION_KEY);
      const storedReviews = localStorage.getItem(STORAGE_KEY);

      if (storedVersion === CURRENT_VERSION && storedReviews) {
        const parsed = JSON.parse(storedReviews);
        setReviews(parsed);
        console.log("Performance Context: Loaded reviews from localStorage", parsed);
      } else {
        // Version mismatch or no data, start fresh
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
    } catch (error) {
      console.error("Performance Context: Error loading from localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever reviews change (but only after initial hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        console.log("Performance Context: Saved to localStorage", reviews);
      } catch (error) {
        console.error("Performance Context: Error saving to localStorage", error);
      }
    }
  }, [reviews, isHydrated]);

  const addReview = (reviewData: CreatePerformanceReview & {
    staffName: string;
    staffEmail: string;
    staffDepartment: string;
    staffPosition: string;
    profilePhoto?: string;
  }) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const uniqueId = `PR${timestamp}${random}`;

    const newReview: PerformanceReview = {
      id: uniqueId,
      staffId: reviewData.staffId,
      staffName: reviewData.staffName,
      staffEmail: reviewData.staffEmail,
      staffDepartment: reviewData.staffDepartment,
      staffPosition: reviewData.staffPosition,
      profilePhoto: reviewData.profilePhoto,
      reviewPeriod: reviewData.reviewPeriod,
      reviewYear: reviewData.reviewYear,
      reviewQuarter: reviewData.reviewQuarter,
      reviewDate: new Date().toISOString().split("T")[0],
      reviewDueDate: reviewData.reviewDueDate,
      status: "scheduled",
      reviewerId: reviewData.reviewerId,
      reviewerName: reviewData.reviewerName,
      reviewerPosition: reviewData.reviewerPosition,
      criteria: [],
      overallRating: "meets-expectations",
      averageScore: 0,
      strengths: "",
      areasForImprovement: "",
      reviewerComments: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);
    console.log("Performance Context: Added new review", newReview);
  };

  const updateReview = (reviewId: string, updates: Partial<PerformanceReview>) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, ...updates, updatedAt: new Date().toISOString() }
          : review
      )
    );
    console.log("Performance Context: Updated review", reviewId, updates);
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
    console.log("Performance Context: Deleted review", reviewId);
  };

  const getStaffReviews = (staffId: string): PerformanceReview[] => {
    return reviews.filter(review => review.staffId === staffId);
  };

  const getReviewById = (reviewId: string): PerformanceReview | undefined => {
    return reviews.find(review => review.id === reviewId);
  };

  const value: PerformanceContextType = {
    reviews,
    addReview,
    updateReview,
    deleteReview,
    getStaffReviews,
    getReviewById,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
}
