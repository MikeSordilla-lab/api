<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_config.php';

function auth_start_session(): void
{
  if (session_status() === PHP_SESSION_ACTIVE) {
    return;
  }

  if (session_name() !== AUTH_SESSION_NAME) {
    session_name(AUTH_SESSION_NAME);
  }

  session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'httponly' => true,
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite' => 'Strict',
  ]);

  session_start();
}

function auth_is_session_expired(): bool
{
  if (!isset($_SESSION['last_activity'])) {
    return false;
  }

  return (time() - (int) $_SESSION['last_activity']) > AUTH_SESSION_TIMEOUT_SECONDS;
}

function auth_touch_session(): void
{
  $_SESSION['last_activity'] = time();
}

function auth_enforce_session_timeout(): bool
{
  if (!auth_is_session_expired()) {
    auth_touch_session();
    return false;
  }

  $_SESSION = [];

  if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool) $params['secure'], (bool) $params['httponly']);
  }

  session_destroy();
  return true;
}
