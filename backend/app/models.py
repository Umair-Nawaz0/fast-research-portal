from sqlalchemy import Column, Integer, String, Text, Date, CheckConstraint
from .database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    research_area = Column(String(150), nullable=False)
    faculty_name = Column(String(150), nullable=False)
    department = Column(String(150), nullable=False)
    required_skills = Column(Text, nullable=False)
    available_positions = Column(Integer, nullable=False)
    application_deadline = Column(Date, nullable=False)
    status = Column(String(10), nullable=False, default="Open")

    __table_args__ = (
        CheckConstraint("available_positions >= 0", name="opportunities_available_positions_check"),
        CheckConstraint("status IN ('Open', 'Closed')", name="opportunities_status_check"),
    )
