<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

// yo chai data validate gareko
$name = $data['name'] ?? '';
$description = $data['description'] ?? '';
$price = $data['price'] ?? 0.0;
$category = $data['category'] ?? '';

if ($name && $description && $price && $category) {
    $stmt = $conn->prepare("INSERT INTO dishes (category, name, description, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $category, $name, $description, $price);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Dish added successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add dish.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
}
?>
