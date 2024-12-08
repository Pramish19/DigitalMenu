<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['table'], $data['order'], $data['total'])) {
    echo json_encode(['success' => false, 'message' => 'Missing order details.']);
    exit();
}

$table = $data['table'];
$order = json_encode($data['order']);
$total = $data['total'];

$sql = "INSERT INTO `orders.json` (table_number, order_details, total_amount) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isd", $table, $order, $total);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Order placed successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to place the order.']);
}

$stmt->close();
$conn->close();
?>
