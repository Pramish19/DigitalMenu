<?php
$host = 'localhost:3308';
$user = 'root';
$password = '';
$dbname = 'hotel_menu';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
