"use client";

import React from "react";
import { Search, X, SlidersHorizontal, LayoutGrid, Table, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpportunities } from "@/context/opportunities-context";
import { DEPARTMENTS, RESEARCH_AREAS } from "@/lib/mock-data";
import { FilterState } from "@/types/opportunity";

interface FilterBarProps {
  viewMode: "grid" | "table";
  setViewMode: (mode: "grid" | "table") => void;
}

export function FilterBar({ viewMode, setViewMode }: FilterBarProps) {
  const { filters, setFilters, resetFilters, filteredOpportunities, opportunities } =
    useOpportunities();

  const isFiltered =
    filters.searchQuery !== "" ||
    filters.department !== "All" ||
    filters.status !== "All" ||
    filters.researchArea !== "All" ||
    filters.sortBy !== "deadline-asc";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Top search & quick controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input with icon */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Search by topic, faculty, skill (e.g. Mininet, SDN, Python, eBPF)..."
            className="pl-10 pr-9 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status segmented pill filter & View Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Status buttons */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            {(["All", "Open", "Closed"] as const).map((status) => {
              const active = filters.status === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilters((prev) => ({ ...prev, status }))}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    active
                      ? "bg-white text-blue-800 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status === "All" && "All Status"}
                  {status === "Open" && "Open (Live)"}
                  {status === "Closed" && "Closed"}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary filter dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        {/* Department Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }
            className="w-full h-9.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Research Area Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Research Domain / Specialization
          </label>
          <select
            value={filters.researchArea}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, researchArea: e.target.value }))
            }
            className="w-full h-9.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
          >
            <option value="All">All Research Areas</option>
            {RESEARCH_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center justify-between">
            <span>Sort By</span>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState["sortBy"],
              }))
            }
            className="w-full h-9.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
          >
            <option value="deadline-asc">Application Deadline (Earliest First)</option>
            <option value="deadline-desc">Application Deadline (Furthest First)</option>
            <option value="newest">Recently Posted</option>
            <option value="positions-desc">Most Available Vacancies</option>
          </select>
        </div>
      </div>

      {/* Active filters pill display & results counter */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium text-slate-600">
            Showing {filteredOpportunities.length} of {opportunities.length} opportunities
          </span>
          {filters.department !== "All" && (
            <Badge variant="department" className="gap-1 py-0.5">
              Dept: {filters.department}
              <button
                onClick={() => setFilters((p) => ({ ...p, department: "All" }))}
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.researchArea !== "All" && (
            <Badge variant="secondary" className="gap-1 py-0.5">
              Area: {filters.researchArea}
              <button
                onClick={() => setFilters((p) => ({ ...p, researchArea: "All" }))}
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.status !== "All" && (
            <Badge
              variant={filters.status === "Open" ? "success" : "secondary"}
              className="gap-1 py-0.5"
            >
              Status: {filters.status}
              <button
                onClick={() => setFilters((p) => ({ ...p, status: "All" }))}
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.searchQuery && (
            <Badge variant="secondary" className="gap-1 py-0.5">
              Keyword: &quot;{filters.searchQuery}&quot;
              <button
                onClick={() => setFilters((p) => ({ ...p, searchQuery: "" }))}
                className="hover:text-red-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
