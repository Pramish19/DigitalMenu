<?php
include 'db.php';


// input data ligeko 
$data = json_decode(file_get_contents('php://input'), true);
$tableNumber = $data['table'];

$sql = "INSERT INTO tables (table_number, status) VALUES (?, 'available')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $tableNumber);

$response = [];
if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = "Table $tableNumber added successfully.";
} else {
    $response['success'] = false;
    $response['message'] = "Failed to add table.";
}

header('Content-Type: application/json');
echo json_encode($response);

?>

