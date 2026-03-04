<?php
header("Content-Type: application/json");
include "db.php";

$result = $conn->query("SELECT * FROM student_list");
$students = [];

while ($row = $result->fetch_assoc()) {
  $students[] = $row;
}

echo json_encode($students);

$conn->close();
