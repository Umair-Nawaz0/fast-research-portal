"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { StatsCards } from "@/components/stats-cards";
import { FilterBar } from "@/components/filter-bar";
import { OpportunityCard } from "@/components/opportunity-card";
import { OpportunityTable } from "@/components/opportunity-table";
import { OpportunityDetailModal } from "@/components/opportunity-detail-modal";
import { OpportunityFormModal } from "@/components/opportunity-form-modal";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { EmptyState } from "@/components/empty-state";
import { LoadingGrid, LoadingTable } from "@/components/loading-state";
import { Footer } from "@/components/footer";
import { useOpportunities } from "@/context/opportunities-context";
import { ResearchOpportunity, OpportunityFormData } from "@/types/opportunity";
import { Sparkles, GraduationCap, Network, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const {
    filteredOpportunities,
    opportunities,
    isLoading,
    filters,
    resetFilters,
    createOpportunity,
    updateOpportunity,
    toggleStatus,
    deleteOpportunity,
  } = useOpportunities();

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal states
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<ResearchOpportunity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [editingOpportunity, setEditingOpportunity] =
    useState<ResearchOpportunity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [deletingOpportunity, setDeletingOpportunity] =
    useState<ResearchOpportunity | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Handlers
  const handleViewDetails = (opp: ResearchOpportunity) => {
    setSelectedOpportunity(opp);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingOpportunity(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (opp: ResearchOpportunity) => {
    setEditingOpportunity(opp);
    setIsFormOpen(true);
  };

  const handlePromptDelete = (opp: ResearchOpportunity) => {
    setDeletingOpportunity(opp);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (formData: OpportunityFormData) => {
    if (editingOpportunity) {
      updateOpportunity(editingOpportunity.id, formData);
    } else {
      createOpportunity(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingOpportunity) {
      deleteOpportunity(deletingOpportunity.id);
      setDeletingOpportunity(null);
    }
  };

  const isFiltered =
    filters.searchQuery !== "" ||
    filters.department !== "All" ||
    filters.status !== "All" ||
    filters.researchArea !== "All" ||
    filters.sortBy !== "deadline-asc";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar onOpenCreateModal={handleOpenCreate} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Academic Hero Header */}
        <section className="mb-8 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-20 bottom-0 translate-y-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
              <GraduationCap className="w-4 h-4 text-blue-300" />
              <span>Computer Networks • Semester Lab Assignment</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              University Research Opportunity Portal
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Discover cutting-edge research projects, funded assistantships, and Final
              Year Project (FYP) collaborations with FAST-NUCES faculty in Computer Networks,
              Cybersecurity, Distributed Systems, and AI.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleOpenCreate}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm h-10 px-5 shadow-md shadow-blue-900/40"
              >
                <span>Post Faculty Opportunity</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="text-xs text-slate-400 flex items-center gap-2 pl-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Active semester postings: {opportunities.length} Listings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Aggregate Metric Cards */}
        <StatsCards />

        {/* Filters, Search & View Controls */}
        <FilterBar viewMode={viewMode} setViewMode={setViewMode} />

        {/* Research Opportunities Listings */}
        <section aria-label="Research Opportunities">
          {isLoading ? (
            viewMode === "grid" ? (
              <LoadingGrid />
            ) : (
              <LoadingTable />
            )
          ) : filteredOpportunities.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onResetFilters={resetFilters}
              onOpenCreate={handleOpenCreate}
            />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onViewDetails={handleViewDetails}
                  onEdit={handleOpenEdit}
                  onToggleStatus={toggleStatus}
                  onDelete={handlePromptDelete}
                />
              ))}
            </div>
          ) : (
            <OpportunityTable
              opportunities={filteredOpportunities}
              onViewDetails={handleViewDetails}
              onEdit={handleOpenEdit}
              onToggleStatus={toggleStatus}
              onDelete={handlePromptDelete}
            />
          )}
        </section>
      </main>

      <Footer />

      {/* Detail Dialog */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleOpenEdit}
        onToggleStatus={toggleStatus}
      />

      {/* Create / Edit Form Dialog */}
      <OpportunityFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingOpportunity}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        opportunity={deletingOpportunity}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
