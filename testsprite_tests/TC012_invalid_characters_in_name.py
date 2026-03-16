"""
TC012: Input Validation - Invalid Characters in Name
Tests that create_student rejects names with numbers and special characters
"""
import requests

BASE_URL = "http://localhost:80"
LOGIN_URL = f"{BASE_URL}/api/login.php"
CREATE_STUDENT_URL = f"{BASE_URL}/api/create_student.php"
LOGOUT_URL = f"{BASE_URL}/api/logout.php"
TIMEOUT = 30

def test_invalid_characters_in_name():
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
        
        # Test firstname with numbers
        create_resp_numbers = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "John123",
                "lastname": "Doe",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_numbers.status_code == 400, f"Expected 400, got {create_resp_numbers.status_code}"
        response_json = create_resp_numbers.json()
        assert response_json.get("status") == "failed"
        assert "invalid characters" in response_json.get("message", "").lower() or "errors" in response_json
        print("[PASS] Numbers in firstname rejected")
        
        # Test firstname with special characters
        create_resp_special = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "John@#$%",
                "lastname": "Doe",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_special.status_code == 400, f"Expected 400, got {create_resp_special.status_code}"
        response_json = create_resp_special.json()
        assert response_json.get("status") == "failed"
        print("[PASS] Special characters in firstname rejected")
        
        # Test valid names with apostrophes and hyphens (should be allowed)
        create_resp_apostrophe = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "O'Brien",
                "lastname": "Doe",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_apostrophe.status_code == 200, f"Expected 200, got {create_resp_apostrophe.status_code}"
        print("[PASS] Apostrophe in firstname accepted")
        
        create_resp_hyphen = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "Jean-Marie",
                "lastname": "Smith",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_hyphen.status_code == 200, f"Expected 200, got {create_resp_hyphen.status_code}"
        print("[PASS] Hyphen in firstname accepted")
        
        print("[PASS] Test passed: Character validation works correctly")
        
    finally:
        try:
            session.post(LOGOUT_URL, timeout=TIMEOUT)
        except:
            pass

test_invalid_characters_in_name()
