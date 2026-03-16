"""
TC008: Input Validation - Empty Firstname
Tests that create_student rejects empty firstname
"""
import requests

BASE_URL = "http://localhost:80"
LOGIN_URL = f"{BASE_URL}/api/login.php"
CREATE_STUDENT_URL = f"{BASE_URL}/api/create_student.php"
LOGOUT_URL = f"{BASE_URL}/api/logout.php"
TIMEOUT = 30

def test_create_student_empty_firstname():
    session = requests.Session()
    
    try:
        # Login
        login_resp = session.post(
            LOGIN_URL,
            json={"username": "testuser", "password": "testpass"},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200
        assert login_resp.json().get("status") == "ok"
        
        # Try to create student with empty firstname
        create_resp = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "",
                "lastname": "Doe",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        # Should fail with 400
        assert create_resp.status_code == 400, f"Expected 400, got {create_resp.status_code}"
        response_json = create_resp.json()
        
        # Should have validation errors
        assert response_json.get("status") == "failed"
        assert "Validation failed" in response_json.get("message", "")
        assert "errors" in response_json
        assert len(response_json["errors"]) > 0
        
        print("[PASS] Test passed: Empty firstname validation works")
        
    finally:
        try:
            session.post(LOGOUT_URL, timeout=TIMEOUT)
        except:
            pass

test_create_student_empty_firstname()
