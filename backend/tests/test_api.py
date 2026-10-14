import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"


def test_read_opportunities_empty_or_list():
    """Test retrieving opportunities list."""
    response = client.get("/api/opportunities")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_opportunity_valid():
    """Test creating a valid opportunity."""
    payload = {
        "title": "Quantum Key Distribution in Software-Defined Optical Networks",
        "description": "Investigate real-time QKD protocol integration with P4 programmable switches for high-security campus backbones.",
        "research_area": "Network Security & Intrusion Detection",
        "faculty_name": "Dr. Zeeshan Ali",
        "department": "Computer Networks & Security",
        "required_skills": ["Python", "OpenFlow", "Cryptography", "Network Simulation"],
        "available_positions": 2,
        "application_deadline": "2026-11-30",
        "status": "Open",
    }
    response = client.post("/api/opportunities", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["faculty_name"] == payload["faculty_name"]
    assert data["facultyName"] == payload["faculty_name"]
    assert data["available_positions"] == 2
    assert data["status"] == "Open"
    assert "Python" in data["required_skills"]

    opp_id = data["id"]

    # Verify GET by ID
    get_res = client.get(f"/api/opportunities/{opp_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == opp_id

    # Verify PUT update
    update_payload = {
        "title": "Updated: Quantum Key Distribution in SDNs",
        "status": "Closed",
        "available_positions": 1,
    }
    put_res = client.put(f"/api/opportunities/{opp_id}", json=update_payload)
    assert put_res.status_code == 200
    updated_data = put_res.json()
    assert updated_data["title"] == "Updated: Quantum Key Distribution in SDNs"
    assert updated_data["status"] == "Closed"
    assert updated_data["available_positions"] == 1

    # Verify DELETE
    del_res = client.delete(f"/api/opportunities/{opp_id}")
    assert del_res.status_code == 200
    assert del_res.json()["id"] == opp_id

    # Verify subsequent GET returns 404
    after_del = client.get(f"/api/opportunities/{opp_id}")
    assert after_del.status_code == 404


def test_create_opportunity_invalid_inputs():
    """Test validation errors for invalid payload."""
    # 1. Missing required fields
    response = client.post("/api/opportunities", json={"title": "Missing fields"})
    assert response.status_code == 422

    # 2. Negative available_positions
    payload = {
        "title": "Invalid positions project",
        "description": "Some description text here...",
        "research_area": "Edge Computing & 5G/6G Core",
        "faculty_name": "Dr. Test Mentor",
        "department": "Computer Science",
        "required_skills": ["Python"],
        "available_positions": -5,
        "application_deadline": "2026-12-01",
        "status": "Open",
    }
    res_neg = client.post("/api/opportunities", json=payload)
    assert res_neg.status_code == 422

    # 3. Invalid status
    payload["available_positions"] = 2
    payload["status"] = "Pending"
    res_status = client.post("/api/opportunities", json=payload)
    assert res_status.status_code == 422


def test_get_nonexistent_opportunity():
    """Test 404 for missing opportunity."""
    response = client.get("/api/opportunities/99999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_nonexistent_opportunity():
    """Test 404 when updating missing opportunity."""
    response = client.put("/api/opportunities/99999999", json={"title": "Nonexistent"})
    assert response.status_code == 404


def test_delete_nonexistent_opportunity():
    """Test 404 when deleting missing opportunity."""
    response = client.delete("/api/opportunities/99999999")
    assert response.status_code == 404
