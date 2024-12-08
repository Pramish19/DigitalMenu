<?php
include 'db.php';

// input data ligeko
$data = json_decode(file_get_contents('php://input'), true);

// recived data log gareko debugging lai
file_put_contents('php://stderr', "Input Data: " . print_r($data, true) . "\n");

//yedi kunai required keys x ki vanera check gareko
if (!isset($data['table_number']) || !isset($data['status'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Missing table_number or status key.']);
    exit();
}

$tableNumber = $data['table_number'];
$status = $data['status'];

//sql prepare gareko table status update garna lai
$sql = "UPDATE `tables` SET status = ? WHERE table_number = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'SQL preparation failed: ' . $conn->error]);
    exit();
}

$stmt->bind_param('si', $status, $tableNumber);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = "Table $tableNumber status updated to $status.";
} else {
    $response['success'] = false;
    $response['message'] = "Failed to update table status.";
}

header('Content-Type: application/json');
echo json_encode($response);

$stmt->close();
$conn->close();
?>
