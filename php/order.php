<?php
//error report gareko debugging lai
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

// incoming data Validate gareko
if (!isset($data['table'], $data['order'], $data['total'])) {
    echo json_encode(['success' => false, 'message' => 'Missing order details.']);
    exit();
}

// order data prepare gareko
$table = $data['table'];
$order = $data['order'];
$total = $data['total'];
$timestamp = date('Y-m-d H:i:s'); // yehi ko time janx 

//json file bata existing orders load gareko
$file = 'orders.json';
if (file_exists($file)) {
    $orders = json_decode(file_get_contents($file), true);
    if ($orders === null) {
        error_log("Failed to decode orders.json: " . json_last_error_msg());
        $orders = [];
    }
} else {
    $orders = [];
}

// new id generate gareko order garna lai
$newId = count($orders) + 1;

// new order add gareko array ma
$newOrder = [
    'id' => $newId,
    'table' => $table,
    'order' => $order,
    'total' => $total,
    'timestamp' => $timestamp,
];
$orders[] = $newOrder;

//updated orders lai back to json file ma save gareko
$jsonData = json_encode($orders, JSON_PRETTY_PRINT);
if ($jsonData === false) {
    error_log("JSON encoding error: " . json_last_error_msg());
    echo json_encode(['success' => false, 'message' => 'Failed to encode JSON.']);
    exit();
}

if (file_put_contents($file, $jsonData)) {
    echo json_encode(['success' => true, 'message' => 'Order placed successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save the order.']);
}
?>
