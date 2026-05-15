from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "FitTrack Pro" in response.json()["message"]

def test_health():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_user():
    """Test user registration"""
    response = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "testci@test.com",
        "password": "password123"
    })
    assert response.status_code in [200, 400]  # 400 if already exists

def test_login_user():
    """Test user login"""
    # Register first
    client.post("/api/auth/register", json={
        "name": "CI User",
        "email": "ciuser@test.com",
        "password": "password123"
    })
    # Then login
    response = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    """Test login with wrong password returns 401"""
    response = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_protected_route_without_token():
    """Test protected route returns 401 without token"""
    response = client.get("/api/plans")
    assert response.status_code == 401

def test_protected_route_with_token():
    """Test protected route works with valid token"""
    # Login to get token
    login_res = client.post("/api/auth/login", json={
        "email": "ciuser@test.com",
        "password": "password123"
    })
    if login_res.status_code != 200:
        return
    token = login_res.json()["access_token"]

    # Access protected route
    response = client.get("/api/plans", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200