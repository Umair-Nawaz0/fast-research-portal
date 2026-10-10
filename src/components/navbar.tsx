"use client";

import React from "react";
import { GraduationCap, Plus, RefreshCw, Network, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpportunities } from "@/context/opportunities-context";

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export function Navbar({ onOpenCreateModal }: NavbarProps) {
  const { stats, resetToDefaultData } = useOpportunities();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top micro-bar for university affiliation */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              FAST-NUCES Islamabad Campus
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">
              Computer Networks Lab & Research Opportunities
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hidden md:inline text-slate-300 font-mono">
              Fall 2026 Academic Term
            </span>
            <button
              onClick={resetToDefaultData}
              title="Reset to default mock opportunities"
              className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-slate-400 hover:underline"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-100 flex-shrink-0">
            <Network className="w-6 h-6 text-blue-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-sans">
                FAST<span className="text-blue-700">Research</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Portal
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 tracking-wide line-clamp-1">
              Undergraduate & Graduate Faculty Research Opportunities
            </p>
          </div>
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-3">
          {/* Active stats badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Active Openings:</span>
            <Badge variant="success" className="px-2 py-0 text-xs font-bold">
              {stats.totalPositions} Positions
            </Badge>
          </div>

          {/* Post Opportunity Button */}
          <Button
            onClick={onOpenCreateModal}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow-sm shadow-blue-600/30 gap-2 h-10 px-4 sm:px-5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Post Opportunity</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
