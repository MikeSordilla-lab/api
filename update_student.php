<?php

declare(strict_types=1);

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
include 'validation.php';
include 'sanitize.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  auth_json_response(400, ["status" => "failed", "message" => "Invalid or empty request data."]);
}

// Validate input data BEFORE sanitization
$validation_errors = validate_student_data($data);
if (!empty($validation_errors)) {
  auth_json_response(400, [
    "status" => "failed",
    "message" => "Validation failed",
    "errors" => $validation_errors
  ]);
}

// Sanitize input data AFTER validation
$data = sanitize_input($data);

$id = $data['id'] ?? null;

if ($id === null) {
  auth_json_response(400, ["status" => "failed", "message" => "Student ID is required."]);
}

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s');

$stmt = $conn->prepare(
  "UPDATE student_list SET firstname=?,lastname=?, ratings=?,last_update=? WHERE id=?"
);
$stmt->bind_param("ssdsi", $firstname, $lastname, $ratings, $last_update, $id);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    auth_json_response(200, ["status" => "ok", "message" => "Student's information has been updated."]);
  } else {
    auth_json_response(200, ["status" => "failed", "message" => "Student not found."]);
  }
} else {
  auth_json_response(200, ["status" => "failed", "message" => "Error updating student."]);
}
$stmt->close();
$conn->close();
