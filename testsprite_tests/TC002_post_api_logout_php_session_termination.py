import requests

BASE_URL = "http://localhost:80"

def test_post_api_logout_php_session_termination():
    login_url = f"{BASE_URL}/api/login.php"
    logout_url = f"{BASE_URL}/api/logout.php"
    me_url = f"{BASE_URL}/api/me.php"

    # Use a valid test user; replace with valid credentials for your environment
    credentials = {
        "username": "testuser",
        "password": "testpassword"
    }

    session = requests.Session()
    try:
        # Login to create an authenticated session
        login_resp = session.post(login_url, json=credentials, timeout=30)
        assert login_resp.status_code == 200
        login_json = login_resp.json()
        assert "status" in login_json
        assert login_json["status"] == "ok"

        # Confirm that session is authenticated
        me_resp = session.get(me_url, timeout=30)
        assert me_resp.status_code == 200
        me_json = me_resp.json()
        assert "authenticated" in me_json and me_json["authenticated"] is True
        assert "user" in me_json and me_json["user"] == credentials["username"]

        # Logout using the session cookie to destroy the session
        logout_resp = session.post(logout_url, timeout=30)
        assert logout_resp.status_code == 200
        logout_json = logout_resp.json()
        assert "status" in logout_json
        assert logout_json["status"] == "ok"

        # After logout, session should not be authenticated
        me_post_logout_resp = session.get(me_url, timeout=30)
        assert me_post_logout_resp.status_code == 200
        me_post_logout_json = me_post_logout_resp.json()
        assert "authenticated" in me_post_logout_json and me_post_logout_json["authenticated"] is False
        assert "user" in me_post_logout_json and me_post_logout_json["user"] is None

    finally:
        session.close()

test_post_api_logout_php_session_termination()