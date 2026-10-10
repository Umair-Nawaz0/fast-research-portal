"use client";

import React from "react";
import { FolderGit2, Users, CheckCircle2, Building2, Sparkles, Clock } from "lucide-react";
import { useOpportunities } from "@/context/opportunities-context";

export function StatsCards() {
  const { stats, filters, setFilters } = useOpportunities();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-8">
      {/* Total Opportunities */}
      <div
        onClick={() => setFilters((prev) => ({ ...prev, status: "All" }))}
        className={`group relative overflow-hidden rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
          filters.status === "All"
            ? "border-blue-300 bg-gradient-to-br from-blue-50/70 to-white shadow-sm ring-2 ring-blue-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Total Projects
          </span>
          <div className="w-9 h-9 rounded-lg bg-blue-100/70 flex items-center justify-center text-blue-700">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.total}
          </span>
          <span className="text-xs text-slate-500 font-medium">listings</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <span>Across all faculties</span>
        </div>
      </div>

      {/* Active Open Positions */}
      <div
        onClick={() => setFilters((prev) => ({ ...prev, status: "Open" }))}
        className={`group relative overflow-hidden rounded-xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
          filters.status === "Open"
            ? "border-emerald-300 bg-gradient-to-br from-emerald-50/70 to-white shadow-sm ring-2 ring-emerald-100"
            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Open For Applications
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-100/70 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
            {stats.open}
          </span>
          <span className="text-xs font-semibold text-emerald-600">Active</span>
        </div>
        <div className="mt-2 text-[11px] text-emerald-600 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Accepting candidates now</span>
        </div>
      </div>

      {/* Total Vacancies */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Available Vacancies
          </span>
          <div className="w-9 h-9 rounded-lg bg-indigo-100/70 flex items-center justify-center text-indigo-700">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.totalPositions}
          </span>
          <span className="text-xs text-slate-500 font-medium">seats</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <span>Research assistant & RA slots</span>
        </div>
      </div>

      {/* Participating Departments */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-slate-500">
            Departments
          </span>
          <div className="w-9 h-9 rounded-lg bg-purple-100/70 flex items-center justify-center text-purple-700">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.departmentsCount}
          </span>
          <span className="text-xs text-slate-500 font-medium">academic units</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
          <span>FAST-NUCES Faculty labs</span>
        </div>
      </div>
    </div>
  );
}
