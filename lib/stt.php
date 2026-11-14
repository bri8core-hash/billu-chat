<?php
// lib/stt.php - Gnani STT proxy

function handle_stt() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['success' => false, 'error' => 'POST required'], 405);
    }
    $apiKey = get_gnani_api_key();
    if ($apiKey === '') {
        json_out(['success' => false, 'error' => 'Gnani API key not found in config.yaml'], 500);
    }
    if (!isset($_FILES['audio_file']) || !is_array($_FILES['audio_file'])) {
        json_out(['success' => false, 'error' => 'audio_file is required'], 400);
    }
    $file = $_FILES['audio_file'];
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        json_out(['success' => false, 'error' => 'Invalid uploaded audio file'], 400);
    }
    $language = isset($_POST['language_code']) ? trim((string)$_POST['language_code']) : 'indic-auto';
    if ($language === '') {
        $language = 'indic-auto';
    }
    $model = isset($_POST['model']) ? trim((string)$_POST['model']) : 'prisma-v3.0';
    $format = isset($_POST['format']) ? trim((string)$_POST['format']) : 'transcribe';
    $translateToEnglish = !empty($_POST['translate_to_english']);

    $mime = 'application/octet-stream';
    if (isset($file['type']) && is_string($file['type']) && $file['type'] !== '') {
        $mime = $file['type'];
    }
    $name = isset($file['name']) && is_string($file['name']) && $file['name'] !== '' ? $file['name'] : 'audio.webm';
    $sttUrl = get_config_value('stt_url', 'https://api.vachana.ai/stt/v3');

    $do_stt = function($fmt) use ($file, $mime, $name, $language, $model, $apiKey, $sttUrl) {
        $cfile = new CURLFile($file['tmp_name'], $mime, $name);
        $post = [
            'audio_file' => $cfile,
            'language_code' => $language,
            'model' => $model,
            'format' => $fmt,
        ];
        $ch = curl_init($sttUrl);
        curl_common_opts($ch);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'X-API-Key-ID: ' . $apiKey,
            'Accept: application/json',
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        $body = curl_exec($ch);
        $err = curl_error($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['body' => $body, 'err' => $err, 'code' => $code];
    };

    $res = $do_stt($format);
    if ($res['err'] !== '') {
        json_out(['success' => false, 'error' => 'STT request failed: ' . $res['err']], 502);
    }

    $decoded = json_decode($res['body'], true);
    if (!is_array($decoded)) {
        http_response_code($res['code'] > 0 ? $res['code'] : 502);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => 'Invalid STT response', 'raw' => $res['body']], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($translateToEnglish && $language !== 'en-IN' && $language !== 'en') {
        $tres = $do_stt('verbatim');
        if ($tres['err'] === '') {
            $tdecoded = json_decode($tres['body'], true);
            if (is_array($tdecoded)) {
                $en = '';
                if (isset($tdecoded['transcript']) && is_string($tdecoded['transcript'])) $en = trim($tdecoded['transcript']);
                elseif (isset($tdecoded['text']) && is_string($tdecoded['text'])) $en = trim($tdecoded['text']);
                elseif (isset($tdecoded['translation']) && is_string($tdecoded['translation'])) $en = trim($tdecoded['translation']);
                if ($en !== '') {
                    $decoded['transcript_english'] = $en;
                }
                $decoded['translate_upstream'] = $tdecoded;
            }
        }
    }

    http_response_code($res['code'] > 0 ? $res['code'] : 200);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
