<?php

include_once __DIR__ . '/auth_guard.php';

auth_send_cors_headers('POST, OPTIONS', true);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(["status" => "failed", "message" => "Method not allowed."]);
  exit;
}

auth_start_session();

if (empty($_SESSION['authenticated']) || empty($_SESSION['username'])) {
  auth_json_response(401, [
    'status' => 'failed',
    'message' => 'Authentication required. Please log in first.',
    'authenticated' => false,
  ]);
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if ($id === null) {
  echo json_encode(["status" => "failed", "message" => "Invalid ID."]);
  exit;
}

$stmt = $conn->prepare("DELETE FROM student_list WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "ok", "message" => "Student information has been deleted."]);
  } else {
    echo json_encode(["status" => "failed", "message" => "Student not found."]);
  }
} else {
  echo json_encode(["status" => "failed", "message" => "Error deleting student."]);
}
$stmt->close();
$conn->close();
