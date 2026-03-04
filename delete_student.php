<?php
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;


$stmt = $conn->prepare("DELETE FROM student_list WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok", "message" => "Student information has been deleted."]);
} else {
  echo json_encode(["status" => "failed", "message" => "Error deleting student."]);
}
$stmt->close();
$conn->close();
