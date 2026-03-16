import requests

BASE_URL = "http://localhost:80"

def test_post_api_login_php_with_valid_and_invalid_credentials():
    session = requests.Session()
    login_url = f"{BASE_URL}/api/login.php"
    me_url = f"{BASE_URL}/api/me.php"

    valid_username = "testuser"
    valid_password = "correct_password"
    invalid_password = "wrong_password"

    # Test with valid credentials
    try:
        valid_resp = session.post(
            login_url,
            json={"username": valid_username, "password": valid_password},
            timeout=30
        )
        assert valid_resp.status_code == 200, f"Expected 200, got {valid_resp.status_code}"
        valid_json = valid_resp.json()
        assert valid_json.get("status") == "ok", f"Expected status 'ok', got {valid_json.get('status')}"
        assert "message" in valid_json and isinstance(valid_json["message"], str)

        # Session cookie should be set
        assert session.cookies, "Session cookie expected but none found"

        # Validate session by calling /api/me.php with session cookie
        me_resp = session.get(me_url, timeout=30)
        assert me_resp.status_code == 200, f"Expected 200 from /api/me.php, got {me_resp.status_code}"
        me_json = me_resp.json()
        assert me_json.get("authenticated") is True, f"Expected authenticated True, got {me_json.get('authenticated')}"
        assert me_json.get("user") == valid_username, f"Expected user '{valid_username}', got {me_json.get('user')}"

    except requests.RequestException as e:
        assert False, f"RequestException during valid credentials test: {e}"
    finally:
        session.close()

    # Test with invalid password (no session cookie expected)
    try:
        invalid_resp = requests.post(
            login_url,
            json={"username": valid_username, "password": invalid_password},
            timeout=30
        )
        assert invalid_resp.status_code == 200, f"Expected 200, got {invalid_resp.status_code}"
        invalid_json = invalid_resp.json()
        assert invalid_json.get("status") == "failed", f"Expected status 'failed', got {invalid_json.get('status')}"
        assert "message" in invalid_json and isinstance(invalid_json["message"], str)

        # No session cookie should be set
        cookies = invalid_resp.cookies
        assert not cookies or all(not c.value for c in cookies), "No session cookies expected on login failure"

        # Calling /api/me.php without session cookie should show unauthenticated
        me_resp2 = requests.get(me_url, timeout=30)
        assert me_resp2.status_code == 200, f"Expected 200 from /api/me.php, got {me_resp2.status_code}"
        me_json2 = me_resp2.json()
        assert me_json2.get("authenticated") is False, f"Expected authenticated False, got {me_json2.get('authenticated')}"
        assert me_json2.get("user") is None, f"Expected user None, got {me_json2.get('user')}"

    except requests.RequestException as e:
        assert False, f"RequestException during invalid credentials test: {e}"

test_post_api_login_php_with_valid_and_invalid_credentials()