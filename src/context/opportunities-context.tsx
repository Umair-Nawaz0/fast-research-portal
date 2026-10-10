"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ResearchOpportunity,
  OpportunityFormData,
  FilterState,
  OpportunityStatus,
} from "@/types/opportunity";
import { INITIAL_OPPORTUNITIES } from "@/lib/mock-data";
import { toast } from "sonner";

const STORAGE_KEY = "fast_university_research_opportunities_v1";

interface OpportunitiesContextType {
  opportunities: ResearchOpportunity[];
  filteredOpportunities: ResearchOpportunity[];
  isLoading: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  createOpportunity: (data: OpportunityFormData) => void;
  updateOpportunity: (id: string, data: OpportunityFormData) => void;
  toggleStatus: (id: string) => void;
  deleteOpportunity: (id: string) => void;
  resetToDefaultData: () => void;
  stats: {
    total: number;
    open: number;
    closed: number;
    totalPositions: number;
    departmentsCount: number;
  };
}

const defaultFilters: FilterState = {
  searchQuery: "",
  department: "All",
  status: "All",
  researchArea: "All",
  sortBy: "deadline-asc",
};

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(undefined);

export function OpportunitiesProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<ResearchOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load from localStorage or mock data
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpportunities(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage:", e);
    }
    // Fallback to initial mock data
    setOpportunities(INITIAL_OPPORTUNITIES);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever opportunities change
  const saveOpportunities = (updated: ResearchOpportunity[]) => {
    setOpportunities(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist opportunities to localStorage:", e);
    }
  };

  const createOpportunity = (formData: OpportunityFormData) => {
    const newOpportunity: ResearchOpportunity = {
      ...formData,
      id: `fast-res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      postedDate: new Date().toISOString().split("T")[0],
    };
    const updated = [newOpportunity, ...opportunities];
    saveOpportunities(updated);
    toast.success("Opportunity Posted Successfully", {
      description: `"${newOpportunity.title}" is now active in the portal.`,
    });
  };

  const updateOpportunity = (id: string, formData: OpportunityFormData) => {
    const updated = opportunities.map((opp) =>
      opp.id === id
        ? {
            ...opp,
            ...formData,
          }
        : opp
    );
    saveOpportunities(updated);
    toast.success("Opportunity Updated", {
      description: `Changes to "${formData.title}" have been saved.`,
    });
  };

  const toggleStatus = (id: string) => {
    const target = opportunities.find((o) => o.id === id);
    if (!target) return;

    const newStatus: OpportunityStatus = target.status === "Open" ? "Closed" : "Open";
    const updated = opportunities.map((opp) =>
      opp.id === id ? { ...opp, status: newStatus } : opp
    );
    saveOpportunities(updated);

    if (newStatus === "Closed") {
      toast.info("Opportunity Closed", {
        description: `Applications for "${target.title}" are now closed.`,
      });
    } else {
      toast.success("Opportunity Reopened", {
        description: `"${target.title}" is now open for applications.`,
      });
    }
  };

  const deleteOpportunity = (id: string) => {
    const target = opportunities.find((o) => o.id === id);
    const updated = opportunities.filter((o) => o.id !== id);
    saveOpportunities(updated);
    toast.success("Opportunity Removed", {
      description: target ? `"${target.title}" was deleted.` : "Item removed.",
    });
  };

  const resetToDefaultData = () => {
    saveOpportunities(INITIAL_OPPORTUNITIES);
    setFilters(defaultFilters);
    toast.success("Sample Data Restored", {
      description: "Default FAST University research opportunities have been restored.",
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filtered & Sorted list
  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opp) => {
        // Status filter
        if (filters.status !== "All" && opp.status !== filters.status) {
          return false;
        }

        // Department filter
        if (filters.department !== "All" && opp.department !== filters.department) {
          return false;
        }

        // Research Area filter
        if (filters.researchArea !== "All" && opp.researchArea !== filters.researchArea) {
          return false;
        }

        // Search query
        if (filters.searchQuery.trim() !== "") {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = opp.title.toLowerCase().includes(q);
          const matchFaculty = opp.facultyName.toLowerCase().includes(q);
          const matchArea = opp.researchArea.toLowerCase().includes(q);
          const matchSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
          const matchDesc = opp.description.toLowerCase().includes(q);
          if (!matchTitle && !matchFaculty && !matchArea && !matchSkills && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "deadline-asc") {
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        }
        if (filters.sortBy === "deadline-desc") {
          return new Date(b.applicationDeadline).getTime() - new Date(a.applicationDeadline).getTime();
        }
        if (filters.sortBy === "newest") {
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        }
        if (filters.sortBy === "positions-desc") {
          return b.availablePositions - a.availablePositions;
        }
        return 0;
      });
  }, [opportunities, filters]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = opportunities.length;
    const open = opportunities.filter((o) => o.status === "Open").length;
    const closed = opportunities.filter((o) => o.status === "Closed").length;
    const totalPositions = opportunities.reduce(
      (acc, o) => (o.status === "Open" ? acc + (o.availablePositions || 1) : acc),
      0
    );
    const uniqueDepts = new Set(opportunities.map((o) => o.department)).size;

    return {
      total,
      open,
      closed,
      totalPositions,
      departmentsCount: uniqueDepts,
    };
  }, [opportunities]);

  return (
    <OpportunitiesContext.Provider
      value={{
        opportunities,
        filteredOpportunities,
        isLoading,
        filters,
        setFilters,
        resetFilters,
        createOpportunity,
        updateOpportunity,
        toggleStatus,
        deleteOpportunity,
        resetToDefaultData,
        stats,
      }}
    >
      {children}
    </OpportunitiesContext.Provider>
  );
}

export function useOpportunities() {
  const context = useContext(OpportunitiesContext);
  if (!context) {
    throw new Error("useOpportunities must be used within an OpportunitiesProvider");
  }
  return context;
}
