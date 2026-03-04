<?php
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$firstname = $data['firstname'] ?? '';
$lastname = $data['lastname'] ?? '';
$ratings = $data['ratings'] ?? '';
$last_update = date('Y-m-d H:i:s') ?? '';

$stmt = $conn->prepare(
  "UPDATE student_list SET firstname=?,lastname=?, ratings=?,last_update=? WHERE id=?"
);
$stmt->bind_param("ssisi", $firstname, $lastname, $ratings, $last_update);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok", "message" => "Student's information has been updated.."]);
} else {
  echo json_encode(["status" => "failed", "message" => "Error updating student."]);
}
$stmt->close();
$conn->close();
