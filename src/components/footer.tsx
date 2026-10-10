import React from "react";
import { Network, Globe, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white">
              <Network className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                FAST-NUCES Computer Networks Research Portal
              </div>
              <div className="text-xs text-slate-500">
                Department of Computer Science & Telecommunications
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              Academic Assignment
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Faculty Listings
            </span>
            <span>FAST National University of Computer & Emerging Sciences</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; 2026 University Research Opportunity Portal. Developed for Computer Networks.
          </div>
          <div className="text-slate-400">
            Frontend Prototype • Next.js App Router • Tailwind CSS • TypeScript
          </div>
        </div>
      </div>
    </footer>
  );
}
