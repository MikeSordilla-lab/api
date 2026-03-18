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

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  auth_json_response(400, ["status" => "failed", "message" => "Invalid or empty request data."]);
}

$id = $data['id'] ?? null;

if ($id === null) {
  auth_json_response(400, ["status" => "failed", "message" => "Student ID is required."]);
}

$stmt = $conn->prepare("DELETE FROM student_list WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    auth_json_response(200, ["status" => "ok", "message" => "Student information has been deleted."]);
  } else {
    auth_json_response(200, ["status" => "failed", "message" => "Student not found."]);
  }
} else {
  auth_json_response(200, ["status" => "failed", "message" => "Error deleting student."]);
}
$stmt->close();
$conn->close();
