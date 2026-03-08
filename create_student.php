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

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s');

$stmt = $conn->prepare(
  "INSERT INTO student_list(firstname, lastname,ratings, last_update) VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("ssis", $firstname, $lastname, $ratings, $last_update);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok", "message" => "New student has been created."]);
} else {
  echo json_encode(["status" => "failed", "message" => "Error creating student."]);
}
$stmt->close();
$conn->close();
