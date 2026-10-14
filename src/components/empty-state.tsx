"use client";

import React from "react";
import { FolderSearch, Plus, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
  onOpenCreate: () => void;
  onSeedSampleData?: () => void;
}

export function EmptyState({
  isFiltered,
  onResetFilters,
  onOpenCreate,
  onSeedSampleData,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center my-8 shadow-xs">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {isFiltered
          ? "No matching research opportunities found"
          : "No research opportunities in PostgreSQL yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {isFiltered
          ? "Try adjusting your search keywords, clearing selected department filters, or resetting status."
          : "Get started by posting a new opportunity directly to the PostgreSQL database, or seed the initial FAST faculty research listings."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="text-xs h-9 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear All Filters</span>
          </Button>
        ) : null}

        <Button
          onClick={onOpenCreate}
          className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </Button>

        {!isFiltered && onSeedSampleData && (
          <Button
            variant="outline"
            onClick={onSeedSampleData}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs h-9 gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Seed Sample Opportunities</span>
          </Button>
        )}
      </div>
    </div>
  );
}
