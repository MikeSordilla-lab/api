<?php

include_once __DIR__ . '/auth_guard.php';

auth_send_cors_headers('POST, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  auth_json_response(405, ["status" => "failed", "message" => "Method not allowed."]);
}

auth_require_authenticated_session();

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status" => "failed", "message" => "Invalid or empty request data."]);
  exit;
}

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s');

$stmt = $conn->prepare(
  "INSERT INTO student_list(firstname, lastname,ratings, last_update) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssds", $firstname, $lastname, $ratings, $last_update);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok", "message" => "New student has been created."]);
} else {
  echo json_encode(["status" => "failed", "message" => "Error creating student."]);
}
$stmt->close();
$conn->close();
