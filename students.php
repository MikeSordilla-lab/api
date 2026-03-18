<?php

declare(strict_types=1);

include_once __DIR__ . '/auth_guard.php';

auth_send_cors_headers('GET, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

auth_require_authenticated_session();

include "db.php";

$result = $conn->query("SELECT * FROM student_list");

if (!$result) {
  http_response_code(500);
  echo json_encode(["status" => "failed", "message" => "Query failed."]);
  $conn->close();
  exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
  if (isset($row['id'])) {
    $row['id'] = (int) $row['id'];
  }
  if (isset($row['ratings'])) {
    $row['ratings'] = (float) $row['ratings'];
  }
  $students[] = $row;
}

http_response_code(200);
echo json_encode($students);

$conn->close();
