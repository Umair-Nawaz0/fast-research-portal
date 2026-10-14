"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  ResearchOpportunity,
  OpportunityFormData,
  FilterState,
  OpportunityStatus,
} from "@/types/opportunity";
import { INITIAL_OPPORTUNITIES } from "@/lib/mock-data";
import { api, ApiError } from "@/lib/api";
import { toast } from "sonner";

interface OpportunitiesContextType {
  opportunities: ResearchOpportunity[];
  filteredOpportunities: ResearchOpportunity[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  createOpportunity: (data: OpportunityFormData) => Promise<boolean>;
  updateOpportunity: (id: string, data: OpportunityFormData) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
  deleteOpportunity: (id: string) => Promise<boolean>;
  resetToDefaultData: () => Promise<void>;
  refreshOpportunities: () => Promise<void>;
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

const OpportunitiesContext = createContext<OpportunitiesContextType | undefined>(
  undefined
);

export function OpportunitiesProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<ResearchOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Load opportunities from real PostgreSQL database via FastAPI
  const loadOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getOpportunities();
      setOpportunities(data);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Could not connect to FastAPI backend (http://127.0.0.1:8000).";
      setError(msg);
      toast.error("Database Connection Error", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    api
      .getOpportunities()
      .then((data) => {
        if (!ignore) {
          setOpportunities(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          const msg =
            err instanceof ApiError
              ? err.message
              : "Could not connect to FastAPI backend (http://127.0.0.1:8000).";
          setError(msg);
          setIsLoading(false);
          toast.error("Database Connection Error", {
            description: msg,
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const createOpportunity = async (
    formData: OpportunityFormData
  ): Promise<boolean> => {
    try {
      const created = await api.createOpportunity(formData);
      setOpportunities((prev) => [created, ...prev]);
      toast.success("Opportunity Posted Successfully", {
        description: `"${created.title}" was saved to PostgreSQL.`,
      });
      return true;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create opportunity.";
      toast.error("Failed to Post Opportunity", {
        description: msg,
      });
      return false;
    }
  };

  const updateOpportunity = async (
    id: string,
    formData: OpportunityFormData
  ): Promise<boolean> => {
    try {
      const updated = await api.updateOpportunity(id, formData);
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? updated : opp))
      );
      toast.success("Opportunity Updated", {
        description: `Changes to "${updated.title}" were saved to PostgreSQL.`,
      });
      return true;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to update opportunity.";
      toast.error("Failed to Update Opportunity", {
        description: msg,
      });
      return false;
    }
  };

  const toggleStatus = async (id: string): Promise<boolean> => {
    const target = opportunities.find((o) => o.id === id);
    if (!target) return false;

    const newStatus: OpportunityStatus =
      target.status === "Open" ? "Closed" : "Open";

    try {
      const updated = await api.updateOpportunity(id, {
        status: newStatus,
      });
      setOpportunities((prev) =>
        prev.map((opp) => (opp.id === id ? updated : opp))
      );

      if (newStatus === "Closed") {
        toast.info("Opportunity Closed", {
          description: `Applications for "${target.title}" are now closed.`,
        });
      } else {
        toast.success("Opportunity Reopened", {
          description: `"${target.title}" is now open for applications.`,
        });
      }
      return true;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to toggle status.";
      toast.error("Status Update Failed", {
        description: msg,
      });
      return false;
    }
  };

  const deleteOpportunity = async (id: string): Promise<boolean> => {
    const target = opportunities.find((o) => o.id === id);
    try {
      await api.deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      toast.success("Opportunity Removed", {
        description: target ? `"${target.title}" was deleted from PostgreSQL.` : "Item deleted.",
      });
      return true;
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to delete opportunity.";
      toast.error("Deletion Failed", {
        description: msg,
      });
      return false;
    }
  };

  const resetToDefaultData = async () => {
    try {
      setIsLoading(true);
      // Seed default sample data into the database
      for (const item of INITIAL_OPPORTUNITIES) {
        await api.createOpportunity({
          title: item.title,
          department: item.department,
          facultyName: item.facultyName,
          facultyEmail: item.facultyEmail,
          facultyRole: item.facultyRole,
          researchArea: item.researchArea,
          description: item.description,
          requiredSkills: item.requiredSkills,
          availablePositions: item.availablePositions,
          applicationDeadline: item.applicationDeadline,
          status: item.status,
          location: item.location,
          stipend: item.stipend,
          eligibility: item.eligibility,
          prerequisites: item.prerequisites,
        });
      }
      await loadOpportunities();
      setFilters(defaultFilters);
      toast.success("Sample Data Seeded", {
        description: `${INITIAL_OPPORTUNITIES.length} research opportunities seeded into PostgreSQL database.`,
      });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to seed sample data.";
      toast.error("Seeding Failed", {
        description: msg,
      });
    } finally {
      setIsLoading(false);
    }
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
          const matchSkills = (opp.requiredSkills || []).some((s) =>
            s.toLowerCase().includes(q)
          );
          const matchDesc = opp.description.toLowerCase().includes(q);
          if (!matchTitle && !matchFaculty && !matchArea && !matchSkills && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "deadline-asc") {
          return (
            new Date(a.applicationDeadline).getTime() -
            new Date(b.applicationDeadline).getTime()
          );
        }
        if (filters.sortBy === "deadline-desc") {
          return (
            new Date(b.applicationDeadline).getTime() -
            new Date(a.applicationDeadline).getTime()
          );
        }
        if (filters.sortBy === "newest") {
          return (
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          );
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
        error,
        filters,
        setFilters,
        resetFilters,
        createOpportunity,
        updateOpportunity,
        toggleStatus,
        deleteOpportunity,
        resetToDefaultData,
        refreshOpportunities: loadOpportunities,
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
