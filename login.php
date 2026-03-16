<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_guard.php';
include_once __DIR__ . '/auth_config.php';

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

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);

if (!is_array($body)) {
  $body = $_POST;
}

if (!is_array($body) || $body === []) {
  parse_str($rawInput ?: '', $parsedBody);
  if (is_array($parsedBody)) {
    $body = $parsedBody;
  }
}

if (!is_array($body) || $body === []) {
  auth_json_response(400, [
    'status' => 'failed',
    'message' => 'Invalid or empty request data.',
  ]);
}

$username = trim((string) ($body['username'] ?? ''));
$password = (string) ($body['password'] ?? '');

if ($username === '' || $password === '') {
  auth_json_response(400, [
    'status' => 'failed',
    'message' => 'Username and password are required.',
  ]);
}

if (!auth_is_valid_credentials($username, $password)) {
  auth_json_response(200, [
    'status' => 'failed',
    'message' => 'Invalid username or password.',
  ]);
}

auth_start_session();
session_regenerate_id(true);

$_SESSION['authenticated'] = true;
$_SESSION['username'] = $username;
auth_touch_session();

auth_json_response(200, [
  'status' => 'ok',
  'message' => 'Login successful.',
]);
