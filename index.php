<?php
// gnani-demo.php - Speech conversation demo entry (modular)

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/stt.php';
require_once __DIR__ . '/lib/tts.php';
require_once __DIR__ . '/lib/chat.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
if ($action === 'stt') {
    handle_stt();
}
if ($action === 'tts') {
    handle_tts();
}
if ($action === 'chat') {
    handle_chat();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Persona Chat</title>
    <link rel="stylesheet" href="assets/css/demo.css">
</head>
<body>
<?php require __DIR__ . '/views/demo.php'; ?>
<script src="assets/js/app.js"></script>
</body>
</html>
