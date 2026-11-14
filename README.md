# Persona Chat (Gnani AI Speech Demo)

Browser-based speech conversation app built with PHP and JavaScript. It captures microphone audio, transcribes with Gnani STT, sends the conversation to a chat backend, and speaks the reply with Gnani TTS. Includes switchable personas with per-persona AI context, avatars, and voice settings.

Demo: https://bri8.in/talk/

## Features

- Voice conversation: record speech, auto-detect/split by silence, transcribe, get AI reply, and play TTS audio.
- Text fallback: type and send messages without a microphone; sample prompt dropdown auto-sends on selection.
- Personas (selectable in UI):
  - **Billu (Cat Teacher)** — animated SVG cat avatar with lip/eye animation.
  - **Father (Sandeep)** — photo avatar (`assets/images/sandeep.jpeg`).
  - **Mother (Leelavati)** — photo avatar (`assets/images/lilavati.png`).
  - **Teacher**, **Scientist** (`assets/images/scientist.png`), **Engineer** (`assets/images/enineer.png`), **Doctor** (`assets/images/doctor.png`) — role-specific context/voice (photo avatars where provided).
- Per-persona behavior: switching persona updates the system prompt/context, TTS model/voice/language/speed defaults, avatar, and resets conversation history.
- Photo lip-sync: volume-driven mouth overlay animation for image personas during TTS playback.
- Speech/voice controls: STT language/model options, TTS model/voice/language/speed, replay last response, stop conversation.
- Mic diagnostics: device selection, live level meter, 5s record/playback, and diagnostic STT transcription.
- Debug log and conversation transcript panel.

## Requirements

- PHP 7.4+ (or compatible) with cURL enabled.
- Web server (e.g. XAMPP/Apache) to serve the app.
- Browser with microphone access for voice input.
- Gnani/Vachana API key and reachable STT/TTS/chat endpoints.

## Setup

1. Place the project in your web server document root (e.g. `htdocs/yack/gnani-ai-tts`).
2. Create `config.yaml` in the project root (this file is gitignored; do not commit secrets):

```yaml
gnani_api_key: "YOUR_GNANI_API_KEY"
stt_url: "https://api.vachana.ai/stt/v3"
tts_url: "https://api.vachana.ai/api/v1/tts/inference"
chat_url: "https://d1q4vj97qsit9g.cloudfront.net/api/chat-completion-with-history"
```

3. Ensure `cacert.pem` is present in the project root (used for HTTPS cURL requests).
4. Open the app in your browser via the local server, e.g. `http://localhost/yack/gnani-ai-tts/`.

## Project Structure

- `index.php` — entry point and action router (`?action=stt|tts|chat`).
- `lib/bootstrap.php` — config/helpers and JSON/cURL utilities.
- `lib/stt.php`, `lib/tts.php`, `lib/chat.php` — backend handlers/proxies for Gnani STT, TTS, and chat.
- `views/demo.php` — UI markup (persona selector, avatar, controls, panels).
- `assets/js/personas.js` — persona module: persona definitions/data and `window.Personas` API (`get`, `getCurrent`, `getAll`, `apply`) for context, avatar, and TTS defaults.
- `assets/js/app.js` — app logic: recording/STT flow, chat/TTS playback, mic diagnostics, avatar/lip-sync animation, UI wiring.
- `assets/css/demo.css` — styles.
- `assets/images/` — persona photos/assets.

## Customizing Personas

Edit `assets/js/personas.js` to add or adjust personas. Each persona can define:

- `name`, `type` (`cat` or `image`), `description`, `image`
- `context` — system prompt/AI behavior for the persona
- `tts` — `{ model, voice, language, speed }` defaults
- `mouth` (image personas) — overlay placement `{ top, left, width, height }` for lip-sync alignment

Add a matching `<option>` in `views/demo.php` (`#personaSelect`) for new personas. Hard-refresh the browser (Ctrl+F5) after JS/CSS changes.

## Notes

- `config.yaml` contains API keys and is listed in `.gitignore`; keep it local and rotate keys if they were ever committed.
- STT/TTS/chat depend on external services and network access from the PHP server.
- Persona lip-sync on photos is an overlay approximation; tune `mouth` per image in `assets/js/personas.js` for best alignment.
