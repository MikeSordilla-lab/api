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

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s');

$stmt = $conn->prepare(
  "INSERT INTO student_list(firstname, lastname,ratings, last_update) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssds", $firstname, $lastname, $ratings, $last_update);

if ($stmt->execute()) {
  auth_json_response(200, ["status" => "ok", "message" => "New student has been created."]);
} else {
  auth_json_response(500, ["status" => "failed", "message" => "Error creating student."]);
}
$stmt->close();
$conn->close();
