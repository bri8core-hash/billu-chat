    const statusEl = document.getElementById('status');
    const contextEl = document.getElementById('context');
    const conversationEl = document.getElementById('conversation');
    const debugEl = document.getElementById('debug');
    const recordBtn = document.getElementById('recordBtn');
    const stopConversationBtn = document.getElementById('stopConversationBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sendTextBtn = document.getElementById('sendTextBtn');
    const manualText = document.getElementById('manualText');
    const samplePrompts = document.getElementById('samplePrompts');
    const player = document.getElementById('player');
    const replayBtn = document.getElementById('replayBtn');
    let ttsAudioUrl = null;
    const turnInfo = document.getElementById('turnInfo');
    const sttLanguageEl = document.getElementById('sttLanguage');
    const ttsModelEl = document.getElementById('ttsModel');
    const ttsVoiceEl = document.getElementById('ttsVoice');
    const ttsLanguageEl = document.getElementById('ttsLanguage');
    const ttsSpeedEl = document.getElementById('ttsSpeed');
    const ttsSpeedValueEl = document.getElementById('ttsSpeedValue');
    const personaSelect = document.getElementById('personaSelect');
    const appTitleEl = document.getElementById('appTitle');
    const personaImage = document.getElementById('personaImage');
    const personaPhotoWrap = document.getElementById('personaPhotoWrap');
    const photoMouth = document.getElementById('photoMouth');
    const personaDesc = document.getElementById('personaDesc');
    const catAvatarWrap = document.getElementById('catAvatarWrap');
    const avatarStateLabel = document.getElementById('avatarStateLabel');

    const PERSONAS = {
        billu: {
            name: 'Billu (Cat Teacher)',
            type: 'cat',
            description: 'Friendly cat teacher for kids.',
            context: 'You are Billu, a friendly cat teacher for a 1st standard kid. Explain clearly, kindly, and in very simple words. Keep answers short and age-appropriate.',
            tts: { model: 'timbre-v2.5', voice: 'Kaveri', language: 'en-IN', speed: 0.85 }
        },
        father: {
            name: 'Father (Sandeep)',
            type: 'image',
            image: 'assets/images/sandeep.jpeg',
            mouth: { top: '60%', left: '50%', width: '10%', height: '4%' },
            description: 'Caring, practical, and supportive father figure.',
            context: 'You are Sandeep, a caring and practical father. Speak warmly, encourage confidence, give clear guidance, and keep answers supportive and easy to understand. Offer sensible advice and reassurance when helpful.',
            tts: { model: 'timbre-v3.0', voice: 'Prakash', language: 'hi-IN', speed: 0.95 }
        },
        mother: {
            name: 'Mother (Leelavati)',
            type: 'image',
            image: 'assets/images/lilavati.png',
            mouth: { top: '59%', left: '52%', width: '10%', height: '4%' },
            description: 'Loving, patient, and nurturing mother figure.',
            context: 'You are Leelavati, a loving and patient mother. Speak gently with warmth and care, explain things simply, comfort when needed, and encourage with kindness.',
            tts: { model: 'timbre-v3.0', voice: 'Vasudha', language: 'en-IN', speed: 0.9 }
        },
        teacher: {
            name: 'Teacher',
            type: 'image',
            description: 'Patient teacher who explains concepts step by step.',
            context: 'You are a patient and encouraging indian teacher. Explain concepts step by step in simple language, check understanding, give examples, and keep responses clear and structured.',
            tts: { model: 'timbre-v2.5', voice: 'Nalini', language: 'hi-IN', speed: 0.9 }
        },
        scientist: {
            name: 'Scientist',
            type: 'image',
            image: 'assets/images/scientist.png',
            mouth: { top: '34.3%', left: '68%', width: '9%', height: '2%' },
            description: 'Curious scientist who explains how things work.',
            context: 'You are a curious and friendly female indian scientist. Explain how and why things work using simple reasoning, observations, and examples. Encourage curiosity and keep explanations accurate but easy to understand.',
            tts: { model: 'timbre-v3.0', voice: 'Nalini', language: 'en-IN', speed: 0.95 }
        },
        engineer: {
            name: 'Engineer',
            type: 'image',
            image: 'assets/images/enineer.png',
            mouth: { top: '36%', left: '45%', width: '7%', height: '2%' },
            description: 'Practical engineer focused on building and solving problems.',
            context: 'You are a practical and clear-thinking female indian engineer. Focus on how to build, fix, and solve problems step by step. Give structured, actionable explanations and keep them easy to follow.',
            tts: { model: 'timbre-v3.0', voice: 'Chetana', language: 'en-IN', speed: 1.0 }
        },
        doctor: {
            name: 'Doctor',
            type: 'image',
            image: 'assets/images/doctor.png',
            mouth: { top: '35.2%', left: '49%', width: '9%', height: '2%' },
            description: 'Caring doctor who explains health clearly and calmly.',
            context: 'You are a caring and knowledgeable female doctor. Explain health, wellness, and medical topics clearly, calmly, and simply. Be reassuring, encourage healthy habits, and remind users to consult a qualified healthcare professional for diagnosis, treatment, or urgent concerns.',
            tts: { model: 'timbre-v3.0', voice: 'Chetana', language: 'en-IN', speed: 0.95 }
        }
    };

    let currentPersonaId = 'billu';

    const TTS_VOICES = {
        'timbre-v2.5': [
            { value: 'Kaveri', label: 'Kaveri (en-IN)', lang: 'en-IN' },
            { value: 'Nalini', label: 'Nalini (hi-IN)', lang: 'hi-IN' },
            { value: 'Deepak', label: 'Deepak (hi-IN)', lang: 'hi-IN' },
            { value: 'Aarohi', label: 'Aarohi', lang: 'hi-IN' },
            { value: 'Pranav', label: 'Pranav', lang: 'en-IN' },
            { value: 'Poorvi', label: 'Poorvi (Hinglish)', lang: 'hi-en' }
        ],
        'timbre-v3.0': [
            { value: 'Shivani', label: 'Shivani (multilingual)', lang: 'hi-IN' },
            { value: 'Avinash', label: 'Avinash (multilingual)', lang: 'en-IN' },
            { value: 'Lakshmi', label: 'Lakshmi (multilingual)', lang: 'hi-IN' },
            { value: 'Kalpana', label: 'Kalpana (multilingual)', lang: 'hi-IN' },
            { value: 'Shubham', label: 'Shubham (multilingual)', lang: 'en-IN' },
            { value: 'Prakash', label: 'Prakash (multilingual)', lang: 'en-IN' },
            { value: 'Devansh', label: 'Devansh (multilingual)', lang: 'en-IN' },
            { value: 'Yashraj', label: 'Yashraj (multilingual)', lang: 'en-IN' },
            { value: 'Chetana', label: 'Chetana (multilingual)', lang: 'hi-IN' },
            { value: 'Vasudha', label: 'Vasudha (multilingual)', lang: 'hi-IN' },
            { value: 'Riyaa', label: 'Riyaa (multilingual)', lang: 'en-IN' },
            { value: 'Tarika', label: 'Tarika (multilingual)', lang: 'hi-IN' },
            { value: 'Harshad', label: 'Harshad (multilingual)', lang: 'en-IN' }
        ]
    };

    function syncTtsVoices(preferredVoice) {
        const model = ttsModelEl.value || 'timbre-v2.5';
        const voices = TTS_VOICES[model] || TTS_VOICES['timbre-v2.5'];
        const keep = preferredVoice || ttsVoiceEl.value;
        ttsVoiceEl.innerHTML = '';
        voices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.value;
            opt.textContent = v.label;
            opt.dataset.lang = v.lang || '';
            ttsVoiceEl.appendChild(opt);
        });
        const match = voices.find(v => v.value === keep);
        if (match) {
            ttsVoiceEl.value = match.value;
        } else if (voices.length) {
            ttsVoiceEl.value = voices[0].value;
        }
        const selected = voices.find(v => v.value === ttsVoiceEl.value);
        if (selected && selected.lang && ttsLanguageEl.querySelector('option[value="' + selected.lang + '"]')) {
            ttsLanguageEl.value = selected.lang;
        }
    }

    function applyPersona(id, clearHistory) {
        const p = PERSONAS[id] || PERSONAS.billu;
        currentPersonaId = id in PERSONAS ? id : 'billu';
        if (contextEl) contextEl.value = p.context;
        if (appTitleEl) appTitleEl.textContent = p.name + ' Chat';
        if (personaDesc) personaDesc.textContent = p.description || '';
        if (photoMouth) {
            const m = p.mouth || {};
            photoMouth.style.top = m.top || '72%';
            photoMouth.style.left = m.left || '50%';
            photoMouth.style.width = m.width || '16%';
            photoMouth.style.height = m.height || '4%';
        }
        if (p.type === 'cat') {
            if (catAvatarWrap) catAvatarWrap.style.display = '';
            if (personaPhotoWrap) personaPhotoWrap.style.display = 'none';
            if (personaImage) { personaImage.removeAttribute('src'); personaImage.alt = ''; }
        } else {
            if (catAvatarWrap) catAvatarWrap.style.display = 'none';
            if (personaPhotoWrap) {
                if (p.image) {
                    if (personaImage) { personaImage.src = p.image; personaImage.alt = p.name; }
                    personaPhotoWrap.style.display = '';
                } else {
                    if (personaImage) { personaImage.removeAttribute('src'); personaImage.alt = p.name; }
                    personaPhotoWrap.style.display = 'none';
                }
            }
        }
        if (p.tts) {
            if (ttsModelEl) ttsModelEl.value = p.tts.model || ttsModelEl.value;
            syncTtsVoices(p.tts.voice);
            if (p.tts.language && ttsLanguageEl && ttsLanguageEl.querySelector('option[value="' + p.tts.language + '"]')) {
                ttsLanguageEl.value = p.tts.language;
            }
            if (p.tts.speed && ttsSpeedEl) {
                ttsSpeedEl.value = String(p.tts.speed);
                if (ttsSpeedValueEl) ttsSpeedValueEl.textContent = ttsSpeedEl.value + 'x';
            }
        }
        if (clearHistory) {
            history = [];
            if (conversationEl) conversationEl.value = '';
            if (player) { player.pause(); player.removeAttribute('src'); }
            if (ttsAudioUrl) { URL.revokeObjectURL(ttsAudioUrl); ttsAudioUrl = null; }
            if (replayBtn) { replayBtn.style.display = 'none'; replayBtn.disabled = false; }
        }
        setStatus('Persona set to ' + p.name + '. Ready.');
        log('persona switched to ' + p.name);
        setAvatarState('idle');
    }
    const micSelect = document.getElementById('micSelect');
    const testMicBtn = document.getElementById('testMicBtn');
    const stopTestBtn = document.getElementById('stopTestBtn');
    const micLevelWrap = document.getElementById('micLevelWrap');
    const micLevelFill = document.getElementById('micLevelFill');
    const micLevelText = document.getElementById('micLevelText');
    const micPeakText = document.getElementById('micPeakText');
    const recStartBtn = document.getElementById('recStartBtn');
    const recStopBtn = document.getElementById('recStopBtn');
    const recPlayBtn = document.getElementById('recPlayBtn');
    const recTranscribeBtn = document.getElementById('recTranscribeBtn');
    const recClearBtn = document.getElementById('recClearBtn');
    const recAudio = document.getElementById('recAudio');
    const recCountdown = document.getElementById('recCountdown');
    const recPlaybackWrap = document.getElementById('recPlaybackWrap');
    const recResultMsg = document.getElementById('recResultMsg');
    const recTranscript = document.getElementById('recTranscript');
    const recGainSlider = document.getElementById('recGainSlider');
    const recGainValue = document.getElementById('recGainValue');

    let mediaStream = null;
    let mediaRecorder = null;
    let chunks = [];
    let history = [];
    let busy = false;
    let userLanguage = 'en-IN';
    let autoRestartRecorder = false;
    let speechDetected = false;
    let silenceStartTime = null;
    const SILENCE_THRESHOLD_DB = -45;
    const SPEECH_THRESHOLD_DB = -35;
    const SILENCE_DURATION_MS = 1500;
    const MAX_SENTENCE_DURATION_MS = 10000;
    let sentenceStartTime = null;

    let micLevelContext = null;
    let micLevelRaf = null;
    let micMeterAnalyser = null;
    let recGain = 8;
    let testAmpHandle = null;
    let recAmpHandle = null;
    let micAmpHandle = null;
    let recTestRecorder = null;
    let recTestChunks = [];
    let recTestBlob = null;
    let recTestMime = '';
    let recTestUrl = null;
    let recTestTimer = null;

    function setStatus(msg) { statusEl.textContent = msg; }
    function log(msg) {
        const line = '[' + new Date().toLocaleTimeString() + '] ' + msg;
        debugEl.value += line + '\n';
        debugEl.scrollTop = debugEl.scrollHeight;
        console.log(line);
    }
    function appendConversation(role, text) {
        const p = PERSONAS[currentPersonaId] || PERSONAS.billu;
        const label = role === 'user' ? 'You' : (role === 'assistant' ? p.name : 'System');
        conversationEl.value += label + ': ' + text + '\n\n';
        conversationEl.scrollTop = conversationEl.scrollHeight;
    }
    function updateRecordButton() {
        if (!recordBtn) return;
        const recording = !!mediaRecorder;
        recordBtn.textContent = recording ? '■ Stop' : '▶ Record';
        recordBtn.classList.toggle('green', !recording);
        recordBtn.classList.toggle('red', recording);
        recordBtn.setAttribute('aria-label', recording ? 'Stop recording and send' : 'Start recording');
        recordBtn.title = recording ? 'Stop recording and send to AI' : 'Start recording with microphone';
    }
    function setBusy(v) {
        busy = v;
        recordBtn.disabled = v;
        sendTextBtn.disabled = v;
        clearBtn.disabled = v && !!mediaRecorder;
        turnInfo.textContent = v ? 'Processing…' : '';
        if (!v) updateRecordButton();
    }

    function pickMimeType() {
        const types = ['audio/ogg;codecs=opus', 'audio/ogg', 'audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
        for (let i = 0; i < types.length; i++) {
            if (window.MediaRecorder && MediaRecorder.isTypeSupported(types[i])) return types[i];
        }
        return '';
    }

    async function populateMicDevices(requestPermission = false) {
        try {
            if (requestPermission) {
                const probe = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                probe.getTracks().forEach(track => track.stop());
            }
            const keepValue = micSelect.value;
            const devices = await navigator.mediaDevices.enumerateDevices();
            const inputs = devices.filter(device => device.kind === 'audioinput');
            micSelect.innerHTML = '<option value="default">Default</option>';
            inputs.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || ('Microphone ' + (index + 1) + ' (allow mic to show name)');
                micSelect.appendChild(option);
            });
            if (keepValue && keepValue !== 'default' && Array.from(micSelect.options).some(o => o.value === keepValue)) {
                micSelect.value = keepValue;
            } else {
                const usbOption = Array.from(micSelect.options).find(o => o.value !== 'default' && /usb/i.test(o.text));
                if (usbOption) {
                    micSelect.value = usbOption.value;
                    log('auto-selected microphone: ' + usbOption.text);
                }
            }
            log('microphones: ' + Array.from(micSelect.options).map(o => o.text).join(' | '));
        } catch (e) {
            log('enumerate microphones error: ' + e.message);
        }
    }

    function startMicMeterLoop() {
        cancelAnimationFrame(micLevelRaf);
        const samples = new Float32Array(micMeterAnalyser.fftSize);
        function tick() {
            if (!micMeterAnalyser) return;
            micMeterAnalyser.getFloatTimeDomainData(samples);
            let sum = 0, peak = 0;
            for (let i = 0; i < samples.length; i++) {
                const v = samples[i];
                sum += v * v;
                const a = Math.abs(v);
                if (a > peak) peak = a;
            }
            const rms = Math.sqrt(sum / samples.length);
            const db = 20 * Math.log10(rms + 1e-9);
            const peakDb = 20 * Math.log10(peak + 1e-9);
            const pct = Math.min(100, Math.max(0, ((db + 60) / 60) * 100));
            micLevelFill.style.width = pct + '%';
            micLevelFill.style.background = db < -45 ? '#16a34a' : (db < -20 ? '#f59e0b' : '#dc2626');
            micLevelText.textContent = db.toFixed(1) + ' dB';
            micPeakText.textContent = 'peak: ' + peakDb.toFixed(1) + ' dB';

            if (mediaRecorder && mediaRecorder.state === 'recording') {
                if (db > SPEECH_THRESHOLD_DB) {
                    if (!speechDetected) log('speech detected, db=' + db.toFixed(1));
                    speechDetected = true;
                    silenceStartTime = null;
                    if (sentenceStartTime === null) sentenceStartTime = Date.now();
                } else if (speechDetected) {
                    // Below speech threshold: treat as silence (no dead zone reset)
                    if (silenceStartTime === null) {
                        silenceStartTime = Date.now();
                    } else if (Date.now() - silenceStartTime >= SILENCE_DURATION_MS) {
                        log('silence duration reached, auto-sending sentence');
                        silenceStartTime = null;
                        speechDetected = false;
                        sentenceStartTime = null;
                        sendAccumulatedAudio();
                    }
                }
                // Max sentence duration safety net
                if (sentenceStartTime !== null && Date.now() - sentenceStartTime >= MAX_SENTENCE_DURATION_MS) {
                    log('max sentence duration reached, auto-sending sentence');
                    sentenceStartTime = null;
                    speechDetected = false;
                    silenceStartTime = null;
                    sendAccumulatedAudio();
                }
            }

            micLevelRaf = requestAnimationFrame(tick);
        }
        tick();
    }

    function setupMicLevelMonitor(stream) {
        try {
            micLevelContext = new (window.AudioContext || window.webkitAudioContext)();
            if (micLevelContext.state === 'suspended') micLevelContext.resume().catch(() => {});
            const analyser = micLevelContext.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.85;
            micLevelContext.createMediaStreamSource(stream).connect(analyser);
            micMeterAnalyser = analyser;
            micLevelWrap.style.display = 'flex';
            startMicMeterLoop();
        } catch (e) {
            log('mic level monitor error: ' + e.message);
        }
    }

    function stopMicLevelMonitor() {
        cancelAnimationFrame(micLevelRaf);
        micLevelRaf = null;
        if (micLevelContext) { micLevelContext.close().catch(() => {}); micLevelContext = null; }
        micMeterAnalyser = null;
        micLevelWrap.style.display = 'none';
    }

    function amplifyStream(inputStream, gainFactor) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});
        const source = ctx.createMediaStreamSource(inputStream);
        const gain = ctx.createGain();
        gain.gain.value = Math.max(1, gainFactor || 1);
        const limiter = ctx.createDynamicsCompressor();
        limiter.threshold.value = -3; limiter.knee.value = 6; limiter.ratio.value = 12; limiter.attack.value = 0; limiter.release.value = 0.25;
        const dest = ctx.createMediaStreamDestination();
        source.connect(gain); gain.connect(limiter); limiter.connect(dest);
        return { origin: inputStream, stream: dest.stream, context: ctx };
    }

    function closeAmplifiedStream(handle) {
        if (!handle) return;
        try {
            if (handle.origin) handle.origin.getTracks().forEach(t => t.stop());
            if (handle.context && handle.context.state !== 'closed') handle.context.close().catch(() => {});
        } catch (e) {}
    }

    function getMicConstraints() {
        if (micSelect.value && micSelect.value !== 'default') {
            return { audio: { deviceId: { exact: micSelect.value } }, video: false };
        }
        return { audio: true, video: false };
    }

    async function startRecording() {
        if (busy || mediaRecorder) return;
        try {
            await populateMicDevices(true);
            if (testAmpHandle) { closeAmplifiedStream(testAmpHandle); testAmpHandle = null; }
            stopMicLevelMonitor();
            chunks = [];
            const rawStream = await navigator.mediaDevices.getUserMedia(getMicConstraints());
            micAmpHandle = amplifyStream(rawStream, recGain);
            mediaStream = micAmpHandle.stream;
            setupMicLevelMonitor(mediaStream);
            const mime = pickMimeType();
            const opts = mime ? { mimeType: mime } : undefined;
            mediaRecorder = new MediaRecorder(mediaStream, opts);
            mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data); };
            mediaRecorder.onstop = async () => {
                const blobType = mediaRecorder.mimeType || 'audio/webm';
                const remaining = new Blob(chunks, { type: blobType });
                chunks = [];
                updateRecordButton();
                testMicBtn.disabled = false;
                speechDetected = false;
                silenceStartTime = null;
                sentenceStartTime = null;
                if (remaining.size > 0) {
                    log('processing recorded audio ' + (remaining.size / 1024).toFixed(1) + ' KB');
                    await handleAudioBlob(remaining, blobType);
                }
                if (autoRestartRecorder && mediaRecorder && mediaRecorder.state === 'inactive') {
                    autoRestartRecorder = false;
                    try {
                        mediaRecorder.start(1000);
                        log('recording auto-restarted after sentence processing');
                    } catch (e) {
                        log('recording auto-restart failed: ' + e.message);
                        mediaRecorder = null;
                        cleanupStream();
                        updateRecordButton();
                    }
                } else {
                    mediaRecorder = null;
                    cleanupStream();
                    updateRecordButton();
                }
            };
            mediaRecorder.start(1000);
            speechDetected = false;
            silenceStartTime = null;
            updateRecordButton();
            testMicBtn.disabled = true;
            if (stopConversationBtn) { stopConversationBtn.style.display = ''; stopConversationBtn.disabled = false; }
            setStatus('Recording… speak now; silence auto-sends each sentence. Click ■ Stop to end recording.');
            log('recording started' + (mime ? ' (' + mime + ')' : '') + ', device=' + (micSelect.options[micSelect.selectedIndex] ? micSelect.options[micSelect.selectedIndex].text : micSelect.value));
        } catch (e) {
            log('mic error: ' + e.name + ': ' + e.message);
            setStatus('Microphone error: ' + e.message + ' (check permission/device)');
            cleanupStream();
            mediaRecorder = null;
            updateRecordButton();
            recordBtn.disabled = false;
            testMicBtn.disabled = false;
            if (stopConversationBtn) { stopConversationBtn.style.display = 'none'; stopConversationBtn.disabled = true; }
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            setStatus('Processing recorded audio…');
            setBusy(true);
            mediaRecorder.stop();
        }
        speechDetected = false;
        silenceStartTime = null;
        sentenceStartTime = null;
        if (stopConversationBtn) { stopConversationBtn.style.display = 'none'; stopConversationBtn.disabled = true; }
    }

    async function sendAccumulatedAudio() {
        log('sendAccumulatedAudio: called, busy=' + busy + ', mediaRecorder.state=' + (mediaRecorder ? mediaRecorder.state : 'null'));
        if (busy) {
            log('busy processing, skipping silence auto-send');
            return;
        }
        if (!mediaRecorder || mediaRecorder.state !== 'recording') {
            log('sendAccumulatedAudio: not recording, skipping');
            return;
        }
        log('silence auto-send: stopping recorder to process sentence');
        autoRestartRecorder = true;
        mediaRecorder.stop();
    }

    function stopConversation() {
        log('stop conversation requested');
        if (player) {
            player.pause();
            player.removeAttribute('src');
            if (ttsAudioUrl) { URL.revokeObjectURL(ttsAudioUrl); ttsAudioUrl = null; }
        }
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        cleanupStream();
        stopMouthLoop();
        setAvatarState('idle');
        busy = false;
        setBusy(false);
        updateRecordButton();
        if (stopConversationBtn) { stopConversationBtn.style.display = 'none'; stopConversationBtn.disabled = true; }
        if (replayBtn) { replayBtn.style.display = 'none'; replayBtn.disabled = false; }
        setStatus('Conversation stopped.');
    }

    function cleanupStream() {
        stopMicLevelMonitor();
        if (micAmpHandle) { closeAmplifiedStream(micAmpHandle); micAmpHandle = null; }
        if (mediaStream && !micAmpHandle) { mediaStream.getTracks().forEach(t => t.stop()); }
        mediaStream = null;
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    }
    function audioBufferToWavBlob(audioBuffer) {
        const numChannels = 1;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length;
        const bytesPerSample = 2;
        const blockAlign = numChannels * bytesPerSample;
        const buffer = new ArrayBuffer(44 + length * blockAlign);
        const view = new DataView(buffer);
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length * blockAlign, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, length * blockAlign, true);
        const channelData = [];
        for (let c = 0; c < audioBuffer.numberOfChannels; c++) channelData.push(audioBuffer.getChannelData(c));
        let offset = 44;
        for (let i = 0; i < length; i++) {
            let sample = 0;
            for (let c = 0; c < channelData.length; c++) sample += channelData[c][i];
            sample = sample / channelData.length;
            sample = Math.max(-1, Math.min(1, sample));
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
            offset += 2;
        }
        return new Blob([buffer], { type: 'audio/wav' });
    }
    async function toSttWavBlob(blob) {
        const type = (blob && blob.type ? blob.type.toLowerCase() : '');
        if (type.indexOf('wav') !== -1) return { blob: blob, name: 'audio.wav', converted: false };
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) throw new Error('AudioContext not supported for WAV conversion');
        const ctx = new AudioCtx();
        try {
            const arrayBuf = await blob.arrayBuffer();
            const audioBuffer = await new Promise((resolve, reject) => {
                const p = ctx.decodeAudioData(arrayBuf, resolve, reject);
                if (p && typeof p.then === 'function') p.then(resolve).catch(reject);
            });
            const wav = audioBufferToWavBlob(audioBuffer);
            log('converted recording to WAV for STT: ' + (blob.size/1024).toFixed(1) + 'KB -> ' + (wav.size/1024).toFixed(1) + 'KB');
            return { blob: wav, name: 'audio.wav', converted: true };
        } finally {
            ctx.close().catch(() => {});
        }
    }

    async function handleAudioBlob(blob, mimeType) {
        try {
            setBusy(true);
            setStatus('Preparing audio for Gnani STT…');
            let uploadBlob = blob;
            let uploadName = 'speech.webm';
            try {
                const conv = await toSttWavBlob(blob);
                uploadBlob = conv.blob; uploadName = conv.name;
            } catch (ce) {
                log('WAV conversion failed, uploading original: ' + ce.message);
                const ext = (mimeType && mimeType.indexOf('ogg') !== -1) ? 'ogg' : ((mimeType && mimeType.indexOf('mp4') !== -1) ? 'm4a' : ((mimeType && mimeType.indexOf('wav') !== -1) ? 'wav' : 'webm'));
                uploadName = 'speech.' + ext;
            }
            setStatus('Transcribing with Gnani…');
            const fd = new FormData();
            fd.append('audio_file', uploadBlob, uploadName);
            fd.append('language_code', sttLanguageEl.value || 'indic-auto');
            fd.append('model', 'prisma-v3.0');
            fd.append('format', 'transcribe');
            fd.append('translate_to_english', '1');
            const sttRes = await fetch('index.php?action=stt', { method: 'POST', body: fd });
            const sttText = await sttRes.text();
            let sttJson;
            try { sttJson = JSON.parse(sttText); } catch (e) { sttJson = { success: false, error: 'Invalid STT JSON', raw: sttText }; }
            log('STT: ' + sttText.slice(0, 500));
            if (!sttRes.ok || sttJson.success === false) {
                const errMsg = sttJson && (sttJson.error || sttJson.message || (sttJson.detail && JSON.stringify(sttJson.detail)) || JSON.stringify(sttJson)) || ('HTTP ' + sttRes.status);
                setStatus('STT error: ' + errMsg);
                setAvatarState('idle');
                return;
            }
            const transcript = (sttJson.transcript || '').trim();
            const chatTranscript = (sttJson.transcript_english || transcript || '').trim();
            userLanguage = sttLanguageEl.value || 'en-IN';
            if (!transcript) {
                setStatus('No speech detected. Try again.');
                setAvatarState('idle');
                return;
            }
            appendConversation('user', transcript);
            if (chatTranscript !== transcript) {
                log('STT English for chat: ' + chatTranscript.slice(0, 200));
            }
            await runChatAndSpeak(chatTranscript);
        } catch (e) {
            log('STT flow error: ' + e.message);
            setStatus('Error: ' + e.message);
        } finally {
            if (!player || player.paused || player.ended) setBusy(false);
        }
    }

    async function runChatAndSpeak(userText) {
        try {
            setStatus('Getting AI response…');
            const payload = {
                message: userText,
                context: contextEl.value || '',
                history: history.slice(-12),
                language: userLanguage
            };
            const chatRes = await fetch('index.php?action=chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const chatTextRaw = await chatRes.text();
            let chatJson;
            try { chatJson = JSON.parse(chatTextRaw); } catch (e) { chatJson = { success: false, error: 'Invalid chat JSON', raw: chatTextRaw }; }
            log('CHAT: ' + chatTextRaw.slice(0, 500));
            if (!chatRes.ok || chatJson.success === false) {
                const errMsg = chatJson && (chatJson.error || chatJson.message) || ('HTTP ' + chatRes.status);
                setStatus('Chat error: ' + errMsg);
                setBusy(false);
                return;
            }
            const reply = (chatJson.response || '').toString().trim();
            if (!reply) {
                log('Chat returned empty response. raw=' + chatTextRaw.slice(0, 300));
                appendConversation('assistant', '[No response from AI]');
                setStatus('AI returned an empty response (check chat backend/context).');
                setBusy(false);
                return;
            }
            history.push({ role: 'user', content: userText });
            history.push({ role: 'assistant', content: reply });
            appendConversation('assistant', reply);
            await speakText(reply);
        } catch (e) {
            log('chat error: ' + e.message);
            setStatus('Chat error: ' + e.message);
            setBusy(false);
        }
    }

    async function speakText(text) {
        try {
            const speakTextTrim = (text || '').toString().trim();
            if (!speakTextTrim) {
                setStatus('AI returned empty response; nothing to speak.');
                setBusy(false);
                return;
            }
            setStatus('Generating speech with Gnani TTSâ€¦');
            const model = ttsModelEl.value || 'timbre-v2.5';
            const voices = TTS_VOICES[model] || [];
            let voice = ttsVoiceEl.value || (voices[0] ? voices[0].value : 'Kaveri');
            if (voices.length && !voices.some(v => v.value === voice)) {
                voice = voices[0].value;
                ttsVoiceEl.value = voice;
                log('adjusted TTS voice to ' + voice + ' for model ' + model);
            }
            const langSel = (ttsLanguageEl && ttsLanguageEl.value) ? ttsLanguageEl.value : '';
            const ttsLang = (langSel && langSel !== 'auto') ? langSel : userLanguage;
            const ttsPayload = {
                text: speakTextTrim,
                model: model,
                voice: voice,
                language: ttsLang,
                speed: parseFloat(ttsSpeedEl.value)
            };
            const res = await fetch('index.php?action=tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ttsPayload)
            });
            const ctype = res.headers.get('Content-Type') || '';
            if (!res.ok || ctype.indexOf('audio') === -1) {
                const errText = await res.text();
                log('TTS error: ' + errText.slice(0, 500));
                let msg = 'HTTP ' + res.status;
                try { const j = JSON.parse(errText); msg = j.error || j.message || msg; } catch (e) {}
                setStatus('TTS error: ' + msg + ' (showing text reply only)');
                setBusy(false);
                return;
            }
            const buf = await res.arrayBuffer();
            const blob = new Blob([buf], { type: ctype.split(';')[0] || 'audio/wav' });
            if (ttsAudioUrl) { URL.revokeObjectURL(ttsAudioUrl); ttsAudioUrl = null; }
            ttsAudioUrl = URL.createObjectURL(blob);
            player.src = ttsAudioUrl;
            if (replayBtn) { replayBtn.style.display = ''; replayBtn.disabled = false; }
            setStatus('Speaking… (click ▶ for next reply when ready)');
            setBusy(true);
            recordBtn.disabled = true;
            if (replayBtn) replayBtn.disabled = true;
            player.onended = () => {
                setStatus('Ready. Click ▶ to start speaking, click ■ to stop and send, or ↻ to replay.');
                if (replayBtn) replayBtn.disabled = false;
                setBusy(false);
            };
            player.onerror = () => {
                setStatus('Audio playback failed. You can read the response above or click ↻ to retry.');
                if (replayBtn) replayBtn.disabled = false;
                setBusy(false);
            };
            await player.play().catch((e) => {
                log('playback blocked: ' + e.message);
                setStatus('Playback blocked by browser; click ↻ to play the response.');
                if (replayBtn) replayBtn.disabled = false;
                setBusy(false);
            });
        } catch (e) {
            log('tts error: ' + e.message);
            setStatus('TTS error: ' + e.message);
            setBusy(false);
        }
    }

    async function testMicListening() {
        try {
            if (mediaRecorder) { log('stop recording before mic test'); return; }
            await populateMicDevices(true);
            if (testAmpHandle) { closeAmplifiedStream(testAmpHandle); testAmpHandle = null; }
            stopMicLevelMonitor();
            const raw = await navigator.mediaDevices.getUserMedia(getMicConstraints());
            testAmpHandle = amplifyStream(raw, recGain);
            const track = raw.getAudioTracks()[0];
            if (track) log('test mic settings: ' + JSON.stringify(track.getSettings()));
            setupMicLevelMonitor(testAmpHandle.stream);
            testMicBtn.disabled = true; stopTestBtn.disabled = false;
            setStatus('Testing microphone - speak now and watch the meter.');
        } catch (e) {
            log('mic test error: ' + e.message);
            setStatus('Mic test error: ' + e.message);
        }
    }
    function stopMicTest() {
        if (testAmpHandle) { closeAmplifiedStream(testAmpHandle); testAmpHandle = null; }
        stopMicLevelMonitor();
        testMicBtn.disabled = false; stopTestBtn.disabled = true;
        setStatus(mediaRecorder ? 'Recording…' : 'Ready.');
    }

    async function startRecordReplay() {
        if (mediaRecorder) { setStatus('Stop main recording before 5s test.'); return; }
        if (testAmpHandle) { closeAmplifiedStream(testAmpHandle); testAmpHandle = null; stopMicLevelMonitor(); }
        recTestChunks = [];
        recTestBlob = null; recTestMime = '';
        recStartBtn.disabled = true; recStopBtn.disabled = false; recTranscribeBtn.disabled = true;
        recPlaybackWrap.style.display = 'none'; recResultMsg.textContent = ''; recTranscript.value = ''; recCountdown.textContent = '5s';
        setStatus('Recording 5 seconds - speak now…');
        try {
            await populateMicDevices(true);
            const raw = await navigator.mediaDevices.getUserMedia(getMicConstraints());
            recAmpHandle = amplifyStream(raw, recGain);
            setupMicLevelMonitor(recAmpHandle.stream);
            const mime = pickMimeType() || 'audio/webm';
            recTestRecorder = new MediaRecorder(recAmpHandle.stream, MediaRecorder.isTypeSupported(mime) ? { mimeType: mime } : undefined);
            recTestRecorder.ondataavailable = (e) => { if (e.data.size > 0) recTestChunks.push(e.data); };
            recTestRecorder.onstop = finishRecordReplay;
            recTestRecorder.start(250);
            const deadline = Date.now() + 5000;
            recTestTimer = setInterval(() => {
                const r = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
                if (r <= 0) stopRecordReplay(); else recCountdown.textContent = r + 's';
            }, 250);
            log('record/replay test started');
        } catch (e) {
            log('record/replay error: ' + e.message);
            setStatus('Record test error: ' + e.message);
            recStartBtn.disabled = false; recStopBtn.disabled = true; recCountdown.textContent = '';
            stopMicLevelMonitor();
            if (recAmpHandle) { closeAmplifiedStream(recAmpHandle); recAmpHandle = null; }
        }
    }
    function stopRecordReplay() {
        if (recTestRecorder && recTestRecorder.state !== 'inactive') recTestRecorder.stop();
    }
    function finishRecordReplay() {
        if (recTestTimer) { clearInterval(recTestTimer); recTestTimer = null; }
        recStartBtn.disabled = false; recStopBtn.disabled = true; recCountdown.textContent = '';
        stopMicLevelMonitor();
        recTestMime = recTestRecorder && recTestRecorder.mimeType ? recTestRecorder.mimeType : 'audio/webm';
        recTestBlob = new Blob(recTestChunks, { type: recTestMime });
        if (recTestUrl) URL.revokeObjectURL(recTestUrl);
        recTestUrl = URL.createObjectURL(recTestBlob);
        recAudio.src = recTestUrl; recPlaybackWrap.style.display = 'block';
        recResultMsg.textContent = 'Clip ready (' + (recTestBlob.size/1024).toFixed(1) + ' KB) - press Play or Transcribe Clip.';
        recTranscript.value = '';
        recTranscribeBtn.disabled = recTestBlob.size === 0;
        if (recAmpHandle) { closeAmplifiedStream(recAmpHandle); recAmpHandle = null; }
        recTestRecorder = null; recTestChunks = [];
        setStatus('Recording done. Play or transcribe the clip to verify the mic.');
        log('record/replay clip ready');
    }
    async function transcribeRecordReplay() {
        if (!recTestBlob || recTestBlob.size === 0) { setStatus('No diagnostic clip to transcribe. Record 5s first.'); return; }
        recTranscribeBtn.disabled = true; recStartBtn.disabled = true;
        recResultMsg.textContent = 'Preparing clip for STT…'; recTranscript.value = '';
        setStatus('Transcribing diagnostic clip with Gnani…');
        try {
            let uploadBlob = recTestBlob;
            let uploadName = 'diagnostic.webm';
            try {
                const conv = await toSttWavBlob(recTestBlob);
                uploadBlob = conv.blob; uploadName = conv.name.replace('audio', 'diagnostic');
            } catch (ce) {
                log('Diagnostic WAV conversion failed, uploading original: ' + ce.message);
                const mimeType = recTestMime || recTestBlob.type || 'audio/webm';
                const ext = (mimeType && mimeType.indexOf('ogg') !== -1) ? 'ogg' : ((mimeType && mimeType.indexOf('mp4') !== -1) ? 'm4a' : ((mimeType && mimeType.indexOf('wav') !== -1) ? 'wav' : 'webm'));
                uploadName = 'diagnostic.' + ext;
            }
            recResultMsg.textContent = 'Transcribing clip with Gnani…';
            const fd = new FormData();
            fd.append('audio_file', uploadBlob, uploadName);
            fd.append('language_code', sttLanguageEl.value || 'indic-auto');
            fd.append('model', 'prisma-v3.0');
            fd.append('format', 'transcribe');
            const sttRes = await fetch('index.php?action=stt', { method: 'POST', body: fd });
            const sttText = await sttRes.text();
            let sttJson;
            try { sttJson = JSON.parse(sttText); } catch (e) { sttJson = { success: false, error: 'Invalid STT JSON', raw: sttText }; }
            log('DIAG STT: ' + sttText.slice(0, 500));
            if (!sttRes.ok || sttJson.success === false) {
                const errMsg = sttJson && (sttJson.error || sttJson.message || (sttJson.detail && JSON.stringify(sttJson.detail))) || ('HTTP ' + sttRes.status);
                recResultMsg.textContent = 'STT error: ' + errMsg;
                setStatus('Diagnostic STT error: ' + errMsg);
            } else {
                const transcript = (sttJson.transcript || '').trim();
                if (transcript) {
                    recTranscript.value = transcript;
                    recResultMsg.textContent = 'Transcript received (' + transcript.length + ' chars).';
                    setStatus('Diagnostic clip transcribed successfully.');
                } else {
                    recTranscript.value = '';
                    recResultMsg.textContent = 'No speech detected in clip (empty transcript).';
                    setStatus('Diagnostic clip: no speech detected. Speak louder/closer or adjust mic/boost.');
                }
            }
        } catch (e) {
            log('diagnostic transcribe error: ' + e.message);
            recResultMsg.textContent = 'Transcribe error: ' + e.message;
            setStatus('Diagnostic transcribe error: ' + e.message);
        } finally {
            recTranscribeBtn.disabled = !(recTestBlob && recTestBlob.size > 0);
            recStartBtn.disabled = false;
        }
    }
    function clearRecordReplay() {
        if (recTestRecorder && recTestRecorder.state !== 'inactive') { recTestRecorder.onstop = null; recTestRecorder.stop(); }
        if (recTestTimer) { clearInterval(recTestTimer); recTestTimer = null; }
        if (recAmpHandle) { closeAmplifiedStream(recAmpHandle); recAmpHandle = null; }
        recTestRecorder = null; recTestChunks = []; recTestBlob = null; recTestMime = '';
        if (recTestUrl) { URL.revokeObjectURL(recTestUrl); recTestUrl = null; }
        recAudio.src = ''; recPlaybackWrap.style.display = 'none';
        recStartBtn.disabled = false; recStopBtn.disabled = true; recTranscribeBtn.disabled = true; recCountdown.textContent = ''; recResultMsg.textContent = ''; recTranscript.value = '';
    }

    recordBtn.addEventListener('click', () => { if (mediaRecorder) stopRecording(); else startRecording(); });
    if (stopConversationBtn) {
        stopConversationBtn.addEventListener('click', stopConversation);
    }
    testMicBtn.addEventListener('click', testMicListening);
    stopTestBtn.addEventListener('click', stopMicTest);
    recStartBtn.addEventListener('click', startRecordReplay);
    recStopBtn.addEventListener('click', stopRecordReplay);
    recPlayBtn.addEventListener('click', () => { if (recAudio.src) recAudio.play().catch(e => log('playback error: ' + e.message)); });
    recTranscribeBtn.addEventListener('click', transcribeRecordReplay);
    recClearBtn.addEventListener('click', clearRecordReplay);
    recGainSlider.addEventListener('input', () => { recGain = parseFloat(recGainSlider.value); recGainValue.textContent = recGain + 'x'; log('input boost set to ' + recGain + 'x'); });
    micSelect.addEventListener('change', () => { log('selected microphone: ' + (micSelect.options[micSelect.selectedIndex] ? micSelect.options[micSelect.selectedIndex].text : micSelect.value)); });
    ttsModelEl.addEventListener('change', () => { syncTtsVoices(); log('TTS model set to ' + ttsModelEl.value); });
    ttsVoiceEl.addEventListener('change', () => {
        const model = ttsModelEl.value || 'timbre-v2.5';
        const v = (TTS_VOICES[model] || []).find(x => x.value === ttsVoiceEl.value);
        if (v && v.lang && ttsLanguageEl.querySelector('option[value="' + v.lang + '"]')) ttsLanguageEl.value = v.lang;
    });
    ttsSpeedEl.addEventListener('input', () => { ttsSpeedValueEl.textContent = ttsSpeedEl.value + 'x'; });
    clearBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') return;
        history = [];
        conversationEl.value = '';
        player.pause();
        player.removeAttribute('src');
        if (ttsAudioUrl) { URL.revokeObjectURL(ttsAudioUrl); ttsAudioUrl = null; }
        if (replayBtn) { replayBtn.style.display = 'none'; replayBtn.disabled = false; }
        setStatus('Conversation cleared. Ready.');
        log('conversation cleared');
    });
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            if (!player.src) return;
            try { player.currentTime = 0; } catch (e) {}
            player.play().catch(e => { log('replay error: ' + e.message); setStatus('Replay failed: ' + e.message); });
        });
    }
    sendTextBtn.addEventListener('click', async () => {
        const t = (manualText.value || '').trim();
        if (!t || busy) return;
        manualText.value = '';
        appendConversation('user', t);
        setBusy(true);
        await runChatAndSpeak(t);
        if (player.paused) setBusy(false);
    });
    if (samplePrompts) {
        samplePrompts.addEventListener('change', () => {
            if (samplePrompts.value) {
                manualText.value = samplePrompts.value;
                sendTextBtn.click();
                samplePrompts.value = '';
            }
        });
    }
    manualText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendTextBtn.click(); }
    });

    // ===== Cat avatar (simple 2D SVG, volume-driven lip sync + procedural eyes) =====
    const catAvatar = document.getElementById('catAvatar');
    const catMouth = document.getElementById('cat-mouth');
    const catPupilLeft = document.getElementById('cat-pupil-left');
    const catPupilRight = document.getElementById('cat-pupil-right');
    const catEyelidLeft = document.getElementById('cat-eyelid-left');
    const catEyelidRight = document.getElementById('cat-eyelid-right');
    let avatarState = 'idle';
    let avatarAudioCtx = null;
    let avatarAnalyser = null;
    let avatarSource = null;
    let avatarData = null;
    let avatarMouthRaf = null;
    let avatarMouthLevel = 0;
    let avatarBlinkTimer = null;
    let avatarPupilTimer = null;

    function setAvatarState(state) {
        avatarState = state;
        const p = PERSONAS[currentPersonaId] || PERSONAS.billu;
        const speakingCat = (p.type === 'cat' && state === 'speaking');
        if (catAvatar) catAvatar.setAttribute('data-avatar-state', speakingCat ? 'speaking' : (state === 'listening' && p.type === 'cat' ? 'listening' : 'idle'));
        if (personaPhotoWrap && p.type === 'image') {
            personaPhotoWrap.classList.toggle('speaking', state === 'speaking');
        } else if (personaPhotoWrap) {
            personaPhotoWrap.classList.remove('speaking');
        }
        if (avatarStateLabel) {
            const labels = { idle: 'Idle', listening: 'Listening…', thinking: 'Thinking…', speaking: 'Speaking…' };
            avatarStateLabel.textContent = labels[state] || 'Idle';
        }
    }

    function setMouthOpen(level) {
        const clamped = Math.max(0, Math.min(1, level || 0));
        const p = PERSONAS[currentPersonaId] || PERSONAS.billu;
        if (p.type === 'cat') {
            if (catMouth) {
                const sy = 0.18 + clamped * 3.2;
                catMouth.setAttribute('transform', 'scale(1 ' + sy.toFixed(3) + ')');
            }
            if (photoMouth) photoMouth.style.transform = 'translate(-50%, -50%) scaleY(0.2)';
        } else {
            if (photoMouth) {
                const sy = 0.2 + clamped * 1.6;
                const sx = 1 + clamped * 0.08;
                photoMouth.style.transform = 'translate(-50%, -50%) scaleX(' + sx.toFixed(3) + ') scaleY(' + sy.toFixed(3) + ')';
            }
            if (catMouth) catMouth.setAttribute('transform', 'scale(1 0.18)');
        }
    }

    function ensureAvatarAudioGraph() {
        if (!player) return false;
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        try {
            if (!avatarAudioCtx) avatarAudioCtx = new AC();
            if (!avatarAnalyser) {
                avatarAnalyser = avatarAudioCtx.createAnalyser();
                avatarAnalyser.fftSize = 256;
                avatarAnalyser.smoothingTimeConstant = 0.5;
                avatarData = new Uint8Array(avatarAnalyser.fftSize);
            }
            if (!avatarSource) {
                avatarSource = avatarAudioCtx.createMediaElementSource(player);
                avatarSource.connect(avatarAnalyser);
                avatarAnalyser.connect(avatarAudioCtx.destination);
            }
            if (avatarAudioCtx.state === 'suspended') avatarAudioCtx.resume().catch(() => {});
            return true;
        } catch (e) {
            log('avatar audio graph error: ' + e.message);
            return false;
        }
    }

    function stopMouthLoop() {
        if (avatarMouthRaf) { cancelAnimationFrame(avatarMouthRaf); avatarMouthRaf = null; }
        avatarMouthLevel = 0;
        setMouthOpen(0);
    }

    function startMouthLoop() {
        if (avatarMouthRaf) return;
        if (!ensureAvatarAudioGraph() || !avatarAnalyser || !avatarData) return;
        const tick = () => {
            if (!avatarAnalyser || !avatarData) { avatarMouthRaf = null; return; }
            const playing = player && !player.paused && !player.ended;
            if (!playing) {
                avatarMouthLevel += (0 - avatarMouthLevel) * 0.25;
                setMouthOpen(avatarMouthLevel);
                if (avatarMouthLevel < 0.02) { stopMouthLoop(); return; }
                avatarMouthRaf = requestAnimationFrame(tick);
                return;
            }
            avatarAnalyser.getByteTimeDomainData(avatarData);
            let sum = 0;
            for (let i = 0; i < avatarData.length; i++) {
                const v = (avatarData[i] - 128) / 128;
                sum += v * v;
            }
            const rms = Math.sqrt(sum / avatarData.length);
            let target = (rms - 0.015) / 0.18;
            target = Math.max(0, Math.min(1, target));
            const k = target > avatarMouthLevel ? 0.45 : 0.22;
            avatarMouthLevel += (target - avatarMouthLevel) * k;
            setMouthOpen(avatarMouthLevel);
            avatarMouthRaf = requestAnimationFrame(tick);
        };
        avatarMouthRaf = requestAnimationFrame(tick);
    }

    function blinkOnce() {
        [catEyelidLeft, catEyelidRight].forEach(el => {
            if (!el) return;
            el.classList.add('blink');
        });
        setTimeout(() => {
            [catEyelidLeft, catEyelidRight].forEach(el => {
                if (!el) return;
                el.classList.remove('blink');
            });
        }, 320);
    }

    function scheduleBlink() {
        if (avatarBlinkTimer) clearTimeout(avatarBlinkTimer);
        const delay = 2200 + Math.random() * 3500;
        avatarBlinkTimer = setTimeout(() => {
            blinkOnce();
            if (Math.random() < 0.12) setTimeout(blinkOnce, 520);
            scheduleBlink();
        }, delay);
    }

    function movePupils() {
        const speaking = avatarState === 'speaking';
        const max = speaking ? 1.2 : 0.8;
        const dx = (Math.random() * 2 - 1) * max;
        const dy = (Math.random() * 2 - 1) * max * 0.6;
        const t = 'translate(' + dx.toFixed(2) + ' ' + dy.toFixed(2) + ')';
        if (catPupilLeft) catPupilLeft.setAttribute('transform', t);
        if (catPupilRight) catPupilRight.setAttribute('transform', t);
        if (avatarPupilTimer) clearTimeout(avatarPupilTimer);
        avatarPupilTimer = setTimeout(movePupils, speaking ? 900 + Math.random() * 900 : 1400 + Math.random() * 2000);
    }

    function startEyeAnimation() {
        if (catEyelidLeft) catEyelidLeft.classList.remove('blink');
        if (catEyelidRight) catEyelidRight.classList.remove('blink');
        setMouthOpen(0);
        scheduleBlink();
        movePupils();
    }

    function resumeAvatarAudio() { if (avatarAudioCtx && avatarAudioCtx.state === 'suspended') avatarAudioCtx.resume().catch(() => {}); }

    if (player) {
        player.addEventListener('play', () => { resumeAvatarAudio(); setAvatarState('speaking'); startMouthLoop(); });
        player.addEventListener('playing', () => { resumeAvatarAudio(); setAvatarState('speaking'); startMouthLoop(); });
        player.addEventListener('pause', () => { if (player.ended) return; stopMouthLoop(); if (avatarState === 'speaking') setAvatarState('idle'); });
        player.addEventListener('ended', () => { stopMouthLoop(); setAvatarState('idle'); });
        player.addEventListener('error', () => { stopMouthLoop(); setAvatarState('idle'); });
        player.addEventListener('emptied', () => { stopMouthLoop(); if (!busy) setAvatarState('idle'); });
    }

    const _origSetBusy = setBusy;
    setBusy = function(v) {
        const recActive = !!(mediaRecorder && mediaRecorder.state !== 'inactive');
        _origSetBusy(v);
        // Keep record button enabled while recording is active
        if (recActive) recordBtn.disabled = false;
        if (stopConversationBtn) {
            if (v || recActive) { stopConversationBtn.style.display = ''; stopConversationBtn.disabled = false; }
            else { stopConversationBtn.style.display = 'none'; stopConversationBtn.disabled = true; }
        }
        if (recActive) setAvatarState('listening');
        else if (v && player && !player.paused && !player.ended) setAvatarState('speaking');
        else if (v) setAvatarState('thinking');
        else if (!player || player.paused || player.ended) setAvatarState('idle');
    };

    const _origStartRecording = startRecording;
    startRecording = async function() { resumeAvatarAudio(); await _origStartRecording(); if (mediaRecorder && mediaRecorder.state !== 'inactive') setAvatarState('listening'); };

    const _origStopRecording = stopRecording;
    stopRecording = function() { if (mediaRecorder && mediaRecorder.state !== 'inactive') setAvatarState('thinking'); _origStopRecording(); };

    const _origSendClick = sendTextBtn.onclick;
    sendTextBtn.addEventListener('click', () => { if (!busy) resumeAvatarAudio(); }, { capture: true });
    if (samplePrompts) samplePrompts.addEventListener('change', () => { resumeAvatarAudio(); }, { capture: true });

    if (personaSelect) {
        personaSelect.addEventListener('change', () => applyPersona(personaSelect.value, true));
    }

    window.addEventListener('beforeunload', () => { cleanupStream(); if (testAmpHandle) closeAmplifiedStream(testAmpHandle); if (recAmpHandle) closeAmplifiedStream(recAmpHandle); stopMouthLoop(); if (avatarBlinkTimer) clearTimeout(avatarBlinkTimer); if (avatarPupilTimer) clearTimeout(avatarPupilTimer); if (avatarAudioCtx) { avatarAudioCtx.close().catch(()=>{}); } });
    syncTtsVoices('Kaveri');
    if (personaSelect) personaSelect.value = 'billu';
    applyPersona('billu', false);
    populateMicDevices(false);
    startEyeAnimation();
    updateRecordButton();
    setAvatarState('idle');
    log('demo ready (persona support enabled)');
