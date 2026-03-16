import requests

BASE_URL = "http://localhost:80"
LOGIN_ENDPOINT = "/api/login.php"
LOGOUT_ENDPOINT = "/api/logout.php"
CREATE_STUDENT_ENDPOINT = "/api/create_student.php"
GET_STUDENTS_ENDPOINT = "/api/students.php"

USERNAME = "testuser"
PASSWORD = "testpass"

def test_post_api_create_student_php_with_authentication():
    session = requests.Session()
    try:
        # Login to get session cookie
        login_resp = session.post(
            BASE_URL + LOGIN_ENDPOINT,
            json={"username": USERNAME, "password": PASSWORD},
            timeout=30
        )
        assert login_resp.status_code == 200
        login_json = login_resp.json()
        assert "status" in login_json
        assert login_json["status"] == "ok"

        # Prepare valid student data
        student_data = {
            "firstname": "John",
            "lastname": "Doe",
            "ratings": 85
        }

        # Create student with valid session cookie
        create_resp = session.post(
            BASE_URL + CREATE_STUDENT_ENDPOINT,
            json=student_data,
            timeout=30
        )
        assert create_resp.status_code == 200
        create_json = create_resp.json()
        assert "status" in create_json
        assert create_json["status"] == "ok"

        # Verify student is created by fetching students list with session cookie
        students_resp = session.get(
            BASE_URL + GET_STUDENTS_ENDPOINT,
            timeout=30
        )
        assert students_resp.status_code == 200
        students_json = students_resp.json()
        assert isinstance(students_json, list)
        found = False
        for student in students_json:
            if (
                student.get("firstname") == student_data["firstname"] and
                student.get("lastname") == student_data["lastname"] and
                student.get("ratings") == student_data["ratings"]
            ):
                found = True
                break
        assert found, "Created student record not found in students list."

    finally:
        # Cleanup: delete the created student if found
        # To delete, we must find student's id
        if 'students_json' in locals() and found:
            student_id = None
            for student in students_json:
                if (
                    student.get("firstname") == student_data["firstname"] and
                    student.get("lastname") == student_data["lastname"] and
                    student.get("ratings") == student_data["ratings"]
                ):
                    student_id = student.get("id")
                    break
            if student_id is not None:
                # Delete student
                session.post(
                    BASE_URL + "/api/delete_student.php",
                    json={"id": student_id},
                    timeout=30
                )
        # Logout the session
        session.post(
            BASE_URL + LOGOUT_ENDPOINT,
            timeout=30
        )
        session.close()

    # Test creating student without session cookie
    no_auth_resp = requests.post(
        BASE_URL + CREATE_STUDENT_ENDPOINT,
        json=student_data,
        timeout=30
    )
    # Accept 401 Unauthorized or 200 with status failed and message auth required
    if no_auth_resp.status_code == 401:
        pass
    elif no_auth_resp.status_code == 200:
        no_auth_json = no_auth_resp.json()
        assert "status" in no_auth_json
        assert no_auth_json["status"] == "failed"
        assert "auth required" in no_auth_json.get("message", "").lower()
    else:
        assert False, f"Unexpected status code {no_auth_resp.status_code} for unauthorized create_student request."

test_post_api_create_student_php_with_authentication()