"""
TC011: Input Validation - Ratings Out of Range
Tests that create_student rejects ratings outside 0-100 range
"""
import requests

BASE_URL = "http://localhost:80"
LOGIN_URL = f"{BASE_URL}/api/login.php"
CREATE_STUDENT_URL = f"{BASE_URL}/api/create_student.php"
LOGOUT_URL = f"{BASE_URL}/api/logout.php"
TIMEOUT = 30

def test_ratings_out_of_range():
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
        
        # Test negative rating
        create_resp_negative = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "John",
                "lastname": "Doe",
                "ratings": -10
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_negative.status_code == 400, f"Expected 400, got {create_resp_negative.status_code}"
        response_json = create_resp_negative.json()
        assert response_json.get("status") == "failed"
        assert "errors" in response_json
        print("[PASS] Negative rating rejected")
        
        # Test rating > 100
        create_resp_high = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "Jane",
                "lastname": "Smith",
                "ratings": 150
            },
            timeout=TIMEOUT
        )
        
        assert create_resp_high.status_code == 400, f"Expected 400, got {create_resp_high.status_code}"
        response_json = create_resp_high.json()
        assert response_json.get("status") == "failed"
        assert "errors" in response_json
        print("[PASS] Rating > 100 rejected")
        
        # Test valid edge cases
        create_resp_zero = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "Zero",
                "lastname": "Rated",
                "ratings": 0
            },
            timeout=TIMEOUT
        )
        assert create_resp_zero.status_code == 200, f"Expected 200, got {create_resp_zero.status_code}"
        print("[PASS] Rating 0 accepted")
        
        create_resp_hundred = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": "Perfect",
                "lastname": "Score",
                "ratings": 100
            },
            timeout=TIMEOUT
        )
        assert create_resp_hundred.status_code == 200, f"Expected 200, got {create_resp_hundred.status_code}"
        print("[PASS] Rating 100 accepted")
        
        print("[PASS] Test passed: Ratings validation works correctly")
        
    finally:
        try:
            session.post(LOGOUT_URL, timeout=TIMEOUT)
        except:
            pass

test_ratings_out_of_range()
