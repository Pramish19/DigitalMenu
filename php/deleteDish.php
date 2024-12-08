<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$dishId = $data['id'] ?? 0;

if ($dishId) {
    $stmt = $conn->prepare("DELETE FROM dishes WHERE id = ?");
    $stmt->bind_param("i", $dishId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Dish deleted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete dish.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid dish ID.']);
}
?>


