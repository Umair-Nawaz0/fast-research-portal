"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ResearchOpportunity,
  OpportunityFormData,
  Department,
  OpportunityStatus,
} from "@/types/opportunity";
import { DEPARTMENTS, RESEARCH_AREAS } from "@/lib/mock-data";
import { X, Plus, AlertCircle, Sparkles, Check, Loader2 } from "lucide-react";

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: ResearchOpportunity | null;
}

const DEFAULT_FORM: OpportunityFormData = {
  title: "",
  department: "Computer Networks & Security",
  facultyName: "",
  facultyEmail: "",
  facultyRole: "Associate Professor",
  researchArea: "Software-Defined Networking (SDN)",
  description: "",
  requiredSkills: [],
  availablePositions: 2,
  applicationDeadline: "",
  status: "Open",
  location: "FAST Network Research Lab",
  stipend: "Funded Assistantship (PKR 35,000/month)",
  eligibility: "BS (CS / SE / EE) 6th-8th semester with CGPA >= 3.0",
  prerequisites: "Computer Networks and Operating Systems",
};

const SUGGESTED_SKILLS = [
  "Python",
  "Mininet",
  "Wireshark",
  "Socket Programming",
  "C++",
  "Linux Kernel",
  "eBPF",
  "Docker",
  "PyTorch",
  "OpenFlow",
  "NS-3",
];

export function OpportunityFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OpportunityFormModalProps) {
  const [formData, setFormData] = useState<OpportunityFormData>(DEFAULT_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        department: initialData.department,
        facultyName: initialData.facultyName,
        facultyEmail: initialData.facultyEmail,
        facultyRole: initialData.facultyRole,
        researchArea: initialData.researchArea,
        description: initialData.description,
        requiredSkills: [...initialData.requiredSkills],
        availablePositions: initialData.availablePositions,
        applicationDeadline: initialData.applicationDeadline,
        status: initialData.status,
        location: initialData.location,
        stipend: initialData.stipend,
        eligibility: initialData.eligibility,
        prerequisites: initialData.prerequisites || "",
      });
      setErrors({});
    } else {
      // Default future date for deadline (e.g. 30 days ahead)
      const future = new Date();
      future.setDate(future.getDate() + 30);
      const defaultDate = future.toISOString().split("T")[0];

      setFormData({
        ...DEFAULT_FORM,
        applicationDeadline: defaultDate,
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required.";
    } else if (formData.title.trim().length < 8) {
      newErrors.title = "Title should be at least 8 characters.";
    }

    if (!formData.facultyName.trim()) {
      newErrors.facultyName = "Faculty mentor name is required.";
    }

    if (!formData.facultyEmail.trim()) {
      newErrors.facultyEmail = "Faculty email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.facultyEmail)) {
      newErrors.facultyEmail = "Please enter a valid university email address.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Detailed project description is required.";
    } else if (formData.description.trim().length < 25) {
      newErrors.description = "Description should be at least 25 characters.";
    }

    if (formData.requiredSkills.length === 0) {
      newErrors.skills = "Please add at least one required skill or prerequisite.";
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required.";
    }

    if (formData.availablePositions < 1) {
      newErrors.availablePositions = "Available positions must be at least 1.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Research lab location is required.";
    }

    if (!formData.eligibility.trim()) {
      newErrors.eligibility = "Eligibility criteria is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (formData.requiredSkills.includes(trimmed)) return;

    setFormData((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, trimmed],
    }));
    setSkillInput("");
    if (errors.skills) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.skills;
        return next;
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            {isEditMode ? "Edit Research Opportunity" : "Post New Research Opportunity"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs mt-1">
            {isEditMode
              ? "Update research details, skill prerequisites, or application deadlines."
              : "Publish a faculty research opening for FAST-NUCES undergraduate or graduate students."}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Section: Project Basics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              1. Opportunity Basics
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Research Project Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  error={Boolean(errors.title)}
                  placeholder="e.g. Software-Defined Networking (SDN) Flow Optimization"
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Academic Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        department: e.target.value as Department,
                      }))
                    }
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Research Area / Specialization *
                  </label>
                  <select
                    value={formData.researchArea}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        researchArea: e.target.value,
                      }))
                    }
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {RESEARCH_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Faculty Mentor Information */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              2. Faculty Mentor & Supervision
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Faculty Name *
                </label>
                <Input
                  value={formData.facultyName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, facultyName: e.target.value }))
                  }
                  error={Boolean(errors.facultyName)}
                  placeholder="e.g. Dr. Tariq Mahmood"
                />
                {errors.facultyName && (
                  <p className="text-xs text-red-600 mt-1">{errors.facultyName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email *
                </label>
                <Input
                  type="email"
                  value={formData.facultyEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, facultyEmail: e.target.value }))
                  }
                  error={Boolean(errors.facultyEmail)}
                  placeholder="faculty@nu.edu.pk"
                />
                {errors.facultyEmail && (
                  <p className="text-xs text-red-600 mt-1">{errors.facultyEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Designation / Role
                </label>
                <Input
                  value={formData.facultyRole}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, facultyRole: e.target.value }))
                  }
                  placeholder="e.g. Associate Professor"
                />
              </div>
            </div>
          </div>

          {/* Section: Description & Scope */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              3. Research Scope & Description
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description & Objectives *
              </label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                error={Boolean(errors.description)}
                placeholder="Detail the research problem, methodology, student responsibilities, and expected outcomes..."
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Section: Required Skills */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              4. Technical Skills & Tools Required *
            </h4>

            {/* Tags preview */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-slate-50 border border-slate-200 rounded-lg mb-2">
              {formData.requiredSkills.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  No skills added yet. Type below and press Enter or select suggested skills.
                </span>
              ) : (
                formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-700 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add skill input */}
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill(skillInput);
                  }
                }}
                placeholder="Type skill (e.g. Mininet, Wireshark) and press Enter"
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddSkill(skillInput)}
                className="text-xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            </div>

            {/* Quick suggested chips */}
            <div className="mt-2 flex flex-wrap gap-1 items-center">
              <span className="text-[11px] text-slate-400 mr-1">Suggestions:</span>
              {SUGGESTED_SKILLS.filter(
                (s) => !formData.requiredSkills.includes(s)
              ).slice(0, 6).map((suggested) => (
                <button
                  type="button"
                  key={suggested}
                  onClick={() => handleAddSkill(suggested)}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  + {suggested}
                </button>
              ))}
            </div>

            {errors.skills && (
              <p className="text-xs text-red-600 mt-1">{errors.skills}</p>
            )}
          </div>

          {/* Section: Logistics & Eligibility */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              5. Positions, Deadline & Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Positions Available *
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.availablePositions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availablePositions: parseInt(e.target.value) || 1,
                    }))
                  }
                  error={Boolean(errors.availablePositions)}
                />
                {errors.availablePositions && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.availablePositions}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Deadline *
                </label>
                <Input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDeadline: e.target.value,
                    }))
                  }
                  error={Boolean(errors.applicationDeadline)}
                />
                {errors.applicationDeadline && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.applicationDeadline}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Listing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as OpportunityStatus,
                    }))
                  }
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Open">Open (Accepting Applicants)</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lab Location / Work Mode *
                </label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="e.g. FAST Network Research Lab - B-204"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Stipend / Support Details
                </label>
                <Input
                  value={formData.stipend}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stipend: e.target.value }))
                  }
                  placeholder="e.g. Funded Assistantship (PKR 35,000/month)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Eligibility Criteria *
                </label>
                <Input
                  value={formData.eligibility}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, eligibility: e.target.value }))
                  }
                  placeholder="e.g. BS CS/SE 6th semester or above with CGPA >= 3.0"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Prerequisites
                </label>
                <Input
                  value={formData.prerequisites || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      prerequisites: e.target.value,
                    }))
                  }
                  placeholder="e.g. Computer Networks (B+ or above)"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="bg-slate-50 border-t border-slate-200 -mx-6 -mb-6 p-4 px-6 flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-700 hover:bg-blue-800 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Saving...
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Post Opportunity"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
