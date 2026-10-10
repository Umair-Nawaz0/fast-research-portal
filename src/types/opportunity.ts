export type OpportunityStatus = "Open" | "Closed";

export type Department =
  | "Computer Science"
  | "Computer Networks & Security"
  | "Software Engineering"
  | "Electrical Engineering"
  | "Artificial Intelligence & Data Science";

export interface ResearchOpportunity {
  id: string;
  title: string;
  department: Department;
  facultyName: string;
  facultyEmail: string;
  facultyRole: string;
  researchArea: string;
  description: string;
  requiredSkills: string[];
  availablePositions: number;
  applicationDeadline: string; // YYYY-MM-DD
  status: OpportunityStatus;
  location: string;
  stipend: string;
  postedDate: string; // YYYY-MM-DD
  eligibility: string;
  prerequisites?: string;
}

export interface OpportunityFormData {
  title: string;
  department: Department;
  facultyName: string;
  facultyEmail: string;
  facultyRole: string;
  researchArea: string;
  description: string;
  requiredSkills: string[];
  availablePositions: number;
  applicationDeadline: string;
  status: OpportunityStatus;
  location: string;
  stipend: string;
  eligibility: string;
  prerequisites?: string;
}

export interface FilterState {
  searchQuery: string;
  department: string; // "All" or Department
  status: string; // "All" | "Open" | "Closed"
  researchArea: string; // "All" or area
  sortBy: "deadline-asc" | "deadline-desc" | "newest" | "positions-desc";
}
