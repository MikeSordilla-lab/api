<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_guard.php';

auth_send_cors_headers('GET, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  auth_json_response(405, [
    'status' => 'failed',
    'authenticated' => false,
    'message' => 'Method not allowed.',
  ]);
}

auth_start_session();

if (auth_enforce_session_timeout()) {
  auth_json_response(200, [
    'status' => 'failed',
    'authenticated' => false,
    'message' => 'Session expired. Please log in again.',
  ]);
}

if (!empty($_SESSION['authenticated']) && !empty($_SESSION['username'])) {
  auth_json_response(200, [
    'status' => 'ok',
    'authenticated' => true,
    'user' => (string) $_SESSION['username'],
    'message' => 'Authenticated.',
  ]);
}

auth_json_response(200, [
  'status' => 'failed',
  'authenticated' => false,
  'user' => null,
  'message' => 'Not authenticated.',
]);
