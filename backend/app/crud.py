from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from .models import Opportunity
from .schemas import OpportunityCreate, OpportunityUpdate


def get_opportunities(
    db: Session,
    skip: int = 0,
    limit: int = 200,
    search: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    research_area: Optional[str] = None,
    sort_by: Optional[str] = None,
) -> List[Opportunity]:
    """Retrieve opportunities with optional filtering, searching, and sorting."""
    query = db.query(Opportunity)

    if status and status != "All":
        query = query.filter(Opportunity.status == status)

    if department and department != "All":
        query = query.filter(Opportunity.department == department)

    if research_area and research_area != "All":
        query = query.filter(Opportunity.research_area == research_area)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Opportunity.title.ilike(term),
                Opportunity.faculty_name.ilike(term),
                Opportunity.research_area.ilike(term),
                Opportunity.description.ilike(term),
                Opportunity.required_skills.ilike(term),
            )
        )

    # Sorting
    if sort_by == "deadline-asc":
        query = query.order_by(asc(Opportunity.application_deadline))
    elif sort_by == "deadline-desc":
        query = query.order_by(desc(Opportunity.application_deadline))
    elif sort_by == "positions-desc":
        query = query.order_by(desc(Opportunity.available_positions))
    else:
        query = query.order_by(desc(Opportunity.id))

    return query.offset(skip).limit(limit).all()


def get_opportunity(db: Session, opportunity_id: int) -> Optional[Opportunity]:
    """Retrieve a single opportunity by ID."""
    return db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()


def create_opportunity(db: Session, opportunity_in: OpportunityCreate) -> Opportunity:
    """Create a new opportunity in the database with transaction commit."""
    db_obj = Opportunity(
        title=opportunity_in.title,
        description=opportunity_in.description,
        research_area=opportunity_in.research_area,
        faculty_name=opportunity_in.faculty_name,
        department=opportunity_in.department,
        required_skills=opportunity_in.required_skills,
        available_positions=opportunity_in.available_positions,
        application_deadline=opportunity_in.application_deadline,
        status=opportunity_in.status,
    )
    try:
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    except Exception:
        db.rollback()
        raise


def update_opportunity(
    db: Session, db_obj: Opportunity, opportunity_in: OpportunityUpdate
) -> Opportunity:
    """Update an existing opportunity with transaction commit."""
    update_data = opportunity_in.model_dump(exclude_unset=True)
    try:
        for field, value in update_data.items():
            if value is not None:
                setattr(db_obj, field, value)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    except Exception:
        db.rollback()
        raise


def delete_opportunity(db: Session, db_obj: Opportunity) -> None:
    """Delete an opportunity from the database with transaction commit."""
    try:
        db.delete(db_obj)
        db.commit()
    except Exception:
        db.rollback()
        raise
