<div class="page">
    <h1 id="appTitle">Persona Chat</h1>
    <div id="status" class="status"></div>

    <div class="grid">

        <div class="card avatar-card">
            <div class="persona-selector-row">
                <label for="personaSelect">Persona</label>
                <select id="personaSelect">
                    <option value="billu">Billu (Cat Teacher)</option>
                    <option value="father">Father (Sandeep)</option>
                    <option value="mother">Mother (Leelavati)</option>
                    <option value="teacher">Teacher</option>
                    <option value="scientist">Scientist</option>
                    <option value="engineer">Engineer</option>
                </select>
            </div>
            <div class="avatar-wrap">
                <div id="catAvatarWrap" class="cat-wrap">
                    <svg id="catAvatar" class="cat-avatar" data-avatar-state="idle" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" aria-label="Cat avatar">
                        <defs>
                            <clipPath id="eyeClipLeft"><ellipse cx="75" cy="85" rx="14" ry="16"/></clipPath>
                            <clipPath id="eyeClipRight"><ellipse cx="125" cy="85" rx="14" ry="16"/></clipPath>
                        </defs>
                        <g id="cat-head">
                            <polygon id="cat-left-ear" points="45,55 70,10 95,55" fill="#f59e0b" stroke="#b45309" stroke-width="3" stroke-linejoin="round"/>
                            <polygon points="55,50 70,22 85,50" fill="#fbcfe8"/>
                            <polygon id="cat-right-ear" points="105,55 130,10 155,55" fill="#f59e0b" stroke="#b45309" stroke-width="3" stroke-linejoin="round"/>
                            <polygon points="115,50 130,22 145,50" fill="#fbcfe8"/>
                            <ellipse cx="100" cy="95" rx="70" ry="62" fill="#fbbf24" stroke="#b45309" stroke-width="3"/>
                            <ellipse cx="100" cy="108" rx="40" ry="28" fill="#fde68a" opacity="0.7"/>
                            <g id="cat-left-eye">
                                <ellipse cx="75" cy="85" rx="14" ry="16" fill="#fff" stroke="#78350f" stroke-width="2"/>
                                <g id="cat-pupil-left" class="cat-pupil"><ellipse cx="75" cy="87" rx="6" ry="8" fill="#1f2937"/><circle cx="73" cy="84" r="2.2" fill="#fff"/></g>
                                <ellipse id="cat-eyelid-left" class="cat-eyelid" cx="75" cy="85" rx="15" ry="17" fill="#fbbf24" clip-path="url(#eyeClipLeft)"/>
                            </g>
                            <g id="cat-right-eye">
                                <ellipse cx="125" cy="85" rx="14" ry="16" fill="#fff" stroke="#78350f" stroke-width="2"/>
                                <g id="cat-pupil-right" class="cat-pupil"><ellipse cx="125" cy="87" rx="6" ry="8" fill="#1f2937"/><circle cx="123" cy="84" r="2.2" fill="#fff"/></g>
                                <ellipse id="cat-eyelid-right" class="cat-eyelid" cx="125" cy="85" rx="15" ry="17" fill="#fbbf24" clip-path="url(#eyeClipRight)"/>
                            </g>
                            <polygon points="100,102 94,110 106,110" fill="#f472b6" stroke="#be185d" stroke-width="1.5" stroke-linejoin="round"/>
                            <ellipse cx="58" cy="108" rx="9" ry="5" fill="#fda4af" opacity="0.55"/>
                            <ellipse cx="142" cy="108" rx="9" ry="5" fill="#fda4af" opacity="0.55"/>
                            <ellipse id="cat-mouth" cx="100" cy="120" rx="10" ry="2.5" fill="#7f1d1d" stroke="#78350f" stroke-width="1.5"/>
                            <line x1="58" y1="108" x2="28" y2="103" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                            <line x1="58" y1="114" x2="28" y2="114" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                            <line x1="58" y1="120" x2="28" y2="125" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                            <line x1="142" y1="108" x2="172" y2="103" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                            <line x1="142" y1="114" x2="172" y2="114" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                            <line x1="142" y1="120" x2="172" y2="125" stroke="#78350f" stroke-width="2" stroke-linecap="round"/>
                        </g>
                    </svg>
                </div>
                <div id="personaPhotoWrap" class="persona-photo-wrap" style="display:none;">
                    <img id="personaImage" class="persona-image" alt="" />
                    <div id="photoMouth" class="photo-mouth" aria-hidden="true"></div>
                </div>
                <div id="avatarStateLabel" class="cat-state">Idle</div>
                <div id="personaDesc" class="persona-desc small"></div>
            </div>
        </div>

        <div class="card">
            <label for="conversation">Conversation</label>
            <textarea id="conversation" readonly placeholder="Conversation will appear here..."></textarea>
            <div class="row" style="margin-top:10px;">
                <button id="recordBtn" class="green" aria-label="Start recording" title="Start recording with microphone">▶ Record</button>
                <button id="stopConversationBtn" class="red stop-conversation" aria-label="Stop conversation" title="Stop conversation immediately (during recording or AI speech)" style="display:none;">⏹ Stop</button>
                <button id="replayBtn" class="gray" aria-label="Replay last response" title="Replay last response" style="display:none;">&#128257;</button>
                <button id="clearBtn" class="gray" aria-label="Clear conversation" title="Clear conversation">&#128465;</button>
                <span class="small" id="turnInfo"></span>
            </div>
            <audio id="player" style="display:none;"></audio>
            <div id="micLevelWrap" class="level-meter" style="display:none; margin-top:14px;">
                <span><strong>Microphone level:</strong></span>
                <div class="meter-bar"><div id="micLevelFill" class="meter-fill"></div></div>
                <span id="micLevelText" class="meter-db">-60 dB</span>
                <span id="micPeakText" class="meter-peak">peak: -60 dB</span>
            </div>
        </div>


        <div class="card span2">
            <label for="manualText">Text fallback (type and send without mic)</label>
            <div class="row">
                <select id="samplePrompts" style="max-width:100%; flex:1 1 220px;">
                    <option value="">Sample question prompts…</option>
                    <option value="What is 2 plus 3?">What is 2 plus 3?</option>
                    <option value="Can you teach me the ABCs?">Can you teach me the ABCs?</option>
                    <option value="Why is the sky blue?">Why is the sky blue?</option>
                    <option value="Tell me a short story about a cat.">Tell me a short story about a cat.</option>
                    <option value="What sound does a cow make?">What sound does a cow make?</option>
                    <option value="Can you help me count from 1 to 10?">Can you help me count from 1 to 10?</option>
                    <option value="What are the colors of the rainbow?">What are the colors of the rainbow?</option>
                    <option value="ನನಗೊಂದು ಕಥೆ ಹೇಳು">ನನಗೊಂದು ಕಥೆ ಹೇಳು</option>
                    <option value="ನಿಮ್ಮ ಹೆಸರೇನು?">ನಿಮ್ಮ ಹೆಸರೇನು?</option>
                </select>
                <input id="manualText" type="text" placeholder="Type a message..." />
                <button id="sendTextBtn">Send Text</button>
            </div>
        </div>


        <details class="card span2">
            <summary>AI context / system prompt</summary>
            <textarea id="context">You are Billu, a friendly cat teacher for a 1st standard kid. Explain clearly, kindly, and in very simple words. Keep answers short and age-appropriate.</textarea>
            <div class="row" style="margin-top:10px;">
                <div class="inline-field">
                    <label for="sttLanguage">STT language (Gnani)</label>
                    <select id="sttLanguage">
                        <option value="indic-auto" selected>indic-auto (auto-detect, prisma-v3.0)</option>
                        <option value="en-IN">en-IN (English India)</option>
                        <option value="hi-IN">hi-IN (Hindi)</option>
                        <option value="kn-IN">kn-IN (Kannada)</option>
                        <option value="ta-IN">ta-IN (Tamil)</option>
                        <option value="te-IN">te-IN (Telugu)</option>
                        <option value="ml-IN">ml-IN (Malayalam)</option>
                        <option value="mr-IN">mr-IN (Marathi)</option>
                        <option value="bn-IN">bn-IN (Bengali)</option>
                        <option value="gu-IN">gu-IN (Gujarati)</option>
                        <option value="pa-IN">pa-IN (Punjabi)</option>
                    </select>
                </div>
                <div class="inline-field">
                    <label for="ttsModel">TTS model</label>
                    <select id="ttsModel">
                        <option value="timbre-v2.5" selected>timbre-v2.5</option>
                        <option value="timbre-v3.0">timbre-v3.0</option>
                    </select>
                </div>
                <div class="inline-field">
                    <label for="ttsVoice">TTS voice</label>
                    <select id="ttsVoice"></select>
                </div>
                <div class="inline-field">
                    <label for="ttsLanguage">TTS language</label>
                    <select id="ttsLanguage">
                        <option value="en-IN" selected>en-IN</option>
                        <option value="hi-IN">hi-IN</option>
                        <option value="auto">auto</option>
                        <option value="hi-en">hi-en</option>
                        <option value="kn-IN">kn-IN</option>
                        <option value="ta-IN">ta-IN</option>
                        <option value="te-IN">te-IN</option>
                        <option value="ml-IN">ml-IN</option>
                        <option value="mr-IN">mr-IN</option>
                        <option value="bn-IN">bn-IN</option>
                        <option value="gu-IN">gu-IN</option>
                        <option value="pa-IN">pa-IN</option>
                    </select>
                </div>
                <div class="inline-field">
                    <label for="ttsSpeed">TTS speed</label>
                    <input type="range" id="ttsSpeed" min="0.85" max="1.15" step="0.05" value="0.85">
                    <span class="small" id="ttsSpeedValue">0.85x</span>
                </div>
            </div>
            <p class="small">Tip: use a TTS voice compatible with the selected TTS model. For auto-detected STT, pick a TTS language/voice you want the reply spoken in.</p>
        </details>
        <details class="card span2">
            <summary>Debug log</summary>
            <textarea id="debug" readonly></textarea>
        </details>

        <details class="card span2">
            <summary>Mic Diagnostics</summary>
            <div class="row" style="margin-bottom:8px;">
                <div class="inline-field" style="min-width:0; flex:1 1 220px;">
                    <label for="micSelect">Microphone</label>
                    <select id="micSelect"><option value="default">Default</option></select>
                </div>
                <button id="testMicBtn">Test Mic</button>
                <button id="stopTestBtn" class="red" disabled>Stop Test</button>
                <button id="recStartBtn" class="green">Record 5s</button>
                <button id="recStopBtn" class="red" disabled>Stop Early</button>
                <button id="recPlayBtn">Play Clip</button>
                <button id="recTranscribeBtn" disabled>Transcribe Clip</button>
                <button id="recClearBtn" class="gray">Clear Clip</button>
                <span id="recCountdown" class="small"></span>
            </div>
            <div class="row">
                <div class="inline-field" style="max-width:100%; flex:1 1 220px;">
                    <label for="recGainSlider">Input boost: <span id="recGainValue" class="boost-val">8x</span></label>
                    <input type="range" id="recGainSlider" min="1" max="10" step="0.5" value="8">
                </div>
                <span id="recResultMsg" class="small"></span>
            </div>
            <div id="recPlaybackWrap" style="display:none; margin-top:8px;">
                <audio id="recAudio" controls></audio>
                <label for="recTranscript" style="margin-top:8px;">Diagnostic transcript (Gnani STT)</label>
                <textarea id="recTranscript" readonly placeholder="Transcribed text from the recorded clip will appear here..."></textarea>
            </div>
            <p class="small" style="margin-top:8px;">If meter stays low or says no sound, pick the correct microphone, allow mic permission, check Windows mic privacy/input level, and increase input boost.</p>
        </details>
    </div>
</div>
