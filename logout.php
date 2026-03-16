<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_guard.php';

auth_send_cors_headers('POST, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  auth_json_response(405, [
    'status' => 'failed',
    'message' => 'Method not allowed.',
  ]);
}

auth_start_session();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
  $params = session_get_cookie_params();
  setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool) $params['secure'], (bool) $params['httponly']);
}

session_destroy();

auth_json_response(200, [
  'status' => 'ok',
  'message' => 'Logged out successfully.',
]);
