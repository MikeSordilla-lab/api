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

// No authentication required - return default user
auth_json_response(200, [
  'status' => 'ok',
  'authenticated' => true,
  'user' => 'user',
  'message' => 'Authenticated.',
]);
