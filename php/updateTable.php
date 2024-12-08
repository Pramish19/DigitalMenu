<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['table'])) {
    echo json_encode(['success' => false, 'message' => 'Table number not provided.']);
    exit();
}

$tableNumber = $data['table'];
$status = 'occupied';

$sql = "UPDATE `tables` SET status = ? WHERE table_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $tableNumber);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => "Table $tableNumber marked as occupied."]);
} else {
    echo json_encode(['success' => false, 'message' => "Failed to update table $tableNumber."]);
}

$stmt->close();
$conn->close();
?>
