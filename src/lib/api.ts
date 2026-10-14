import {
  ResearchOpportunity,
  OpportunityFormData,
  OpportunityStatus,
  Department,
} from "@/types/opportunity";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface BackendOpportunityResponse {
  id: number;
  title: string;
  description: string;
  research_area: string;
  faculty_name: string;
  department: string;
  required_skills: string;
  available_positions: number;
  application_deadline: string;
  status: "Open" | "Closed";
  facultyName?: string;
  facultyEmail?: string;
  facultyRole?: string;
  researchArea?: string;
  requiredSkills?: string[];
  availablePositions?: number;
  applicationDeadline?: string;
  location?: string;
  stipend?: string;
  postedDate?: string;
  eligibility?: string;
  prerequisites?: string;
}

export interface BackendOpportunityPayload {
  title?: string;
  description?: string;
  department?: string;
  faculty_name?: string;
  research_area?: string;
  available_positions?: number;
  application_deadline?: string;
  status?: "Open" | "Closed";
  required_skills?: string;
}

/**
 * Transforms raw backend OpportunityResponse into the frontend ResearchOpportunity structure.
 */
export function transformBackendOpportunity(
  raw: BackendOpportunityResponse
): ResearchOpportunity {
  let skills: string[] = [];
  if (Array.isArray(raw.requiredSkills)) {
    skills = raw.requiredSkills;
  } else if (typeof raw.required_skills === "string") {
    skills = raw.required_skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  const facultyName = raw.faculty_name || raw.facultyName || "Faculty Mentor";
  const emailName = facultyName
    .toLowerCase()
    .replace(/^dr\.\s*|^prof\.\s*/i, "")
    .replace(/[^a-z0-9]/g, ".");

  return {
    id: String(raw.id),
    title: raw.title,
    department: raw.department as Department,
    facultyName: facultyName,
    facultyEmail:
      raw.facultyEmail || `${emailName || "faculty"}@nu.edu.pk`,
    facultyRole: raw.facultyRole || "Faculty Research Supervisor",
    researchArea: raw.research_area || raw.researchArea || "Computer Networks & Security",
    description: raw.description,
    requiredSkills: skills,
    availablePositions: Number(raw.available_positions ?? raw.availablePositions ?? 1),
    applicationDeadline: raw.application_deadline
      ? String(raw.application_deadline).split("T")[0]
      : raw.applicationDeadline || "",
    status: (raw.status === "Closed" ? "Closed" : "Open") as OpportunityStatus,
    location: raw.location || "FAST Research Lab - Main Campus",
    stipend: raw.stipend || "Funded Research Assistantship Available",
    postedDate:
      raw.postedDate ||
      (raw.application_deadline
        ? String(raw.application_deadline).split("T")[0]
        : new Date().toISOString().split("T")[0]),
    eligibility:
      raw.eligibility || "Enrolled FAST-NUCES student with relevant prerequisite coursework",
    prerequisites: raw.prerequisites || "",
  };
}

/**
 * Transforms frontend opportunity data into the backend payload schema.
 */
export function transformFrontendToBackend(
  data: Partial<OpportunityFormData>
): BackendOpportunityPayload {
  const payload: BackendOpportunityPayload = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.description !== undefined) payload.description = data.description;
  if (data.department !== undefined) payload.department = data.department;
  if (data.facultyName !== undefined) payload.faculty_name = data.facultyName;
  if (data.researchArea !== undefined) payload.research_area = data.researchArea;
  if (data.availablePositions !== undefined)
    payload.available_positions = Number(data.availablePositions);
  if (data.applicationDeadline !== undefined)
    payload.application_deadline = data.applicationDeadline;
  if (data.status !== undefined) payload.status = data.status;

  if (data.requiredSkills !== undefined) {
    payload.required_skills = Array.isArray(data.requiredSkills)
      ? data.requiredSkills.join(", ")
      : String(data.requiredSkills);
  }

  return payload;
}

/**
 * Helper to make API requests with unified error handling.
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }
      let message = `API Error: ${response.statusText} (${response.status})`;
      if (
        errorData &&
        typeof errorData === "object" &&
        "detail" in errorData
      ) {
        const detail = (errorData as { detail: unknown }).detail;
        if (typeof detail === "string") {
          message = detail;
        } else if (Array.isArray(detail)) {
          message = detail
            .map((item) =>
              typeof item === "object" && item && "msg" in item
                ? String((item as { msg: unknown }).msg)
                : JSON.stringify(item)
            )
            .join(", ");
        }
      }

      throw new ApiError(message, response.status, errorData);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error connecting to ${url}: ${(error as Error).message}`,
      0,
      error
    );
  }
}

/**
 * Centralized API Service for University Research Opportunities
 */
export const api = {
  /**
   * Health check for API server and database connectivity
   */
  async getHealth(): Promise<{ status: string; database: string }> {
    return apiRequest<{ status: string; database: string }>("/api/health");
  },

  /**
   * Fetch opportunities with optional query filters
   */
  async getOpportunities(params?: {
    search?: string;
    department?: string;
    status?: string;
    research_area?: string;
    sort_by?: string;
  }): Promise<ResearchOpportunity[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.department && params.department !== "All")
      query.append("department", params.department);
    if (params?.status && params.status !== "All")
      query.append("status", params.status);
    if (params?.research_area && params.research_area !== "All")
      query.append("research_area", params.research_area);
    if (params?.sort_by) query.append("sort_by", params.sort_by);

    const queryString = query.toString();
    const endpoint = `/api/opportunities${queryString ? `?${queryString}` : ""}`;

    const rawList = await apiRequest<BackendOpportunityResponse[]>(endpoint, {
      method: "GET",
    });
    return rawList.map(transformBackendOpportunity);
  },

  /**
   * Fetch a single opportunity by ID
   */
  async getOpportunity(id: string | number): Promise<ResearchOpportunity> {
    const raw = await apiRequest<BackendOpportunityResponse>(
      `/api/opportunities/${id}`,
      {
        method: "GET",
      }
    );
    return transformBackendOpportunity(raw);
  },

  /**
   * Create a new research opportunity
   */
  async createOpportunity(data: OpportunityFormData): Promise<ResearchOpportunity> {
    const payload = transformFrontendToBackend(data);
    const raw = await apiRequest<BackendOpportunityResponse>(
      "/api/opportunities",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return transformBackendOpportunity(raw);
  },

  /**
   * Update an existing research opportunity
   */
  async updateOpportunity(
    id: string | number,
    data: Partial<OpportunityFormData>
  ): Promise<ResearchOpportunity> {
    const payload = transformFrontendToBackend(data);
    const raw = await apiRequest<BackendOpportunityResponse>(
      `/api/opportunities/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    return transformBackendOpportunity(raw);
  },

  /**
   * Delete an opportunity by ID
   */
  async deleteOpportunity(id: string | number): Promise<{ message: string; id: number }> {
    return apiRequest<{ message: string; id: number }>(
      `/api/opportunities/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
