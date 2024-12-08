<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

// input Validate gareko
$name = $data['name'] ?? '';
$description = $data['description'] ?? '';
$price = $data['price'] ?? 0.0;
$category = $data['category'] ?? '';

if (!empty($name) && !empty($description) && $price > 0 && !empty($category)) {
    // Debugging: Log input data
    error_log("Adding dish: " . print_r($data, true));

    // database ma insert garna query ready gareko
    $stmt = $conn->prepare("INSERT INTO dishes (category, name, description, price) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssd", $category, $name, $description, $price);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Dish added successfully!']);
    } else {
        // SQL log gareko for debgging
        error_log("Database Error: " . $stmt->error);
        echo json_encode(['success' => false, 'message' => 'Failed to add dish.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid input. Please check all fields.']);
}
?>
