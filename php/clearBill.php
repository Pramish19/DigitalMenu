<?php
header('Content-Type: application/json');

$orderFile = 'orders.json'; // Path to orders.json

// Get the incoming data
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['table_number'])) {
    $tableNumber = intval($data['table_number']);

    // Read the existing orders
    if (file_exists($orderFile)) {
        $orders = json_decode(file_get_contents($orderFile), true);

        // Filter out the orders for the specified table
        $updatedOrders = array_filter($orders, function ($order) use ($tableNumber) {
            return $order['table'] !== $tableNumber;
        });

        // Reindex the array to keep it well-formed
        $updatedOrders = array_values($updatedOrders);

        // Write the updated orders back to the file
        if (file_put_contents($orderFile, json_encode($updatedOrders, JSON_PRETTY_PRINT))) {
            echo json_encode(['success' => true, 'message' => "Bill cleared for Table $tableNumber."]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update orders.json.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Orders file not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid table number.']);
}
?>
