import requests

BASE_URL = "http://localhost:80"
LOGIN_ENDPOINT = f"{BASE_URL}/api/login.php"
LOGOUT_ENDPOINT = f"{BASE_URL}/api/logout.php"
ME_ENDPOINT = f"{BASE_URL}/api/me.php"
TIMEOUT = 30

def test_get_api_me_php_session_introspection():
    session = requests.Session()
    valid_username = "testuser"
    valid_password = "testpass"
    invalid_password = "wrongpass"

    # 1. Test GET /api/me.php without session cookie
    resp = requests.get(ME_ENDPOINT, timeout=TIMEOUT)
    assert resp.status_code == 200, "me.php without session did not return 200"
    data = resp.json()
    assert isinstance(data.get("authenticated"), bool), "authenticated field missing or not bool"
    assert data.get("authenticated") is False, "authenticated should be False without session"
    assert data.get("user") is None, "user should be None without session"

    # 2. Test with invalid login - POST /api/login.php with invalid password
    login_payload_invalid = {"username": valid_username, "password": invalid_password}
    resp_login_invalid = requests.post(LOGIN_ENDPOINT, json=login_payload_invalid, timeout=TIMEOUT)
    assert resp_login_invalid.status_code == 200, "login with invalid password did not return 200"
    login_data_invalid = resp_login_invalid.json()
    assert login_data_invalid.get("status") == "failed", "login status should be failed for invalid password"
    assert "message" in login_data_invalid, "login failed response missing message"
    # Followed by GET /api/me.php without session cookie (should remain unauthenticated)
    resp_me_post_invalid = requests.get(ME_ENDPOINT, timeout=TIMEOUT)
    assert resp_me_post_invalid.status_code == 200, "me.php after failed login did not return 200"
    data_me_post_invalid = resp_me_post_invalid.json()
    assert data_me_post_invalid.get("authenticated") is False, "authenticated should be False after failed login"
    assert data_me_post_invalid.get("user") is None, "user should be None after failed login"

    # 3. Test with valid login - POST /api/login.php with valid credentials
    login_payload_valid = {"username": valid_username, "password": valid_password}
    resp_login_valid = session.post(LOGIN_ENDPOINT, json=login_payload_valid, timeout=TIMEOUT)
    assert resp_login_valid.status_code == 200, "login with valid credentials did not return 200"
    login_data_valid = resp_login_valid.json()
    assert login_data_valid.get("status") == "ok", "login status should be ok for valid credentials"
    assert "message" in login_data_valid, "login ok response missing message"
    # session cookie should be set in session automatically by requests.Session()

    # 4. GET /api/me.php with session cookie should return authenticated: true and correct user
    resp_me_auth = session.get(ME_ENDPOINT, timeout=TIMEOUT)
    assert resp_me_auth.status_code == 200, "me.php with session did not return 200"
    data_me_auth = resp_me_auth.json()
    assert data_me_auth.get("authenticated") is True, "authenticated should be True with session"
    assert data_me_auth.get("user") == valid_username, f"user should be '{valid_username}' with session"

    # 5. Logout and verify /api/me.php returns unauthenticated
    resp_logout = session.post(LOGOUT_ENDPOINT, timeout=TIMEOUT)
    assert resp_logout.status_code == 200, "logout did not return 200"
    logout_data = resp_logout.json()
    assert logout_data.get("status") == "ok", "logout status should be ok"
    assert "message" in logout_data, "logout response missing message"

    # 6. After logout, GET /api/me.php should return authenticated false and user null
    resp_me_after_logout = session.get(ME_ENDPOINT, timeout=TIMEOUT)
    assert resp_me_after_logout.status_code == 200, "me.php after logout did not return 200"
    data_me_after_logout = resp_me_after_logout.json()
    assert data_me_after_logout.get("authenticated") is False, "authenticated should be False after logout"
    assert data_me_after_logout.get("user") is None, "user should be None after logout"


test_get_api_me_php_session_introspection()