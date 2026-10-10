"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResearchOpportunity } from "@/types/opportunity";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  opportunity: ResearchOpportunity | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  opportunity,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!opportunity) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Delete Research Opportunity?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900 font-semibold">
                &ldquo;{opportunity.title}&rdquo;
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </div>
        </div>

        <DialogFooter className="mt-4 flex-row justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-red-600 hover:bg-red-700 text-white gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Listing</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
