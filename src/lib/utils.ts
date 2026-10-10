import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function isDeadlineApproaching(deadlineString: string, daysThreshold = 7): boolean {
  try {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= daysThreshold;
  } catch {
    return false;
  }
}

export function isPastDeadline(deadlineString: string): boolean {
  try {
    const deadline = new Date(deadlineString);
    const now = new Date();
    // Compare date parts
    return deadline.setHours(23, 59, 59, 999) < now.getTime();
  } catch {
    return false;
  }
}
