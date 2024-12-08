<?php
// Load the orders from the JSON file
$ordersFile = 'orders.json';
if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true);

    // Aggregate totals by table
    $aggregatedOrders = [];
    foreach ($orders as $order) {
        $table = $order['table'];
        if (!isset($aggregatedOrders[$table])) {
            $aggregatedOrders[$table] = [
                'table' => $table,
                'orders' => [],
                'total' => 0
            ];
        }
        $aggregatedOrders[$table]['orders'][] = $order['order'];
        $aggregatedOrders[$table]['total'] += $order['total'];
    }

    // Reindex array for JSON encoding
    echo json_encode(array_values($aggregatedOrders));
} else {
    echo json_encode([]);
}
?>
