"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResearchOpportunity } from "@/types/opportunity";
import { formatDate, isDeadlineApproaching, isPastDeadline } from "@/lib/utils";
import {
  Calendar,
  Users,
  MapPin,
  Mail,
  GraduationCap,
  Building2,
  Award,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Edit2,
  PowerOff,
  Power,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

interface OpportunityDetailModalProps {
  opportunity: ResearchOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (opp: ResearchOpportunity) => void;
  onToggleStatus: (id: string) => void;
}

export function OpportunityDetailModal({
  opportunity,
  isOpen,
  onClose,
  onEdit,
  onToggleStatus,
}: OpportunityDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!opportunity) return null;

  const isOpportunityOpen = opportunity.status === "Open";
  const closingSoon =
    isOpportunityOpen && isDeadlineApproaching(opportunity.applicationDeadline);
  const expired = isPastDeadline(opportunity.applicationDeadline);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    toast.success("Opportunity Link Copied to Clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    setApplied(true);
    toast.success("Application Form Opened", {
      description: `Please email your CV & transcript directly to ${opportunity.facultyEmail} referencing "${opportunity.title}".`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto p-0">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="department"
              className="bg-blue-900/60 text-blue-200 border-blue-700/60 text-xs py-0.5"
            >
              {opportunity.department}
            </Badge>

            {isOpportunityOpen ? (
              <Badge
                variant="success"
                className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs py-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Open for Applications
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-slate-800 text-slate-300 border-slate-700 text-xs py-0.5"
              >
                Applications Closed
              </Badge>
            )}

            <span className="text-xs text-slate-400 ml-auto">
              Posted: {formatDate(opportunity.postedDate)}
            </span>
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug text-white tracking-tight">
            {opportunity.title}
          </DialogTitle>

          <p className="mt-2 text-sm text-blue-200 font-medium flex items-center gap-2">
            <span>Research Specialization:</span>
            <span className="underline decoration-blue-400 underline-offset-2">
              {opportunity.researchArea}
            </span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                Open Positions
              </span>
              <span className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Users className="w-4 h-4 text-blue-600" />
                {opportunity.availablePositions} Vacanc
                {opportunity.availablePositions > 1 ? "ies" : "y"}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                Deadline
              </span>
              <span
                className={`text-base font-bold flex items-center gap-1.5 mt-0.5 ${
                  closingSoon
                    ? "text-amber-600"
                    : expired
                    ? "text-rose-600"
                    : "text-slate-900"
                }`}
              >
                <Calendar className="w-4 h-4 text-slate-500" />
                {formatDate(opportunity.applicationDeadline)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                Funding & Stipend
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block truncate mt-1">
                {opportunity.stipend}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 block uppercase">
                Research Lab
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block truncate mt-1">
                {opportunity.location}
              </span>
            </div>
          </div>

          {/* Supervisor Card */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-800 text-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">
                    {opportunity.facultyName}
                  </h4>
                  <Badge variant="secondary" className="text-[11px]">
                    Supervisor
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">
                  {opportunity.facultyRole} • {opportunity.department}
                </p>
              </div>
            </div>

            <a
              href={`mailto:${opportunity.facultyEmail}?subject=Research Assistant Application: ${encodeURIComponent(
                opportunity.title
              )}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{opportunity.facultyEmail}</span>
            </a>
          </div>

          {/* Project Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Research Project Overview & Scope
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {opportunity.description}
            </p>
          </div>

          {/* Required Skills & Technologies */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Required Technical Skills & Competencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {opportunity.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligibility & Prerequisites */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Eligibility Criteria
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {opportunity.eligibility}
              </p>
            </div>

            {opportunity.prerequisites && (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  Course Prerequisites
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {opportunity.prerequisites}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied" : "Share"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(opportunity);
              }}
              className="text-xs gap-1.5 text-slate-700"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(opportunity.id)}
              className={`text-xs gap-1.5 ${
                isOpportunityOpen
                  ? "text-amber-700 hover:bg-amber-50"
                  : "text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              {isOpportunityOpen ? (
                <>
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>Close Listing</span>
                </>
              ) : (
                <>
                  <Power className="w-3.5 h-3.5" />
                  <span>Reopen Listing</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>

            <a
              href={`mailto:${opportunity.facultyEmail}?subject=Application for ${encodeURIComponent(
                opportunity.title
              )}&body=Dear ${encodeURIComponent(
                opportunity.facultyName
              )},%0D%0A%0D%0AI am writing to express my strong interest in the research opportunity "${encodeURIComponent(
                opportunity.title
              )}". Attached is my resume and academic transcript.%0D%0A%0D%0AStudent Name:%0D%0ARoll Number:%0D%0ACGPA:%0D%0ADepartment:`}
              onClick={handleApply}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm text-white ${
                isOpportunityOpen
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-slate-400 pointer-events-none"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>
                {isOpportunityOpen ? "Apply via Faculty Email" : "Applications Closed"}
              </span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
