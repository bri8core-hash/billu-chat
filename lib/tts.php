<?php
// lib/tts.php - Gnani TTS proxy

function handle_tts() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['success' => false, 'error' => 'POST required'], 405);
    }
    $apiKey = get_gnani_api_key();
    if ($apiKey === '') {
        json_out(['success' => false, 'error' => 'Gnani API key not found in config.yaml'], 500);
    }
    $input = read_json_body();
    $text = isset($input['text']) ? trim((string)$input['text']) : '';
    if ($text === '') {
        json_out(['success' => false, 'error' => 'text is required'], 400);
    }
    $model = isset($input['model']) ? trim((string)$input['model']) : 'timbre-v2.5';
    $voice = isset($input['voice']) ? trim((string)$input['voice']) : 'Kaveri';
    $language = isset($input['language']) ? trim((string)$input['language']) : 'en-IN';
    $speed = isset($input['speed']) ? (float)$input['speed'] : 1.0;
    $audioConfig = [
        'sample_rate' => 48000,
        'num_channels' => 1,
        'sample_width' => 2,
        'encoding' => 'linear_pcm',
        'container' => 'wav',
    ];
    $payload = [
        'text' => $text,
        'voice' => $voice,
        'model' => $model,
        'language' => $language,
        'speed' => $speed,
        'audio_config' => $audioConfig,
    ];

    $ttsUrl = get_config_value('tts_url', 'https://api.vachana.ai/api/v1/tts/inference');

    $ch = curl_init($ttsUrl);
    curl_common_opts($ch);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-API-Key-ID: ' . $apiKey,
        'Accept: */*',
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    $body = curl_exec($ch);
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $ctype = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);

    if ($err !== '') {
        json_out(['success' => false, 'error' => 'TTS request failed: ' . $err], 502);
    }

    $isAudio = ($code >= 200 && $code < 300) && is_string($ctype) && (strpos($ctype, 'audio') !== false || strpos($ctype, 'octet-stream') !== false);
    if ($isAudio) {
        http_response_code($code);
        header('Content-Type: ' . $ctype);
        header('Cache-Control: no-store');
        echo $body;
        exit;
    }

    $decoded = json_decode($body, true);
    if (is_array($decoded)) {
        json_out($decoded, $code > 0 ? $code : 502);
    }
    json_out(['success' => false, 'error' => 'TTS request failed', 'status' => $code, 'raw' => $body], $code > 0 ? $code : 502);
}
