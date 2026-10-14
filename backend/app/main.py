from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from .config import CORS_ORIGINS
from .database import get_db
from .schemas import (
    OpportunityResponse,
    OpportunityCreate,
    OpportunityUpdate,
    HealthResponse,
)
from . import crud

app = FastAPI(
    title="University Research Opportunity Portal API",
    description="FastAPI Backend for managing university research opportunities with PostgreSQL persistence.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Configure CORS for local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint that verifies database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"unreachable: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "degraded", "database": db_status},
        )
    return {"status": "ok", "database": db_status}


@app.get("/api/opportunities", response_model=List[OpportunityResponse], tags=["Opportunities"])
def read_opportunities(
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Limit for pagination"),
    search: Optional[str] = Query(None, description="Search across title, faculty, area, description, skills"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status: Optional[str] = Query(None, description="Filter by status (Open or Closed)"),
    research_area: Optional[str] = Query(None, description="Filter by research area"),
    sort_by: Optional[str] = Query(None, description="Sort order: deadline-asc, deadline-desc, positions-desc"),
    db: Session = Depends(get_db),
):
    """Retrieve all research opportunities with optional filtering and sorting."""
    return crud.get_opportunities(
        db=db,
        skip=skip,
        limit=limit,
        search=search,
        department=department,
        status=status,
        research_area=research_area,
        sort_by=sort_by,
    )


@app.get(
    "/api/opportunities/{id}",
    response_model=OpportunityResponse,
    tags=["Opportunities"],
    responses={404: {"description": "Opportunity not found"}},
)
def read_opportunity(id: int, db: Session = Depends(get_db)):
    """Retrieve details of a single research opportunity by ID."""
    opportunity = crud.get_opportunity(db, opportunity_id=id)
    if not opportunity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity with id {id} not found",
        )
    return opportunity


@app.post(
    "/api/opportunities",
    response_model=OpportunityResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Opportunities"],
    responses={
        422: {"description": "Validation Error"},
    },
)
def create_new_opportunity(
    opportunity_in: OpportunityCreate,
    db: Session = Depends(get_db),
):
    """Create a new research opportunity listing."""
    return crud.create_opportunity(db=db, opportunity_in=opportunity_in)


@app.put(
    "/api/opportunities/{id}",
    response_model=OpportunityResponse,
    tags=["Opportunities"],
    responses={
        404: {"description": "Opportunity not found"},
        422: {"description": "Validation Error"},
    },
)
def update_existing_opportunity(
    id: int,
    opportunity_in: OpportunityUpdate,
    db: Session = Depends(get_db),
):
    """Update an existing research opportunity by ID."""
    db_obj = crud.get_opportunity(db, opportunity_id=id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity with id {id} not found",
        )
    return crud.update_opportunity(db=db, db_obj=db_obj, opportunity_in=opportunity_in)


@app.delete(
    "/api/opportunities/{id}",
    tags=["Opportunities"],
    responses={
        404: {"description": "Opportunity not found"},
    },
)
def delete_existing_opportunity(id: int, db: Session = Depends(get_db)):
    """Delete a research opportunity by ID."""
    db_obj = crud.get_opportunity(db, opportunity_id=id)
    if not db_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Opportunity with id {id} not found",
        )
    crud.delete_opportunity(db=db, db_obj=db_obj)
    return {"message": f"Opportunity {id} deleted successfully", "id": id}
