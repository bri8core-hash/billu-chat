<?php
// lib/chat.php - AI chat proxy

function handle_chat() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json_out(['success' => false, 'error' => 'POST required'], 405);
    }
    $input = read_json_body();
    $message = isset($input['message']) ? trim((string)$input['message']) : '';
    if ($message === '') {
        json_out(['success' => false, 'error' => 'message is required'], 400);
    }
    $context = isset($input['context']) ? trim((string)$input['context']) : '';
    $history = isset($input['history']) && is_array($input['history']) ? $input['history'] : [];
    $inputLanguage = isset($input['language']) ? trim((string)$input['language']) : '';

    $transcriptLines = [];
    $maxHistory = 12;
    $start = count($history) > $maxHistory ? count($history) - $maxHistory : 0;
    for ($i = $start; $i < count($history); $i++) {
        $h = $history[$i];
        if (!is_array($h)) continue;
        $role = isset($h['role']) ? $h['role'] : '';
        $content = isset($h['content']) ? trim((string)$h['content']) : '';
        if ($content === '' || ($role !== 'user' && $role !== 'assistant')) continue;
        $label = $role === 'assistant' ? 'Assistant' : 'User';
        $transcriptLines[] = $label . ': ' . $content;
    }

    $composed = '';
    $languageMap = [
        'en-IN' => 'English',
        'en' => 'English',
        'hi-IN' => 'Hindi',
        'hi' => 'Hindi',
        'kn-IN' => 'Kannada',
        'kn' => 'Kannada',
        'ta-IN' => 'Tamil',
        'ta' => 'Tamil',
        'te-IN' => 'Telugu',
        'te' => 'Telugu',
        'ml-IN' => 'Malayalam',
        'ml' => 'Malayalam',
        'mr-IN' => 'Marathi',
        'mr' => 'Marathi',
        'bn-IN' => 'Bengali',
        'bn' => 'Bengali',
        'gu-IN' => 'Gujarati',
        'gu' => 'Gujarati',
        'pa-IN' => 'Punjabi',
        'pa' => 'Punjabi',
    ];
    $answeringLanguage = isset($languageMap[$inputLanguage]) ? $languageMap[$inputLanguage] : 'English';
    if ($context !== '') {
        $composed .= "Context:\n" . $context . "\n\n";
    }
    if (!empty($transcriptLines)) {
        $composed .= "Conversation so far:\n" . implode("\n", $transcriptLines) . "\n\n";
    }
    $composed .= "User: " . $message . "\nAssistant:";

    $payload = [
        'user_messages' => [
            [
                'role' => 'user',
                'content' => $composed
            ]
        ],
        'specific_commands' => $context !== '' ? $context : 'Reply clearly and concisely.',
        'resume' => null,
        'job_description' => null,
        'knowledge' => null,
        'answering_language' => $answeringLanguage,
        'json_format' => false,
        'long_answer' => true,
        'model' => 'groq',
        'recording_session_id' => null,
        'user_email' => 'bri8core@gmail.com'
    ];

    $chatUrl = get_config_value('chat_url', 'https://d1q4vj97qsit9g.cloudfront.net/api/chat-completion-with-history');

    $ch = curl_init($chatUrl);
    curl_common_opts($ch);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        'User-Agent: Mozilla/5.0 (compatible; GnaniDemo/1.0)'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 120);
    $body = curl_exec($ch);
    $err = curl_error($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $ctype = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);

    if ($err !== '') {
        json_out(['success' => false, 'error' => 'Chat request failed: ' . $err], 502);
    }

    $decoded = json_decode($body, true);
    $looksHtml = is_string($body) && preg_match('/^\s*<(!DOCTYPE|html|head|body|script|style)/i', $body);
    $htmlCtype = is_string($ctype) && stripos($ctype, 'text/html') !== false;
    if ($looksHtml || ($htmlCtype && $decoded === null)) {
        $snippet = is_string($body) ? substr(trim($body), 0, 400) : '';
        json_out([
            'success' => false,
            'error' => 'Chat backend returned HTML instead of JSON (likely blocked, parked, or misconfigured on this host). Check chat_url/config and server network access to the chat endpoint.',
            'upstream_status' => $code,
            'upstream_content_type' => $ctype,
            'upstream_snippet' => $snippet
        ], 502);
    }

    $reply = '';
    if (is_array($decoded)) {
        if (isset($decoded['response']) && is_string($decoded['response'])) {
            $reply = $decoded['response'];
        } elseif (isset($decoded['message']) && is_string($decoded['message'])) {
            $reply = $decoded['message'];
        } elseif (isset($decoded['content']) && is_string($decoded['content'])) {
            $reply = $decoded['content'];
        } elseif (isset($decoded['data']) && is_string($decoded['data'])) {
            $reply = $decoded['data'];
        } elseif (isset($decoded['choices'][0]['message']['content']) && is_string($decoded['choices'][0]['message']['content'])) {
            $reply = $decoded['choices'][0]['message']['content'];
        } elseif ($code < 200 || $code >= 300) {
            json_out([
                'success' => false,
                'error' => 'Chat backend error',
                'upstream_status' => $code,
                'upstream' => $decoded
            ], $code > 0 ? $code : 502);
        } else {
            $reply = json_encode($decoded, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }
    } elseif (is_string($decoded)) {
        $reply = $decoded;
    } elseif (is_string($body)) {
        $trimmed = trim($body);
        if ($trimmed !== '' && $trimmed[0] !== '{' && $trimmed[0] !== '[') {
            $reply = $trimmed;
        } else {
            $reply = $body;
        }
    }

    // Normalize JSON-string literal replies like "\"hello\"" or "\"\""
    $replyTrim = trim($reply);
    if ($replyTrim !== '' && strlen($replyTrim) >= 2 && $replyTrim[0] === '"' && substr($replyTrim, -1) === '"') {
        $un = json_decode($replyTrim, true);
        if (is_string($un)) $reply = $un;
    }

    if ($code < 200 || $code >= 300) {
        json_out([
            'success' => false,
            'error' => 'Chat backend request failed',
            'response' => $reply,
            'upstream_status' => $code,
            'upstream' => $decoded !== null ? $decoded : $body
        ], $code > 0 ? $code : 502);
    }

    json_out([
        'success' => true,
        'response' => $reply,
        'upstream_status' => $code,
        'upstream' => $decoded !== null ? $decoded : $body
    ], 200);
}
