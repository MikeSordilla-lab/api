<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_session.php';

function auth_send_cors_headers(string $methods, bool $allowCredentials = false): void
{
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

  if ($allowCredentials && $origin !== '*') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
  } else {
    header('Access-Control-Allow-Origin: *');
  }

  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: ' . $methods);
  header('Access-Control-Allow-Headers: Content-Type');
}

function auth_json_response(int $statusCode, array $payload): void
{
  http_response_code($statusCode);
  echo json_encode($payload);
  exit;
}

function auth_unauthorized(string $message = 'Unauthorized. Please log in first.'): void
{
  auth_json_response(401, [
    'status' => 'failed',
    'message' => $message,
  ]);
}

function auth_require_authenticated_session(): void
{
  auth_start_session();

  if (auth_enforce_session_timeout()) {
    auth_unauthorized('Session expired. Please log in again.');
  }

  if (empty($_SESSION['authenticated']) || empty($_SESSION['username'])) {
    auth_unauthorized();
  }
}
