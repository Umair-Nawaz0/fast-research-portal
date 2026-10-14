from datetime import date
from typing import List, Literal, Optional, Union, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator, computed_field

OpportunityStatus = Literal["Open", "Closed"]


class OpportunityBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Project title")
    description: str = Field(..., min_length=1, description="Detailed project description")
    research_area: str = Field(..., min_length=1, max_length=150, description="Research area / specialization")
    faculty_name: str = Field(..., min_length=1, max_length=150, description="Faculty mentor name")
    department: str = Field(..., min_length=1, max_length=150, description="Academic department")
    required_skills: Union[str, List[str]] = Field(..., description="Required skills (string or array of strings)")
    available_positions: int = Field(..., ge=0, description="Number of positions (non-negative integer)")
    application_deadline: date = Field(..., description="Application deadline date (YYYY-MM-DD)")
    status: OpportunityStatus = Field(default="Open", description="Listing status: 'Open' or 'Closed'")

    @model_validator(mode="before")
    @classmethod
    def map_camel_case_inputs(cls, data: Any) -> Any:
        if isinstance(data, dict):
            field_mappings = {
                "facultyName": "faculty_name",
                "researchArea": "research_area",
                "requiredSkills": "required_skills",
                "availablePositions": "available_positions",
                "applicationDeadline": "application_deadline",
            }
            normalized = dict(data)
            for camel, snake in field_mappings.items():
                if camel in normalized and snake not in normalized:
                    normalized[snake] = normalized[camel]
            return normalized
        return data

    @field_validator("required_skills", mode="before")
    @classmethod
    def format_required_skills(cls, value: Any) -> str:
        if isinstance(value, list):
            items = [str(x).strip() for x in value if str(x).strip()]
            if not items:
                raise ValueError("required_skills list cannot be empty")
            return ", ".join(items)
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("required_skills cannot be empty")
            return cleaned
        raise ValueError("required_skills must be a string or list of strings")

    @field_validator("title", "description", "research_area", "faculty_name", "department")
    @classmethod
    def non_empty_strip(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty or whitespace only")
        return cleaned


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    research_area: Optional[str] = Field(None, min_length=1, max_length=150)
    faculty_name: Optional[str] = Field(None, min_length=1, max_length=150)
    department: Optional[str] = Field(None, min_length=1, max_length=150)
    required_skills: Optional[Union[str, List[str]]] = None
    available_positions: Optional[int] = Field(None, ge=0)
    application_deadline: Optional[date] = None
    status: Optional[OpportunityStatus] = None

    @model_validator(mode="before")
    @classmethod
    def map_camel_case_inputs(cls, data: Any) -> Any:
        if isinstance(data, dict):
            field_mappings = {
                "facultyName": "faculty_name",
                "researchArea": "research_area",
                "requiredSkills": "required_skills",
                "availablePositions": "available_positions",
                "applicationDeadline": "application_deadline",
            }
            normalized = dict(data)
            for camel, snake in field_mappings.items():
                if camel in normalized and snake not in normalized:
                    normalized[snake] = normalized[camel]
            return normalized
        return data

    @field_validator("required_skills", mode="before")
    @classmethod
    def format_required_skills(cls, value: Any) -> Optional[str]:
        if value is None:
            return None
        if isinstance(value, list):
            items = [str(x).strip() for x in value if str(x).strip()]
            if not items:
                raise ValueError("required_skills list cannot be empty")
            return ", ".join(items)
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("required_skills cannot be empty")
            return cleaned
        raise ValueError("required_skills must be a string or list of strings")

    @field_validator("title", "description", "research_area", "faculty_name", "department")
    @classmethod
    def non_empty_strip(cls, value: Optional[str]) -> Optional[str]:
        if value is not None:
            cleaned = value.strip()
            if not cleaned:
                raise ValueError("Field cannot be empty or whitespace only")
            return cleaned
        return value


class OpportunityResponse(BaseModel):
    id: int
    title: str
    description: str
    research_area: str
    faculty_name: str
    department: str
    required_skills: str
    available_positions: int
    application_deadline: date
    status: OpportunityStatus

    model_config = ConfigDict(from_attributes=True)

    # Convenience aliases for frontend consumption
    @computed_field
    @property
    def facultyName(self) -> str:
        return self.faculty_name

    @computed_field
    @property
    def researchArea(self) -> str:
        return self.research_area

    @computed_field
    @property
    def availablePositions(self) -> int:
        return self.available_positions

    @computed_field
    @property
    def applicationDeadline(self) -> str:
        return self.application_deadline.isoformat()

    @computed_field
    @property
    def requiredSkills(self) -> List[str]:
        if not self.required_skills:
            return []
        return [s.strip() for s in self.required_skills.split(",") if s.strip()]


class HealthResponse(BaseModel):
    status: str
    database: str
