import requests

BASE_URL = "http://localhost:80"
TIMEOUT = 30

def test_get_api_students_php_retrieve_all_students():
    url = f"{BASE_URL}/api/students.php"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request to GET /api/students.php failed: {e}"
    try:
        students = response.json()
    except ValueError as e:
        assert False, f"Response is not valid JSON: {e}"

    assert isinstance(students, list), f"Expected response to be a list but got {type(students)}"

    for student in students:
        assert isinstance(student, dict), f"Each student should be a dict but got {type(student)}"
        assert "id" in student, f"Student record missing 'id' field: {student}"
        assert "firstname" in student, f"Student record missing 'firstname' field: {student}"
        assert "lastname" in student, f"Student record missing 'lastname' field: {student}"
        assert "ratings" in student, f"Student record missing 'ratings' field: {student}"

        assert isinstance(student["id"], int), f"Student 'id' should be int but got {type(student['id'])}"
        assert isinstance(student["firstname"], str), f"Student 'firstname' should be str but got {type(student['firstname'])}"
        assert isinstance(student["lastname"], str), f"Student 'lastname' should be str but got {type(student['lastname'])}"
        assert isinstance(student["ratings"], (int, float)), f"Student 'ratings' should be number but got {type(student['ratings'])}"

test_get_api_students_php_retrieve_all_students()