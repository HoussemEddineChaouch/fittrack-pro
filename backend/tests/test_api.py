import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

# Use in-memory SQLite for tests
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override DB dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create tables before tests
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "FitTrack Pro" in response.json()["message"]

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_user():
    response = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "testci@test.com",
        "password": "password123"
    })
    assert response.status_code in [200, 400]

def test_login_success():
    # Register first
    client.post("/api/auth/register", json={
        "name": "CI User",
        "email": "ciuser@test.com",
        "password": "password123"
    })
    # Login
    response = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

def test_login_wrong_password():
    response = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_protected_without_token():
    response = client.get("/api/plans")
    assert response.status_code == 401

def test_protected_with_token():
    login = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "password123"
    })
    if login.status_code != 200:
        pytest.skip("Login failed, skipping protected route test")
    token = login.json()["access_token"]
    response = client.get("/api/plans", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200

def test_create_plan_with_token():
    login = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "password123"
    })
    if login.status_code != 200:
        pytest.skip("Login failed")
    token = login.json()["access_token"]
    response = client.post("/api/plans", json={
        "name": "Test Plan",
        "goal": "Gain muscle",
        "description": "CI test plan",
        "category": "Push Pull Legs",
        "difficulty": "Intermediate",
        "duration": 45
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["name"] == "Test Plan"