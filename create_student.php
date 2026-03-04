<?php
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s') ?? '';

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
