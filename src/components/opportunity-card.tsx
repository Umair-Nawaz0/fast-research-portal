"use client";

import React from "react";
import {
  Calendar,
  Users,
  MapPin,
  Mail,
  ArrowUpRight,
  Edit2,
  Trash2,
  PowerOff,
  Power,
  Clock,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { ResearchOpportunity } from "@/types/opportunity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, isDeadlineApproaching, isPastDeadline } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: ResearchOpportunity;
  onViewDetails: (opp: ResearchOpportunity) => void;
  onEdit: (opp: ResearchOpportunity) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (opp: ResearchOpportunity) => void;
}

export function OpportunityCard({
  opportunity,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}: OpportunityCardProps) {
  const isOpen = opportunity.status === "Open";
  const closingSoon = isOpen && isDeadlineApproaching(opportunity.applicationDeadline);
  const deadlineExpired = isPastDeadline(opportunity.applicationDeadline);

  return (
    <Card className="flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200 border-slate-200 bg-white group overflow-hidden">
      {/* Card Header & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge
            variant="department"
            className="text-[11px] font-semibold py-0.5 line-clamp-1 max-w-[240px]"
          >
            {opportunity.department}
          </Badge>

          {/* Status Badge */}
          {isOpen ? (
            <Badge variant="success" className="text-xs font-semibold py-0.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Open
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs font-semibold py-0.5 shrink-0 text-slate-500 bg-slate-100">
              Closed
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(opportunity)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {opportunity.title}
        </h3>

        {/* Research Area Tag */}
        <div className="mt-2 text-xs font-medium text-blue-600 bg-blue-50/70 inline-block px-2 py-0.5 rounded border border-blue-100">
          {opportunity.researchArea}
        </div>

        {/* Faculty Supervisor */}
        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-600">
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-[10px] shrink-0">
            {opportunity.facultyName
              .split(" ")
              .filter((n) => !n.startsWith("Dr.") && !n.startsWith("Prof."))
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "FA"}
          </div>
          <div className="truncate">
            <span className="font-semibold text-slate-800">{opportunity.facultyName}</span>
            <span className="text-slate-400 mx-1.5">•</span>
            <span className="text-slate-500">{opportunity.facultyRole}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Required skills preview */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {opportunity.requiredSkills.length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-500 border border-slate-200">
              +{opportunity.requiredSkills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Meta Bar & Action Footer */}
      <div className="mt-auto border-t border-slate-100 bg-slate-50/60 p-4 pt-3">
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3.5">
          {/* Vacancies */}
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">
              {opportunity.availablePositions} Position
              {opportunity.availablePositions > 1 ? "s" : ""}
            </span>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 justify-end">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`font-medium ${
                closingSoon
                  ? "text-amber-700 font-bold"
                  : deadlineExpired
                  ? "text-rose-600 font-bold"
                  : "text-slate-700"
              }`}
            >
              {formatDate(opportunity.applicationDeadline)}
            </span>
          </div>
        </div>

        {/* Action buttons row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
          <Button
            size="sm"
            onClick={() => onViewDetails(opportunity)}
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs h-8.5"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>

          {/* Quick Icon Actions */}
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              onClick={() => onEdit(opportunity)}
              className="h-8.5 w-8.5 text-slate-600 hover:text-blue-700 hover:border-blue-300"
              title="Edit Opportunity"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => onToggleStatus(opportunity.id)}
              className={`h-8.5 w-8.5 ${
                isOpen
                  ? "text-amber-600 hover:text-amber-700 hover:border-amber-300"
                  : "text-emerald-600 hover:text-emerald-700 hover:border-emerald-300"
              }`}
              title={isOpen ? "Close Opportunity" : "Reopen Opportunity"}
            >
              {isOpen ? (
                <PowerOff className="w-3.5 h-3.5" />
              ) : (
                <Power className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => onDelete(opportunity)}
              className="h-8.5 w-8.5 text-slate-400 hover:text-red-600 hover:border-red-300"
              title="Delete Opportunity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
