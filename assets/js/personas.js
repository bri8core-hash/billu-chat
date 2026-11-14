// assets/js/personas.js - persona definitions and UI/state logic
(function () {
    const PERSONAS = {
        billu: {
            name: 'Billu (Cat Teacher)',
            type: 'cat',
            description: 'Friendly cat teacher for kids.',
            context: 'You are Billu, a friendly cat teacher for a 1st standard kid. Explain clearly, kindly, and in very simple words. Keep answers short and age-appropriate. keep doing meow meow and purr sometimes',
            tts: { model: 'timbre-v2.5', voice: 'Kaveri', language: 'en-IN', speed: 0.85 }
        },
        father: {
            name: 'Father (Sandeep)',
            type: 'image',
            image: 'assets/images/sandeep.jpeg',
            mouth: { top: '60%', left: '50%', width: '10%', height: '4%' },
            description: 'Caring, practical, and supportive father figure.',
            context: 'You are Sandeep, a caring and practical father. Speak warmly, encourage confidence, give clear guidance, and keep answers supportive and easy to understand. Offer sensible advice and reassurance when helpful.',
            tts: { model: 'timbre-v3.0', voice: 'Prakash', language: 'en-IN', speed: 0.95 }
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
            context: 'You are a patient and encouraging teacher. Explain concepts step by step in simple language, check understanding, give examples, and keep responses clear and structured.',
            tts: { model: 'timbre-v2.5', voice: 'Nalini', language: 'en-IN', speed: 0.9 }
        },
        scientist: {
            name: 'Scientist',
            type: 'image',
            image: 'assets/images/scientist.png',
            mouth: { top: '66%', left: '50%', width: '9%', height: '3%' },
            description: 'Curious scientist who explains how things work.',
            context: 'You are a curious and friendly scientist. Explain how and why things work using simple reasoning, observations, and examples. Encourage curiosity and keep explanations accurate but easy to understand.',
            tts: { model: 'timbre-v3.0', voice: 'Shubham', language: 'en-IN', speed: 0.95 }
        },
        engineer: {
            name: 'Engineer',
            type: 'image',
            image: 'assets/images/enineer.png',
            mouth: { top: '66%', left: '50%', width: '9%', height: '3%' },
            description: 'Practical engineer focused on building and solving problems.',
            context: 'You are a practical and clear-thinking engineer. Focus on how to build, fix, and solve problems step by step. Give structured, actionable explanations and keep them easy to follow.',
            tts: { model: 'timbre-v3.0', voice: 'Avinash', language: 'en-IN', speed: 1.0 }
        },
        doctor: {
            name: 'Doctor',
            type: 'image',
            image: 'assets/images/doctor.png',
            mouth: { top: '66%', left: '50%', width: '9%', height: '3%' },
            description: 'Caring doctor who explains health clearly and calmly.',
            context: 'You are a caring and knowledgeable doctor. Explain health, wellness, and medical topics clearly, calmly, and simply. Be reassuring, encourage healthy habits, and remind users to consult a qualified healthcare professional for diagnosis, treatment, or urgent concerns.',
            tts: { model: 'timbre-v3.0', voice: 'Chetana', language: 'en-IN', speed: 0.95 }
        }
    };

    let currentPersonaId = 'billu';

    function get(id) {
        return PERSONAS[id] || PERSONAS.billu;
    }

    function getCurrent() {
        return get(currentPersonaId);
    }

    function getCurrentId() {
        return currentPersonaId;
    }

    function getAll() {
        return PERSONAS;
    }

    function apply(id, clearHistory, deps) {
        const p = get(id);
        currentPersonaId = (id in PERSONAS) ? id : 'billu';
        const d = deps || {};
        if (d.contextEl) d.contextEl.value = p.context;
        if (d.appTitleEl) d.appTitleEl.textContent = p.name + ' Chat';
        if (d.personaDesc) d.personaDesc.textContent = p.description || '';
        if (d.photoMouth) {
            const m = p.mouth || {};
            d.photoMouth.style.top = m.top || '72%';
            d.photoMouth.style.left = m.left || '50%';
            d.photoMouth.style.width = m.width || '16%';
            d.photoMouth.style.height = m.height || '4%';
        }
        if (p.type === 'cat') {
            if (d.catAvatarWrap) d.catAvatarWrap.style.display = '';
            if (d.personaPhotoWrap) d.personaPhotoWrap.style.display = 'none';
            if (d.personaImage) { d.personaImage.removeAttribute('src'); d.personaImage.alt = ''; }
        } else {
            if (d.catAvatarWrap) d.catAvatarWrap.style.display = 'none';
            if (d.personaPhotoWrap) {
                if (p.image) {
                    if (d.personaImage) { d.personaImage.src = p.image; d.personaImage.alt = p.name; }
                    d.personaPhotoWrap.style.display = '';
                } else {
                    if (d.personaImage) { d.personaImage.removeAttribute('src'); d.personaImage.alt = p.name; }
                    d.personaPhotoWrap.style.display = 'none';
                }
            }
        }
        if (p.tts) {
            if (d.ttsModelEl) d.ttsModelEl.value = p.tts.model || d.ttsModelEl.value;
            if (typeof d.syncTtsVoices === 'function') d.syncTtsVoices(p.tts.voice);
            if (p.tts.language && d.ttsLanguageEl && d.ttsLanguageEl.querySelector('option[value="' + p.tts.language + '"]')) {
                d.ttsLanguageEl.value = p.tts.language;
            }
            if (p.tts.speed && d.ttsSpeedEl) {
                d.ttsSpeedEl.value = String(p.tts.speed);
                if (d.ttsSpeedValueEl) d.ttsSpeedValueEl.textContent = d.ttsSpeedEl.value + 'x';
            }
        }
        if (clearHistory && typeof d.clearHistory === 'function') {
            d.clearHistory();
        }
        if (typeof d.setStatus === 'function') d.setStatus('Persona set to ' + p.name + '. Ready.');
        if (typeof d.log === 'function') d.log('persona switched to ' + p.name);
        if (typeof d.setAvatarState === 'function') d.setAvatarState('idle');
        return p;
    }

    window.Personas = {
        get: get,
        getCurrent: getCurrent,
        getCurrentId: getCurrentId,
        getAll: getAll,
        apply: apply
    };
})();
