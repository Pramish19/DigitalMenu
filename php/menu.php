<?php
include 'db.php';

$category = $_GET['category'] ?? null;
$query = $category ? "SELECT * FROM dishes WHERE category='$category'" : "SELECT * FROM dishes";
$result = $conn->query($query);

$dishes = [];
while ($row = $result->fetch_assoc()) {
    $dishes[] = $row;
}

echo json_encode($dishes);
?>

