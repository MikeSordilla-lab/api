<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "student";
$port = 3307;

$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
  die(json_encode(["status" => "failed", "message" => "Connection failed."]));
}
