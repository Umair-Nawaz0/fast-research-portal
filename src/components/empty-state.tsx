"use client";

import React from "react";
import { FolderSearch, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
  onOpenCreate: () => void;
}

export function EmptyState({
  isFiltered,
  onResetFilters,
  onOpenCreate,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center my-8">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-xs">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">
        {isFiltered
          ? "No matching research opportunities found"
          : "No research opportunities posted yet"}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        {isFiltered
          ? "Try adjusting your search keywords, clearing selected department filters, or resetting status."
          : "Get started by posting the first university research opportunity or restore the sample FAST dataset."}
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
      </div>
    </div>
  );
}
