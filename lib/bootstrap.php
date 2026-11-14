<?php
// lib/bootstrap.php - shared helpers for gnani-demo

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function get_config() {
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $config = [];
    $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'config.yaml';
    if (!is_file($path)) {
        return $config;
    }
    $contents = file_get_contents($path);
    if ($contents === false) {
        return $config;
    }
    if (preg_match_all('/^\s*([A-Za-z0-9_]+)\s*:\s*["\']?([^"\'\r\n]*)["\']?\s*$/mi', $contents, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $m) {
            $config[$m[1]] = trim($m[2]);
        }
    }
    return $config;
}

function get_config_value($key, $default = '') {
    $config = get_config();
    if (isset($config[$key]) && $config[$key] !== '') {
        return $config[$key];
    }
    return $default;
}

function get_gnani_api_key() {
    $key = get_config_value('gnani_api_key', '');
    if ($key !== '') {
        return $key;
    }
    $config = get_config();
    if (isset($config['gnani_api_key'])) {
        return trim((string)$config['gnani_api_key']);
    }
    return '';
}

function read_json_body() {
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function curl_common_opts($ch) {
    $ca = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'cacert.pem';
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
    if (is_file($ca)) {
        curl_setopt($ch, CURLOPT_CAINFO, $ca);
    } else {
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    }
}
