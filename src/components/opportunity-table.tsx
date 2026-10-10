"use client";

import React from "react";
import {
  Calendar,
  Users,
  Eye,
  Edit2,
  Trash2,
  PowerOff,
  Power,
  ArrowUpRight,
} from "lucide-react";
import { ResearchOpportunity } from "@/types/opportunity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, isDeadlineApproaching, isPastDeadline } from "@/lib/utils";

interface OpportunityTableProps {
  opportunities: ResearchOpportunity[];
  onViewDetails: (opp: ResearchOpportunity) => void;
  onEdit: (opp: ResearchOpportunity) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (opp: ResearchOpportunity) => void;
}

export function OpportunityTable({
  opportunities,
  onViewDetails,
  onEdit,
  onToggleStatus,
  onDelete,
}: OpportunityTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Research Title & Area</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Supervisor</th>
              <th className="py-3.5 px-4 text-center">Positions</th>
              <th className="py-3.5 px-4">Deadline</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {opportunities.map((opp) => {
              const isOpen = opp.status === "Open";
              const closingSoon =
                isOpen && isDeadlineApproaching(opp.applicationDeadline);
              const pastDeadline = isPastDeadline(opp.applicationDeadline);

              return (
                <tr
                  key={opp.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Title & Domain */}
                  <td className="py-4 px-4 sm:px-6 max-w-sm">
                    <div
                      onClick={() => onViewDetails(opp)}
                      className="font-bold text-slate-900 group-hover:text-blue-700 cursor-pointer line-clamp-1 text-sm sm:text-base leading-snug"
                    >
                      {opp.title}
                    </div>
                    <div className="text-xs text-blue-600 font-medium mt-1">
                      {opp.researchArea}
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge variant="department" className="text-xs py-0.5">
                      {opp.department}
                    </Badge>
                  </td>

                  {/* Supervisor */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800 text-xs sm:text-sm">
                      {opp.facultyName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {opp.facultyRole}
                    </div>
                  </td>

                  {/* Positions */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                      {opp.availablePositions}
                    </span>
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs">
                    <div
                      className={`font-semibold ${
                        closingSoon
                          ? "text-amber-600"
                          : pastDeadline
                          ? "text-red-600"
                          : "text-slate-700"
                      }`}
                    >
                      {formatDate(opp.applicationDeadline)}
                    </div>
                    {closingSoon && (
                      <span className="text-[10px] font-bold text-amber-600 uppercase">
                        Closing Soon
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 text-center whitespace-nowrap">
                    {isOpen ? (
                      <Badge variant="success" className="text-xs py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Open
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs py-0.5 text-slate-500">
                        Closed
                      </Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDetails(opp)}
                        className="h-8 px-2.5 text-xs text-blue-700 hover:bg-blue-50 border-blue-200"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        <span>View</span>
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(opp)}
                        className="h-8 w-8 text-slate-600 hover:text-blue-700 hover:bg-slate-100"
                        title="Edit Opportunity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onToggleStatus(opp.id)}
                        className={`h-8 w-8 ${
                          isOpen
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-emerald-600 hover:bg-emerald-50"
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
                        variant="ghost"
                        onClick={() => onDelete(opp)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
