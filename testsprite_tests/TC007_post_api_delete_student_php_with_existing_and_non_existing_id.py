import requests

BASE_URL = "http://localhost:80"
LOGIN_URL = f"{BASE_URL}/api/login.php"
LOGOUT_URL = f"{BASE_URL}/api/logout.php"
CREATE_STUDENT_URL = f"{BASE_URL}/api/create_student.php"
DELETE_STUDENT_URL = f"{BASE_URL}/api/delete_student.php"
STUDENTS_URL = f"{BASE_URL}/api/students.php"

USERNAME = "testuser"
PASSWORD = "testpass"
TIMEOUT = 30


def test_post_api_delete_student_php_existing_and_non_existing_id():
    session = requests.Session()
    try:
        # Login to get session cookie
        login_resp = session.post(
            LOGIN_URL,
            json={"username": USERNAME, "password": PASSWORD},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200
        login_json = login_resp.json()
        assert login_json.get("status") == "ok"
        assert session.cookies.get_dict()  # ensure session cookie is set

        # Create a student to delete later
        create_req_body = {"firstname": "Delete", "lastname": "Test", "ratings": 5}
        create_resp = session.post(CREATE_STUDENT_URL, json=create_req_body, timeout=TIMEOUT)
        assert create_resp.status_code == 200
        create_json = create_resp.json()
        assert create_json.get("status") == "ok"

        # Get list of students and find the newly created student id
        students_resp = session.get(STUDENTS_URL, timeout=TIMEOUT)
        assert students_resp.status_code == 200
        students = students_resp.json()
        created_students = [s for s in students if s.get("firstname") == create_req_body["firstname"] and s.get("lastname") == create_req_body["lastname"]]
        assert created_students, "Created student not found in students list"
        student_id = created_students[0]["id"]

        # 1) Delete with valid session and existing student id
        delete_resp = session.post(DELETE_STUDENT_URL, json={"id": student_id}, timeout=TIMEOUT)
        assert delete_resp.status_code == 200
        delete_json = delete_resp.json()
        assert delete_json.get("status") == "ok"

        # Confirm deletion by checking student no longer in the list
        students_after_delete_resp = session.get(STUDENTS_URL, timeout=TIMEOUT)
        assert students_after_delete_resp.status_code == 200
        students_after_delete = students_after_delete_resp.json()
        assert all(s["id"] != student_id for s in students_after_delete)

        # 2) Delete with valid session and non-existent student id (choose large id unlikely to exist)
        non_existent_id = 999999999
        delete_non_exist_resp = session.post(DELETE_STUDENT_URL, json={"id": non_existent_id}, timeout=TIMEOUT)
        assert delete_non_exist_resp.status_code == 200
        delete_non_exist_json = delete_non_exist_resp.json()
        assert delete_non_exist_json.get("status") == "failed"
        assert "not found" in delete_non_exist_json.get("message", "").lower()

        # 3) Delete without session cookie to test auth enforcement
        # FIXED: Should now properly return 401 Unauthorized
        no_auth_session = requests.Session()
        delete_no_auth_resp = no_auth_session.post(DELETE_STUDENT_URL, json={"id": student_id}, timeout=TIMEOUT)
        assert delete_no_auth_resp.status_code == 401, f"Expected 401, got {delete_no_auth_resp.status_code}"
        delete_no_auth_json = delete_no_auth_resp.json()
        # Should return failed status with auth message
        assert delete_no_auth_json.get("status") == "failed", f"Expected failed status, got {delete_no_auth_json.get('status')}"
        assert "auth" in delete_no_auth_json.get("message", "").lower()

    finally:
        # Cleanup: If student still exists, try to delete with auth to leave system clean
        try:
            resp = session.get(STUDENTS_URL, timeout=TIMEOUT)
            if resp.status_code == 200:
                students = resp.json()
                for s in students:
                    if s.get("firstname") == "Delete" and s.get("lastname") == "Test":
                        session.post(DELETE_STUDENT_URL, json={"id": s["id"]}, timeout=TIMEOUT)
        except Exception:
            pass

        # Logout session
        try:
            session.post(LOGOUT_URL, timeout=TIMEOUT)
        except Exception:
            pass


test_post_api_delete_student_php_existing_and_non_existing_id()