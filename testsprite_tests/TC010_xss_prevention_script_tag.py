"""
TC010: XSS Prevention - Script Tag in Firstname
Tests that create_student sanitizes XSS payloads in firstname
"""
import requests

BASE_URL = "http://localhost:80"
LOGIN_URL = f"{BASE_URL}/api/login.php"
CREATE_STUDENT_URL = f"{BASE_URL}/api/create_student.php"
LOGOUT_URL = f"{BASE_URL}/api/logout.php"
STUDENTS_URL = f"{BASE_URL}/api/students.php"
TIMEOUT = 30

def test_xss_prevention_script_tag():
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
        
        # Try to create student with XSS payload
        xss_payload = "<script>alert('xss')</script>"
        create_resp = session.post(
            CREATE_STUDENT_URL,
            json={
                "firstname": xss_payload,
                "lastname": "Doe",
                "ratings": 50
            },
            timeout=TIMEOUT
        )
        
        # This should either:
        # 1. Fail with 400 if validation detects invalid characters
        # 2. Succeed but with sanitized data
        
        if create_resp.status_code == 400:
            # Validation rejected it (good)
            response_json = create_resp.json()
            assert response_json.get("status") == "failed"
            assert "Validation failed" in response_json.get("message", "")
            assert "errors" in response_json
            print("[PASS] Test passed: XSS payload rejected by validation")
        else:
            # Accepted but should be sanitized
            assert create_resp.status_code == 200
            
            # Check that it was stored safely (not as actual script)
            students_resp = session.get(STUDENTS_URL, timeout=TIMEOUT)
            assert students_resp.status_code == 200
            students = students_resp.json()
            
            # Find the created student
            xss_students = [s for s in students if "Doe" in s.get("lastname", "")]
            assert len(xss_students) > 0
            
            # Verify the payload is escaped/sanitized
            created_student = xss_students[0]
            firstname = created_student.get("firstname", "")
            
            # Should NOT contain the raw script tag
            assert "<script>" not in firstname
            assert "</script>" not in firstname
            
            # Clean up
            session.post(f"{BASE_URL}/api/delete_student.php", 
                        json={"id": created_student["id"]}, timeout=TIMEOUT)
            
            print("[PASS] Test passed: XSS payload sanitized in database")
        
    finally:
        try:
            session.post(LOGOUT_URL, timeout=TIMEOUT)
        except:
            pass

test_xss_prevention_script_tag()
