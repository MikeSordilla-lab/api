<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

include "db.php";

$result = $conn->query("SELECT * FROM student_list");

if (!$result) {
  echo json_encode(["status" => "failed", "message" => "Query failed."]);
  $conn->close();
  exit;
}

$students = [];

while ($row = $result->fetch_assoc()) {
  if (isset($row['id'])) {
    $row['id'] = (int) $row['id'];
  }
  if (isset($row['ratings'])) {
    $row['ratings'] = (float) $row['ratings'];
  }
  $students[] = $row;
}

echo json_encode($students);

$conn->close();
