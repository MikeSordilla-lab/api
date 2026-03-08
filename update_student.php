<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo json_encode(["status" => "failed", "message" => "Invalid or empty request data."]);
  exit;
}

$id = $data['id'] ?? null;
$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s');

$stmt = $conn->prepare(
  "UPDATE student_list SET firstname=?,lastname=?, ratings=?,last_update=? WHERE id=?"
);
$stmt->bind_param("ssisi", $firstname, $lastname, $ratings, $last_update, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok", "message" => "Student's information has been updated."]);
} else {
  echo json_encode(["status" => "failed", "message" => "Error updating student."]);
}
$stmt->close();
$conn->close();
