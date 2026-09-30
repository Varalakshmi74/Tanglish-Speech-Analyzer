/**
 * Tanglish Speech Analyzer - Master Engine
 * Next-Gen Tamil + English NLP & Speech Intelligence Platform
 * Pure Vanilla JavaScript - Zero Backend Required
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. NLP LEXICON, DICTIONARIES & RULE PATTERNS
    // ==========================================================================

    // Native Tamil Script Unicode Range: \u0B80-\u0BFF
    const TAMIL_UNICODE_REGEX = /[\u0B80-\u0BFF]/;

    // Common Tanglish Root Words (Pronouns, Verbs, Adjectives, Adverbs, Particles, Numbers)
    const TANGLISH_LEXICON = new Set([
        // Pronouns & Nouns
        'naan', 'nan', 'naanga', 'nanga', 'namma', 'nama', 'enakku', 'enaku', 'ennoda', 'enoda', 'ennai', 'ennaiye',
        'nee', 'neenga', 'unakku', 'unaku', 'unnoda', 'unoda', 'unnai',
        'avan', 'avaru', 'avanukku', 'avanga', 'avangala', 'avangalukku', 'aval', 'avalu', 'avalukku',
        'idhu', 'ithu', 'adhu', 'athu', 'idhukku', 'adhukku', 'idhellam', 'adhellam', 'idhula', 'adhula',
        'enga', 'engaloda', 'unga', 'ungaloda', 'eppo', 'eppovum', 'enna', 'ethu', 'edhu', 'epdi', 'eppadi',
        'yaar', 'yaaru', 'yaarukku', 'edhukku', 'ethukku', 'aalu', 'pasanga', 'ponnunga', 'machan', 'machi', 'bro', 'da', 'di', 'thambi', 'anna', 'akka', 'mama', 'mami', 'appa', 'amma', 'kudumbam',
        
        // Verbs & Inflections
        'irukku', 'iruku', 'irukken', 'iruken', 'irukkom', 'irukanga', 'irundhuchu', 'irundhadhu', 'irundhen', 'irundhanga',
        'pannu', 'panna', 'pannanum', 'pannitu', 'pannitten', 'panren', 'pannuvom', 'pannunga', 'pannirukken',
        'porom', 'poren', 'poganum', 'ponum', 'poiten', 'pochu', 'pona', 'ponga', 'kelambu', 'kelamburen',
        'vaaren', 'varen', 'varanum', 'vandhen', 'vandhadhu', 'vandhuten', 'vaanga', 'vandha',
        'paaru', 'paarka', 'paathen', 'paathutu', 'paakaren', 'paathanga', 'sollu', 'sollunga', 'sonnen', 'sonnadhu',
        'kudu', 'kudunga', 'kuduthen', 'kuduthutu', 'kuduppen', 'vaangu', 'vaangunga', 'vaangiten', 'eduthu', 'eduthukiren',
        'mudiyum', 'mudiyadhu', 'mudinjadhu', 'mudichitu', 'mudikanum', 'aachu', 'aagudhu', 'aagala',
        'sapda', 'saapten', 'saapidanum', 'thoonga', 'thoongitten', 'padikka', 'padichen', 'padikkanum',
        'theriyum', 'theriyadhu', 'puriyum', 'puriyala', 'kekudhu', 'kekala', 'kettan', 'pesu', 'pesanum', 'pesinen',
        
        // Adjectives & Adverbs & Modifiers
        'romba', 'konjam', 'semma', 'super-aa', 'nalla', 'nalladhu', 'periya', 'chinna', 'dharalama',
        'seekiram', 'medhuva', 'ullara', 'veliya', 'keezha', 'mela', 'pudhu', 'pazhasu',
        'azhaga', 'kashtama', 'easy-aa', 'correct-aa', 'correctaa', 'nallaa', 'fast-aa', 'slow-aa',
        
        // Conjunctions & Particles
        'aana', 'aanaal', 'anal', 'but-aa', 'appo', 'ippo', 'adhu-nalla', 'adhunala', 'apram', 'appuram',
        'dhaan', 'than', 'dhaane', 'kooda', 'mattum', 'seri', 'sari', 'illa', 'illai', 'illana',
        'aama', 'aamama', 'la', 'maari', 'madhiri', 'nu', 'endru', 'kitta', 'koodave',
        
        // Time & Common Concepts
        'innaikku', 'inaiku', 'nalaikku', 'nalaiku', 'naalaikku', 'naetru', 'nethu', 'kaalaila', 'sayandhram', 'rathiri',
        'neram', 'velai', 'vela', 'panam', 'kaasu', 'kaalam', 'varusham', 'maasam', 'vaaram'
    ]);

    // Tanglish Morphological Suffixes attached to English/Tamil roots
    const TANGLISH_SUFFIX_PATTERNS = [
        /-ku$/i, /-ukku$/i, /-kku$/i,          // Dative (college-ku, exam-ku, office-ukku)
        /-la$/i, /-ula$/i, /-ila$/i,           // Locative (office-la, meeting-la, car-la)
        /-oda$/i, /-yoda$/i,                   // Associative (friend-oda, project-oda)
        /-aa$/i, /-a$/i,                       // Adverbial / Predicative (tired-aa, interesting-aa, super-aa)
        /-um$/i,                               // Inclusive (rendum, project-um)
        /-leyirundhu$/i, /-lerundhu$/i,        // Ablative (office-leyirundhu)
        /-kaga$/i, /-kaaga$/i,                 // Benefactive (project-kaga, exam-kaga)
        /-kitta$/i,                            // Near/Associative (client-kitta, manager-kitta)
        /-dhaan$/i, /-than$/i,                 // Emphatic (idhu-dhaan, tomorrow-dhaan)
        /-nu$/i,                               // Quotative (easy-nu, software-nu)
        /-panna$/i, /-panni$/i, /-pannitu$/i,  // Verbalizer (call-panna, test-panni, edit-pannitu)
        /-aachu$/i, /-aachu$/i,                // Perfective (ready-aachu, finish-aachu)
        /-irukku$/i, /-irukken$/i              // Auxiliary (done-aa-irukku, ready-aa-irukken)
    ];

    // Standard English Common Words Dictionary (High-frequency subset for fast lookup)
    const ENGLISH_LEXICON = new Set([
        'tomorrow', 'today', 'yesterday', 'college', 'school', 'university', 'project', 'work', 'office', 'job',
        'prepare', 'preparation', 'because', 'why', 'what', 'where', 'when', 'how', 'who', 'which',
        'exam', 'test', 'interview', 'questions', 'answers', 'easy', 'difficult', 'hard', 'tired', 'happy', 'sad',
        'start', 'finish', 'complete', 'continue', 'software', 'engineer', 'developer', 'coding', 'program', 'system',
        'interesting', 'boring', 'important', 'simple', 'presentation', 'client', 'meeting', 'manager', 'team',
        'well', 'good', 'better', 'best', 'bad', 'great', 'awesome', 'nice', 'morning', 'evening', 'night', 'time',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'me', 'him', 'them',
        'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'done',
        'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
        'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'else', 'so', 'for', 'with', 'without', 'about', 'against',
        'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
        'on', 'off', 'over', 'under', 'again', 'further', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few',
        'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 's', 't',
        'can', 'will', 'just', 'don', 'should', 'now', 'want', 'need', 'like', 'love', 'make', 'take', 'give', 'get',
        'know', 'think', 'see', 'look', 'come', 'go', 'call', 'talk', 'speak', 'listen', 'hear', 'learn', 'teach', 'help',
        'feel', 'try', 'leave', 'find', 'show', 'tell', 'ask', 'seem', 'feel', 'try', 'leave', 'call', 'keep', 'put', 'break',
        'computer', 'laptop', 'mobile', 'phone', 'message', 'call', 'email', 'internet', 'car', 'bike', 'bus', 'train',
        'food', 'tea', 'coffee', 'water', 'weather', 'hot', 'cold', 'rain', 'road', 'house', 'home', 'room', 'class',
        'actually', 'basically', 'literally', 'really', 'totally', 'completely', 'first', 'second', 'last', 'next',
        'friend', 'friends', 'family', 'people', 'person', 'life', 'day', 'days', 'week', 'month', 'year', 'hours', 'minutes',
        'problem', 'solution', 'idea', 'topic', 'concept', 'notes', 'code', 'bug', 'feature', 'version', 'branch', 'data'
    ]);

    // Filler Words (English & Tanglish)
    const ENGLISH_FILLERS = new Set([
        'um', 'uh', 'actually', 'basically', 'like', 'you know', 'so', 'hmm', 'ah', 'well',
        'literally', 'sort of', 'kind of', 'i mean', 'you see', 'anyway'
    ]);

    const TANGLISH_FILLERS = new Set([
        'apdi', 'appadi', 'seri', 'sari', 'aama', 'paatha', 'theriyuma', 'vandhu', 'appuram',
        'aparam', 'konjam', 'appadiye', 'dhaan', 'than', 'la', 'maari', 'madhiri', 'machan', 'bro', 'da', 'di'
    ]);

    // Predefined AI Polish & Translation Rules Matrix
    const PREDEFINED_EXAMPLES = [
        {
            tanglish: "Naan tomorrow college-ku poganum because enakku project work irukku.",
            english: "I have to go to college tomorrow because I have project work.",
            naturalTanglish: "Naan nalaikku college-ku poganum, enakku project vela irukku.",
            domain: "Academic / College",
            summary: "User is planning to visit college tomorrow to work on their academic project."
        },
        {
            tanglish: "Actually enakku indha project romba interesting-aa irukku.",
            english: "Actually, I find this project very interesting.",
            naturalTanglish: "Enakku indha project romba pidichirukku.",
            domain: "Technology / Project",
            summary: "User is expressing genuine interest and enthusiasm towards their ongoing project."
        },
        {
            tanglish: "College mudichitu I want to start a software job.",
            english: "After completing college, I want to start working in a software job.",
            naturalTanglish: "College mudinjadhum naan oru software velai la join panna poren.",
            domain: "Career / Employment",
            summary: "User is outlining their career aspiration to secure a software engineering job after graduation."
        },
        {
            tanglish: "Naan exam-ku prepare pannitu irukken but romba tired-aa irukku.",
            english: "I am preparing for the exams, but I am feeling very tired.",
            naturalTanglish: "Naan exam-ku padichitu irukken aana romba thookama/tired-aa irukku.",
            domain: "Academic / Wellness",
            summary: "User is currently preparing for exams while experiencing fatigue."
        },
        {
            tanglish: "Innaikku interview romba well-aa pochu, questions ellam easy-aa answer panniten.",
            english: "The interview went very well today; I was able to answer all the questions easily.",
            naturalTanglish: "Innaikku interview super-aa mudinjadhu, ella kelvikum nalla bathil sonnen.",
            domain: "Job Interview / Career",
            summary: "User is sharing positive feedback regarding their recent successful job interview."
        },
        {
            tanglish: "Meeting la presentation super-aa irundhuchu, client romba happy!",
            english: "The presentation in the meeting was excellent, and the client was very pleased!",
            naturalTanglish: "Meeting la presentation semmaya irundhuchu, client romba santhoshapattaru!",
            domain: "Corporate / Client Work",
            summary: "User is celebrating a successful client presentation meeting."
        }
    ];

    // ==========================================================================
    // 2. STATE MANAGEMENT & DOM ELEMENTS
    // ==========================================================================
    const state = {
        currentTab: 'dashboard-view',
        isRecording: false,
        audioStream: null,
        mediaRecorder: null,
        audioChunks: [],
        audioBlob: null,
        audioUrl: null,
        recognition: null,
        recordingStartTime: 0,
        recordingTimerInterval: null,
        recordingDurationSeconds: 0,
        currentTranscript: "",
        lastAnalyzedPayload: null,
        audioContext: null,
        analyser: null,
        dataArray: null,
        animationFrameId: null,
        charts: {
            langDist: null,
            fillers: null,
            switchingFlow: null,
            radarMetrics: null
        },
        settings: {
            speechLang: 'en-IN',
            continuousSpeech: true,
            autoAnalyze: true,
            targetWpm: 130,
            strictFillers: true,
            autoSaveHistory: true,
            particles: true,
            glow: true,
            soundFx: true
        }
    };

    // DOM Elements
    const elements = {
        // Navigation
        navLinks: document.querySelectorAll('.nav-link'),
        viewSections: document.querySelectorAll('.view-section'),
        currentSectionTitle: document.getElementById('currentSectionTitle'),
        sidebar: document.getElementById('sidebar'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
        historyCounter: document.getElementById('historyCounter'),

        // Hero & Quick Action Buttons
        heroSpeakBtn: document.getElementById('heroSpeakBtn'),
        heroTextBtn: document.getElementById('heroTextBtn'),
        headerNewRecordBtn: document.getElementById('headerNewRecordBtn'),
        quickSampleBtn: document.getElementById('quickSampleBtn'),
        dashViewFullAnalytics: document.getElementById('dashViewFullAnalytics'),
        dashGoToSpeechBtn: document.getElementById('dashGoToSpeechBtn'),
        dashGoToTextBtn: document.getElementById('dashGoToTextBtn'),

        // Dashboard Stats
        quickStatTotalWords: document.getElementById('quickStatTotalWords'),
        quickStatTamilWords: document.getElementById('quickStatTamilWords'),
        quickStatTamilRatio: document.getElementById('quickStatTamilRatio'),
        quickStatEnglishWords: document.getElementById('quickStatEnglishWords'),
        quickStatEnglishRatio: document.getElementById('quickStatEnglishRatio'),
        quickStatCodeSwitch: document.getElementById('quickStatCodeSwitch'),
        quickStatFillers: document.getElementById('quickStatFillers'),
        quickStatFillerPill: document.getElementById('quickStatFillerPill'),

        // Speech Elements
        startRecordBtn: document.getElementById('startRecordBtn'),
        stopRecordBtn: document.getElementById('stopRecordBtn'),
        deleteRecordBtn: document.getElementById('deleteRecordBtn'),
        analyzeSpeechBtn: document.getElementById('analyzeSpeechBtn'),
        btnSubmitSpeechForAnalysis: document.getElementById('btnSubmitSpeechForAnalysis'),
        speechAnalyzeAgainBtn: document.getElementById('speechAnalyzeAgainBtn'),
        copySpeechTranscriptionBtn: document.getElementById('copySpeechTranscriptionBtn'),
        listenTranscriptBtn: document.getElementById('listenTranscriptBtn'),
        speechTranscriptionText: document.getElementById('speechTranscriptionText'),
        recordTimer: document.getElementById('recordTimer'),
        recordingTimerBox: document.getElementById('recordingTimerBox'),
        recordingStatusLabel: document.getElementById('recordingStatusLabel'),
        liveAudioWaveform: document.getElementById('liveAudioWaveform'),
        heroWaveformCanvas: document.getElementById('heroWaveformCanvas'),
        speechErrorBanner: document.getElementById('speechErrorBanner'),
        speechErrorTitle: document.getElementById('speechErrorTitle'),
        speechErrorDesc: document.getElementById('speechErrorDesc'),
        audioPlayerWidget: document.getElementById('audioPlayerWidget'),
        playAudioBtn: document.getElementById('playAudioBtn'),
        playAudioIcon: document.getElementById('playAudioIcon'),
        audioProgressBar: document.getElementById('audioProgressBar'),
        audioDurationLabel: document.getElementById('audioDurationLabel'),
        recordedAudioElement: document.getElementById('recordedAudioElement'),
        spDurationText: document.getElementById('spDurationText'),
        spWpmText: document.getElementById('spWpmText'),
        spWordCountText: document.getElementById('spWordCountText'),

        // Text Analyzer Elements
        tanglishTextInput: document.getElementById('tanglishTextInput'),
        analyzeTextSubmitBtn: document.getElementById('analyzeTextSubmitBtn'),
        pasteTextBtn: document.getElementById('pasteTextBtn'),
        clearTextBtn: document.getElementById('clearTextBtn'),
        liveWordCount: document.getElementById('liveWordCount'),
        liveTamilCount: document.getElementById('liveTamilCount'),
        liveEnglishCount: document.getElementById('liveEnglishCount'),
        liveFillerCount: document.getElementById('liveFillerCount'),
        liveCharCount: document.getElementById('liveCharCount'),

        // Analytics Results Elements
        tokenStreamContainer: document.getElementById('tokenStreamContainer'),
        resultTamilWords: document.getElementById('resultTamilWords'),
        resultTamilPercent: document.getElementById('resultTamilPercent'),
        resultEnglishWords: document.getElementById('resultEnglishWords'),
        resultEnglishPercent: document.getElementById('resultEnglishPercent'),
        resultMixedWords: document.getElementById('resultMixedWords'),
        resultMixedPercent: document.getElementById('resultMixedPercent'),
        resultTotalWords: document.getElementById('resultTotalWords'),
        resultTotalChars: document.getElementById('resultTotalChars'),
        cmiScoreBadge: document.getElementById('cmiScoreBadge'),
        resultSwitchCount: document.getElementById('resultSwitchCount'),
        resultSwitchDensity: document.getElementById('resultSwitchDensity'),
        ratioTamilText: document.getElementById('ratioTamilText'),
        ratioEnglishText: document.getElementById('ratioEnglishText'),
        ratioBarTamil: document.getElementById('ratioBarTamil'),
        ratioBarEnglish: document.getElementById('ratioBarEnglish'),
        transitionPillSequence: document.getElementById('transitionPillSequence'),
        resultFillerTotal: document.getElementById('resultFillerTotal'),
        fillerPillsContainer: document.getElementById('fillerPillsContainer'),
        repeatedWordsBadge: document.getElementById('repeatedWordsBadge'),
        repeatWordsContainer: document.getElementById('repeatWordsContainer'),
        resultSpeedWpm: document.getElementById('resultSpeedWpm'),
        speedStatusPill: document.getElementById('speedStatusPill'),
        speedCategoryText: document.getElementById('speedCategoryText'),
        statTotalSentences: document.getElementById('statTotalSentences'),
        statAvgWordsSentence: document.getElementById('statAvgWordsSentence'),
        statLongestSentence: document.getElementById('statLongestSentence'),
        statShortestSentence: document.getElementById('statShortestSentence'),
        summaryDomainBadge: document.getElementById('summaryDomainBadge'),
        resultSummaryText: document.getElementById('resultSummaryText'),
        summaryKeywordsRow: document.getElementById('summaryKeywordsRow'),
        suggInputText: document.getElementById('suggInputText'),
        suggImprovedEnglish: document.getElementById('suggImprovedEnglish'),
        suggNaturalTanglish: document.getElementById('suggNaturalTanglish'),
        copyImprovedEnBtn: document.getElementById('copyImprovedEnBtn'),
        copyNaturalTaBtn: document.getElementById('copyNaturalTaBtn'),
        resultCommScore: document.getElementById('resultCommScore'),
        insightsFeedbackList: document.getElementById('insightsFeedbackList'),
        exportReportBtn: document.getElementById('exportReportBtn'),
        printReportBtn: document.getElementById('printReportBtn'),

        // History Elements
        historyListContainer: document.getElementById('historyListContainer'),
        emptyHistoryState: document.getElementById('emptyHistoryState'),
        historySearchInput: document.getElementById('historySearchInput'),
        historyCountSummary: document.getElementById('historyCountSummary'),
        clearAllHistoryBtn: document.getElementById('clearAllHistoryBtn'),

        // Settings Elements
        settingSpeechLang: document.getElementById('settingSpeechLang'),
        settingContinuousSpeech: document.getElementById('settingContinuousSpeech'),
        settingAutoAnalyze: document.getElementById('settingAutoAnalyze'),
        settingTargetWpm: document.getElementById('settingTargetWpm'),
        targetWpmVal: document.getElementById('targetWpmVal'),
        settingStrictFillers: document.getElementById('settingStrictFillers'),
        settingAutoSaveHistory: document.getElementById('settingAutoSaveHistory'),
        settingParticlesToggle: document.getElementById('settingParticlesToggle'),
        settingGlowToggle: document.getElementById('settingGlowToggle'),
        settingSoundFxToggle: document.getElementById('settingSoundFxToggle'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),

        // Loader & Toast
        analysisLoadingOverlay: document.getElementById('analysisLoadingOverlay'),
        loaderProgressFill: document.getElementById('loaderProgressFill'),
        loaderStatusText: document.getElementById('loaderStatusText'),
        toastContainer: document.getElementById('toastContainer'),
        bgCanvas: document.getElementById('bgCanvas')
    };

    // ==========================================================================
    // 3. SOUND EFFECTS & NOTIFICATION TOASTS
    // ==========================================================================
    function playTone(freq = 440, type = 'sine', duration = 0.15) {
        if (!state.settings.soundFx) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context silently ignored if restricted by browser
        }
    }

    function showToast(message, type = 'info', icon = 'fa-circle-info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // ==========================================================================
    // 4. TAB NAVIGATION & VIEW SWITCHING
    // ==========================================================================
    function switchTab(tabId) {
        state.currentTab = tabId;

        // Update nav links
        elements.navLinks.forEach(link => {
            if (link.dataset.tab === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update sections
        elements.viewSections.forEach(section => {
            if (section.id === tabId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update breadcrumb
        const activeLink = document.querySelector(`.nav-link[data-tab="${tabId}"] .nav-text`);
        if (activeLink) {
            elements.currentSectionTitle.textContent = activeLink.textContent;
        }

        // Close mobile drawer if open
        elements.sidebar.classList.remove('mobile-open');

        // Trigger chart resize if entering analytics
        if (tabId === 'analytics-view' && state.lastAnalyzedPayload) {
            setTimeout(renderAllCharts, 100);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => switchTab(link.dataset.tab));
    });

    // Top action buttons
    if (elements.heroSpeakBtn) elements.heroSpeakBtn.addEventListener('click', () => switchTab('speech-view'));
    if (elements.heroTextBtn) elements.heroTextBtn.addEventListener('click', () => switchTab('text-view'));
    if (elements.headerNewRecordBtn) elements.headerNewRecordBtn.addEventListener('click', () => {
        switchTab('speech-view');
        elements.startRecordBtn.click();
    });
    if (elements.dashViewFullAnalytics) elements.dashViewFullAnalytics.addEventListener('click', () => switchTab('analytics-view'));
    if (elements.dashGoToSpeechBtn) elements.dashGoToSpeechBtn.addEventListener('click', () => switchTab('speech-view'));
    if (elements.dashGoToTextBtn) elements.dashGoToTextBtn.addEventListener('click', () => switchTab('text-view'));

    // Mobile menu toggles
    if (elements.mobileMenuBtn) elements.mobileMenuBtn.addEventListener('click', () => elements.sidebar.classList.add('mobile-open'));
    if (elements.sidebarCloseBtn) elements.sidebarCloseBtn.addEventListener('click', () => elements.sidebar.classList.remove('mobile-open'));

    // ==========================================================================
    // 5. CORE NLP ANALYZER ENGINE
    // ==========================================================================

    /**
     * Checks if a word is classified as Tamil, English, Mixed (Code-Mixed), or Filler
     */
    function classifyWord(rawWord) {
        // Normalize
        const clean = rawWord.toLowerCase().replace(/^[^\w\u0B80-\u0BFF]+|[^\w\u0B80-\u0BFF]+$/g, '');
        if (!clean) return { raw: rawWord, clean: '', type: 'PUNCT', isFiller: false, isRepeat: false };

        // 1. Direct Tamil Unicode Script
        if (TAMIL_UNICODE_REGEX.test(clean)) {
            return {
                raw: rawWord,
                clean,
                type: 'TAMIL',
                isFiller: TANGLISH_FILLERS.has(clean),
                isRepeat: false,
                reason: 'Tamil Script'
            };
        }

        // 2. Direct Tanglish Root Lexicon
        if (TANGLISH_LEXICON.has(clean)) {
            return {
                raw: rawWord,
                clean,
                type: 'TAMIL',
                isFiller: TANGLISH_FILLERS.has(clean),
                isRepeat: false,
                reason: 'Tanglish Lexicon'
            };
        }

        // 3. Check for Mixed Words (English root + Tamil Suffix)
        let isMixed = false;
        let matchedSuffix = '';
        for (const pattern of TANGLISH_SUFFIX_PATTERNS) {
            if (pattern.test(clean)) {
                const rootPart = clean.replace(pattern, '');
                if (rootPart.length >= 2 && (ENGLISH_LEXICON.has(rootPart) || /^[a-z]+$/i.test(rootPart))) {
                    isMixed = true;
                    matchedSuffix = clean.match(pattern)[0];
                    break;
                }
            }
        }

        if (isMixed) {
            return {
                raw: rawWord,
                clean,
                type: 'MIXED',
                isFiller: false,
                isRepeat: false,
                reason: `English root with Tanglish suffix '${matchedSuffix}'`
            };
        }

        // 4. Check Pure English Lexicon
        if (ENGLISH_LEXICON.has(clean)) {
            return {
                raw: rawWord,
                clean,
                type: 'ENGLISH',
                isFiller: ENGLISH_FILLERS.has(clean),
                isRepeat: false,
                reason: 'English Lexicon'
            };
        }

        // 5. Morphological Heuristic for Tanglish/Tamil transliteration
        // Tamil transliterated syllables often end with: -am, -um, -anga, -unga, -adhu, -ichu, -chu, -en, -om, -kku
        const tanglishEndings = /(am|um|nga|adhu|athu|ichu|uchu|ren|ren|ven|vom|kku|ttu|la|le|oda|ava|ana|dhu)$/i;
        if (tanglishEndings.test(clean) && clean.length > 3) {
            return {
                raw: rawWord,
                clean,
                type: 'TAMIL',
                isFiller: TANGLISH_FILLERS.has(clean),
                isRepeat: false,
                reason: 'Tanglish Morphological Suffix'
            };
        }

        // 6. Default to English vocabulary word if standard ASCII latin
        return {
            raw: rawWord,
            clean,
            type: 'ENGLISH',
            isFiller: ENGLISH_FILLERS.has(clean),
            isRepeat: false,
            reason: 'General Vocabulary'
        };
    }

    /**
     * Complete NLP Processor for a given text input
     */
    function performNLPAnalysis(text, durationSecs = 0) {
        if (!text || !text.trim()) {
            return null;
        }

        const rawTokens = text.trim().split(/\s+/);
        const tokens = [];
        let tamilCount = 0;
        let englishCount = 0;
        let mixedCount = 0;
        const fillerFrequencyMap = {};
        const wordFrequencyMap = {};
        let totalFillers = 0;

        // Process token by token
        rawTokens.forEach((tok, index) => {
            const tokenInfo = classifyWord(tok);
            if (!tokenInfo.clean) return;

            // Track Language counts
            if (tokenInfo.type === 'TAMIL') tamilCount++;
            else if (tokenInfo.type === 'ENGLISH') englishCount++;
            else if (tokenInfo.type === 'MIXED') mixedCount++;

            // Track Fillers
            if (tokenInfo.isFiller) {
                totalFillers++;
                fillerFrequencyMap[tokenInfo.clean] = (fillerFrequencyMap[tokenInfo.clean] || 0) + 1;
            }

            // Track General Word Frequency for Repetition
            const normalizedLower = tokenInfo.clean.toLowerCase();
            wordFrequencyMap[normalizedLower] = (wordFrequencyMap[normalizedLower] || 0) + 1;

            tokens.push(tokenInfo);
        });

        const totalWords = tokens.length;
        if (totalWords === 0) return null;

        // Code-Switching Sequence & Transitions Detection
        let switchCount = 0;
        const transitionSequence = [];
        let lastType = null;

        tokens.forEach(tok => {
            if (tok.type !== 'PUNCT') {
                if (lastType && lastType !== tok.type) {
                    switchCount++;
                    transitionSequence.push({ from: lastType, to: tok.type });
                }
                lastType = tok.type;
            }
        });

        // Repeated Words Detection
        const repeatedWordsList = [];
        for (const [word, freq] of Object.entries(wordFrequencyMap)) {
            if (freq >= 2 && word.length > 2 && !['the', 'and', 'a', 'in', 'to', 'of'].includes(word)) {
                repeatedWordsList.push({ word, count: freq });
            }
        }
        repeatedWordsList.sort((a, b) => b.count - a.count);

        // Mark repeat flags in tokens
        tokens.forEach(tok => {
            if (wordFrequencyMap[tok.clean.toLowerCase()] >= 2 && tok.clean.length > 2) {
                tok.isRepeat = true;
            }
        });

        // Sentence Statistics
        const rawSentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 0);
        const totalSentences = Math.max(1, rawSentences.length);
        const sentenceLengths = rawSentences.map(s => s.trim().split(/\s+/).length);
        const avgWordsPerSentence = (totalWords / totalSentences).toFixed(1);
        const longestSentence = sentenceLengths.length > 0 ? Math.max(...sentenceLengths) : totalWords;
        const shortestSentence = sentenceLengths.length > 0 ? Math.min(...sentenceLengths) : totalWords;

        // Language Percentages
        const effectiveTamil = tamilCount + (mixedCount * 0.5);
        const effectiveEnglish = englishCount + (mixedCount * 0.5);
        const tamilPercent = Math.round((effectiveTamil / totalWords) * 100);
        const englishPercent = Math.max(0, 100 - tamilPercent);

        // Code-Mixing Index (CMI)
        // CMI = 100 * [1 - (max(w_ta, w_en) / total_words)] / [1 - (1 / N_langs)]
        const maxLangCount = Math.max(tamilCount, englishCount);
        const rawCmi = totalWords > 1 ? Math.round(((totalWords - maxLangCount) / totalWords) * 100) : 0;
        const cmiScore = Math.min(100, Math.max(0, rawCmi));

        // Speaking Speed (WPM)
        let wpm = 0;
        let speedCategory = 'Normal Pace';
        let speedClass = 'normal';

        if (durationSecs > 0) {
            wpm = Math.round((totalWords / durationSecs) * 60);
        } else {
            // Estimated reading duration if manual text
            const estimatedDuration = (totalWords / 130) * 60;
            wpm = 130;
        }

        if (wpm < 110) {
            speedCategory = '🔵 Slow Pace';
            speedClass = 'slow';
        } else if (wpm > 165) {
            speedCategory = '🟡 Fast Pace';
            speedClass = 'fast';
        } else {
            speedCategory = '🟢 Normal Pace';
            speedClass = 'normal';
        }

        // Summary, Semantic Intent & Keywords
        const { summary, domain, keywords } = generateTextSummary(text, tokens);

        // Correction Suggestions
        const { improvedEnglish, naturalTanglish } = generateSuggestions(text);

        // Communication Score (0 - 100)
        const { score: commScore, feedback: insightsList } = calculateCommunicationScore({
            totalWords,
            tamilPercent,
            englishPercent,
            switchCount,
            totalFillers,
            repeatedCount: repeatedWordsList.length,
            wpm
        });

        return {
            text,
            timestamp: new Date().toISOString(),
            formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            tokens,
            totalWords,
            charCount: text.length,
            tamilCount,
            englishCount,
            mixedCount,
            tamilPercent,
            englishPercent,
            switchCount,
            switchDensity: (switchCount / Math.max(1, totalWords)).toFixed(2),
            cmiScore,
            totalFillers,
            fillerFrequencyMap,
            repeatedWordsList,
            totalSentences,
            avgWordsPerSentence,
            longestSentence,
            shortestSentence,
            wpm,
            speedCategory,
            speedClass,
            durationSecs,
            summary,
            domain,
            keywords,
            improvedEnglish,
            naturalTanglish,
            commScore,
            insightsList
        };
    }

    /**
     * Rule-based Extractive Summary & Topic Classifier
     */
    function generateTextSummary(text, tokens) {
        const lower = text.toLowerCase();
        let domain = 'General Conversational';
        let summary = 'User is expressing conversational thoughts in mixed Tamil and English.';
        const keywords = new Set();

        // Topic Heuristics
        if (/college|exam|study|prepare|semester|class|degree|test|marks|school/i.test(lower)) {
            domain = 'Academic / College';
            summary = 'User is discussing college academics, upcoming exams, and preparation routines.';
        } else if (/job|interview|salary|office|client|meeting|presentation|work|manager|company/i.test(lower)) {
            domain = 'Career & Professional';
            summary = 'User is communicating work-related tasks, project meetings, or career plans.';
        } else if (/software|code|program|developer|app|bug|feature|laptop|system|tech/i.test(lower)) {
            domain = 'Technology & Software';
            summary = 'User is discussing software engineering, programming objectives, and tech activities.';
        } else if (/tired|break|sleep|rest|stress|relax|happy|sad|mood/i.test(lower)) {
            domain = 'Personal Mood & Wellness';
            summary = 'User is reflecting on their personal well-being, schedule, and fatigue levels.';
        } else if (/food|tea|coffee|hotel|eating|dinner|lunch|breakfast|hot|weather/i.test(lower)) {
            domain = 'Daily Life & Social';
            summary = 'User is chatting about everyday lifestyle, dining, or climate conditions.';
        }

        // Extract key salient words
        tokens.forEach(tok => {
            if (tok.clean.length > 4 && !tok.isFiller && !['because', 'tomorrow', 'having', 'really'].includes(tok.clean.toLowerCase())) {
                if (keywords.size < 5) keywords.add(tok.clean.toLowerCase());
            }
        });

        if (keywords.size === 0) {
            keywords.add('tanglish');
            keywords.add('speech');
        }

        return {
            domain,
            summary,
            keywords: Array.from(keywords)
        };
    }

    /**
     * Generate Smart Tanglish to Improved English & Natural Pure Tanglish Suggestions
     */
    function generateSuggestions(text) {
        const lower = text.trim().toLowerCase();

        // 1. Check exact predefined library
        const found = PREDEFINED_EXAMPLES.find(ex => lower.includes(ex.tanglish.toLowerCase()) || ex.tanglish.toLowerCase().includes(lower));
        if (found) {
            return {
                improvedEnglish: `“${found.english}”`,
                naturalTanglish: `“${found.naturalTanglish}”`
            };
        }

        // 2. Dynamic Rule-based English Translation & Tanglish Polishing Engine
        let enSugg = text;
        let taSugg = text;

        // Common Tanglish Word-to-English Mappings
        const translations = [
            [/\bnaan\b/gi, 'I'],
            [/\benakku\b/gi, 'to me / I have'],
            [/\bunakku\b/gi, 'to you'],
            [/\bavan\b/gi, 'he'],
            [/\baval\b/gi, 'she'],
            [/\bavanga\b/gi, 'they'],
            [/\bengalukku\b/gi, 'we have'],
            [/\bponum\b|\bpoganum\b/gi, 'need to go'],
            [/\bporen\b/gi, 'am going'],
            [/\bvaranum\b/gi, 'need to come'],
            [/\bvaren\b/gi, 'am coming'],
            [/\bpannanu?m\b/gi, 'need to do'],
            [/\bpanren\b/gi, 'am doing'],
            [/\bpannitu irukken\b/gi, 'am currently doing'],
            [/\bpadikkanum\b/gi, 'need to study'],
            [/\bpesanum\b/gi, 'need to speak'],
            [/\btired-aa irukku\b|\btired-aa iruken\b/gi, 'feeling exhausted'],
            [/\binteresting-aa irukku\b/gi, 'is very interesting'],
            [/\bsuper-aa irundhuchu\b/gi, 'was fantastic'],
            [/\bromba\b/gi, 'very'],
            [/\bkonjam\b/gi, 'a little'],
            [/\bsemma\b/gi, 'awesome'],
            [/\bnalaikku\b|\bnaalaikku\b/gi, 'tomorrow'],
            [/\binnaikku\b/gi, 'today'],
            [/\bnethu\b/gi, 'yesterday'],
            [/\bmudichitu\b/gi, 'after finishing'],
            [/\baana\b|\baanaal\b/gi, 'but'],
            [/\bkooda\b/gi, 'also'],
            [/\bseri\b|\bsari\b/gi, 'alright'],
            [/\bcollege-ku\b/gi, 'to college'],
            [/\bexam-ku\b/gi, 'for the exams'],
            [/\boffice-ku\b/gi, 'to office'],
            [/\bproject-ku\b/gi, 'for the project'],
            [/\binterview-ku\b/gi, 'for the interview'],
            [/\bmeeting-la\b/gi, 'in the meeting'],
            [/\boffice-la\b/gi, 'at the office']
        ];

        translations.forEach(([pattern, replacement]) => {
            enSugg = enSugg.replace(pattern, replacement);
        });

        // Clean up suggestion string
        enSugg = enSugg.replace(/\s+/g, ' ').trim();
        enSugg = enSugg.charAt(0).toUpperCase() + enSugg.slice(1);
        if (!/[.!?]$/.test(enSugg)) enSugg += '.';

        // Natural Tanglish Polish (replace clumsy English loanwords with pure or standard Tamil forms)
        taSugg = taSugg.replace(/\btomorrow\b/gi, 'nalaikku')
                       .replace(/\btoday\b/gi, 'innaikku')
                       .replace(/\byesterday\b/gi, 'nethu')
                       .replace(/\bactually\b/gi, 'unmaiyila')
                       .replace(/\bbasically\b/gi, 'adipadaiyila')
                       .replace(/\bvery\b/gi, 'romba')
                       .replace(/\bjob\b/gi, 'velai')
                       .replace(/\bwork\b/gi, 'vela')
                       .replace(/\s+/g, ' ').trim();
        if (!/[.!?]$/.test(taSugg)) taSugg += '.';

        return {
            improvedEnglish: `“${enSugg}”`,
            naturalTanglish: `“${taSugg}”`
        };
    }

    /**
     * Compute AI-based estimated communication score (0-100) and actionable insights
     */
    function calculateCommunicationScore({ totalWords, tamilPercent, englishPercent, switchCount, totalFillers, repeatedCount, wpm }) {
        let score = 84; // Baseline score
        const feedback = [];

        // 1. Vocabulary & Length Factor
        if (totalWords >= 8) {
            score += 4;
            feedback.push({ type: 'positive', text: 'Good sentence length and thought completion.' });
        } else {
            score -= 5;
            feedback.push({ type: 'warning', text: 'Brief response; try adding more descriptive context.' });
        }

        // 2. Language Mix Balance
        if (tamilPercent >= 30 && tamilPercent <= 70) {
            score += 5;
            feedback.push({ type: 'positive', text: 'Balanced Tamil-English code-switching harmony.' });
        } else if (tamilPercent > 85) {
            feedback.push({ type: 'positive', text: 'Dominant Tamil vocabulary with natural conversational tone.' });
        } else if (englishPercent > 85) {
            feedback.push({ type: 'positive', text: 'Dominant English vocabulary with fluent articulation.' });
        }

        // 3. Filler Word Evaluation
        const fillerRatio = totalFillers / Math.max(1, totalWords);
        if (totalFillers === 0) {
            score += 5;
            feedback.push({ type: 'positive', text: 'Clean speech with zero conversational filler words.' });
        } else if (fillerRatio <= 0.12) {
            score -= 2;
            feedback.push({ type: 'positive', text: 'Minimal filler words; speech flows smoothly.' });
        } else {
            const penalty = Math.min(18, Math.round(fillerRatio * 40));
            score -= penalty;
            feedback.push({ type: 'warning', text: `High filler density (${totalFillers} detected). Reduce words like 'actually', 'like', 'apdi'.` });
        }

        // 4. Repeated Words Penalty
        if (repeatedCount === 0) {
            score += 2;
            feedback.push({ type: 'positive', text: 'No redundant word repetitions detected.' });
        } else if (repeatedCount > 1) {
            score -= Math.min(10, repeatedCount * 3);
            feedback.push({ type: 'warning', text: 'Repeated words detected. Practice pacing to avoid hesitation.' });
        }

        // 5. Speed (WPM) alignment
        if (wpm >= 115 && wpm <= 160) {
            score += 3;
            feedback.push({ type: 'positive', text: 'Optimal speaking pacing for listener comprehension.' });
        } else if (wpm > 175) {
            score -= 4;
            feedback.push({ type: 'warning', text: 'Speaking speed is slightly fast; take pauses between clauses.' });
        } else if (wpm > 0 && wpm < 100) {
            score -= 4;
            feedback.push({ type: 'warning', text: 'Speaking speed is slow; try maintaining continuous rhythm.' });
        }

        // Clamp between 30 and 99
        score = Math.min(98, Math.max(35, score));

        return { score, feedback };
    }

    // ==========================================================================
    // 6. UI RENDERERS & DASHBOARD UPDATES
    // ==========================================================================

    /**
     * Updates All Dashboard Cards, Metrics, Tokens, Insights & Charts
     */
    function updateAnalysisUI(payload) {
        if (!payload) return;
        state.lastAnalyzedPayload = payload;

        // Quick Stats on Dashboard
        elements.quickStatTotalWords.textContent = payload.totalWords;
        elements.quickStatTamilWords.textContent = payload.tamilCount;
        elements.quickStatTamilRatio.textContent = `${payload.tamilPercent}%`;
        elements.quickStatEnglishWords.textContent = payload.englishCount;
        elements.quickStatEnglishRatio.textContent = `${payload.englishPercent}%`;
        elements.quickStatCodeSwitch.textContent = payload.switchCount;
        elements.quickStatFillers.textContent = payload.totalFillers;

        if (payload.totalFillers <= 1) {
            elements.quickStatFillerPill.textContent = 'Low';
            elements.quickStatFillerPill.className = 'stat-tag-pill';
        } else {
            elements.quickStatFillerPill.textContent = `${payload.totalFillers} detected`;
            elements.quickStatFillerPill.className = 'stat-tag-pill warning';
        }

        // Core Metrics Grid in Analytics View
        elements.resultTamilWords.textContent = payload.tamilCount;
        elements.resultTamilPercent.textContent = `${payload.tamilPercent}%`;
        elements.resultEnglishWords.textContent = payload.englishCount;
        elements.resultEnglishPercent.textContent = `${payload.englishPercent}%`;
        elements.resultMixedWords.textContent = payload.mixedCount;
        elements.resultMixedPercent.textContent = `${Math.round((payload.mixedCount / payload.totalWords) * 100)}%`;
        elements.resultTotalWords.textContent = payload.totalWords;
        elements.resultTotalChars.textContent = `${payload.charCount} chars`;

        // Code Switching Panel
        elements.cmiScoreBadge.textContent = `CMI: ${payload.cmiScore}%`;
        elements.resultSwitchCount.textContent = payload.switchCount;
        elements.resultSwitchDensity.textContent = `${payload.switchDensity} / word`;
        elements.ratioTamilText.textContent = `${payload.tamilPercent}%`;
        elements.ratioEnglishText.textContent = `${payload.englishPercent}%`;
        elements.ratioBarTamil.style.width = `${payload.tamilPercent}%`;
        elements.ratioBarEnglish.style.width = `${payload.englishPercent}%`;

        // Transition Sequence Flow Pills
        elements.transitionPillSequence.innerHTML = '';
        if (payload.tokens.length > 0) {
            let sequence = [];
            payload.tokens.forEach(tok => {
                if (tok.type !== 'PUNCT') {
                    if (sequence.length === 0 || sequence[sequence.length - 1] !== tok.type) {
                        sequence.push(tok.type);
                    }
                }
            });

            // Render up to first 6 transitions
            sequence.slice(0, 6).forEach((type, idx) => {
                const pill = document.createElement('span');
                pill.className = `flow-pill ${type === 'TAMIL' ? 'pill-ta' : type === 'ENGLISH' ? 'pill-en' : 'pill-ta'}`;
                pill.textContent = type === 'TAMIL' ? 'Tamil' : type === 'ENGLISH' ? 'English' : 'Mixed';
                elements.transitionPillSequence.appendChild(pill);

                if (idx < sequence.length - 1 && idx < 5) {
                    const arrow = document.createElement('i');
                    arrow.className = 'fa-solid fa-arrow-right flow-arrow';
                    elements.transitionPillSequence.appendChild(arrow);
                }
            });
        }

        // Render Token Stream Visualizer
        elements.tokenStreamContainer.innerHTML = '';
        payload.tokens.forEach(tok => {
            const tag = document.createElement('span');
            let typeClass = 'token-english';
            if (tok.isFiller) typeClass = 'token-filler';
            else if (tok.type === 'TAMIL') typeClass = 'token-tamil';
            else if (tok.type === 'MIXED') typeClass = 'token-mixed';

            tag.className = `token-tag ${typeClass} ${tok.isRepeat ? 'token-repeat' : ''}`;
            tag.title = `${tok.clean}: ${tok.reason || tok.type}`;
            tag.innerHTML = `${tok.raw} <span class="token-type-sub">${tok.isFiller ? 'filler' : tok.type.toLowerCase()}</span>`;
            elements.tokenStreamContainer.appendChild(tag);
        });

        // Filler Word Detection Panel
        elements.resultFillerTotal.textContent = `${payload.totalFillers} detected`;
        elements.fillerPillsContainer.innerHTML = '';
        const fillerEntries = Object.entries(payload.fillerFrequencyMap);
        if (fillerEntries.length === 0) {
            elements.fillerPillsContainer.innerHTML = '<span class="text-muted" style="font-size: 0.85rem; font-style: italic;">No filler words detected! Outstanding clarity.</span>';
        } else {
            fillerEntries.forEach(([fillerWord, count]) => {
                const pill = document.createElement('span');
                pill.className = 'filler-pill';
                pill.innerHTML = `<span class="filler-word">${fillerWord}</span> <span class="filler-freq">× ${count}</span>`;
                elements.fillerPillsContainer.appendChild(pill);
            });
        }

        // Repeated Word Analysis Panel
        elements.repeatedWordsBadge.textContent = `${payload.repeatedWordsList.length} Words Repeated`;
        elements.repeatWordsContainer.innerHTML = '';
        if (payload.repeatedWordsList.length === 0) {
            elements.repeatWordsContainer.innerHTML = '<span class="text-muted" style="font-size: 0.85rem; font-style: italic;">No repeated hesitation words detected.</span>';
        } else {
            const maxRepeat = Math.max(...payload.repeatedWordsList.map(r => r.count), 1);
            payload.repeatedWordsList.slice(0, 5).forEach(item => {
                const percent = Math.round((item.count / maxRepeat) * 100);
                const repeatItem = document.createElement('div');
                repeatItem.className = 'repeat-item';
                repeatItem.innerHTML = `
                    <div class="repeat-word-info">
                        <span class="repeat-word">${item.word}</span>
                        <span class="repeat-count">${item.count} times</span>
                    </div>
                    <div class="repeat-bar-track">
                        <div class="repeat-bar-fill" style="width: ${percent}%;"></div>
                    </div>
                `;
                elements.repeatWordsContainer.appendChild(repeatItem);
            });
        }

        // Speaking Speed & Sentence Statistics
        elements.resultSpeedWpm.textContent = payload.wpm;
        elements.speedCategoryText.textContent = payload.speedCategory;
        elements.speedStatusPill.className = `speed-status-indicator ${payload.speedClass}`;

        elements.statTotalSentences.textContent = payload.totalSentences;
        elements.statAvgWordsSentence.textContent = payload.avgWordsPerSentence;
        elements.statLongestSentence.textContent = `${payload.longestSentence} words`;
        elements.statShortestSentence.textContent = `${payload.shortestSentence} words`;

        // Speech Card footer stats
        if (elements.spDurationText) elements.spDurationText.textContent = `${payload.durationSecs.toFixed(1)}s`;
        if (elements.spWpmText) elements.spWpmText.textContent = `${payload.wpm} WPM`;
        if (elements.spWordCountText) elements.spWordCountText.textContent = payload.totalWords;

        // Text Summary
        elements.summaryDomainBadge.textContent = payload.domain;
        elements.resultSummaryText.textContent = `“${payload.summary}”`;
        elements.summaryKeywordsRow.innerHTML = '';
        payload.keywords.forEach(kw => {
            const kwTag = document.createElement('span');
            kwTag.className = 'kw-tag';
            kwTag.innerHTML = `<i class="fa-solid fa-hashtag"></i> ${kw}`;
            elements.summaryKeywordsRow.appendChild(kwTag);
        });

        // Improvement Suggestions
        elements.suggInputText.textContent = `“${payload.text}”`;
        elements.suggImprovedEnglish.textContent = payload.improvedEnglish;
        elements.suggNaturalTanglish.textContent = payload.naturalTanglish;

        // Communication Score & Insights
        elements.resultCommScore.textContent = payload.commScore;
        elements.insightsFeedbackList.innerHTML = '';
        payload.insightsList.forEach(insight => {
            const item = document.createElement('div');
            item.className = `insight-item ${insight.type}`;
            item.innerHTML = `
                <i class="fa-solid ${insight.type === 'positive' ? 'fa-circle-check' : 'fa-triangle-exclamation'} insight-icon"></i>
                <span>${insight.text}</span>
            `;
            elements.insightsFeedbackList.appendChild(item);
        });

        // Render Charts
        renderAllCharts();

        // Confetti celebration for high scores
        if (payload.commScore >= 88 && typeof confetti === 'function') {
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#ff2d75', '#8b5cf6', '#00f2fe']
            });
        }

        // Save to History
        if (state.settings.autoSaveHistory) {
            saveHistoryRecord(payload);
        }
    }

    /**
     * Executes the loading animation and renders the results
     */
    function executeAnalysis(text, duration = 0) {
        if (!text || !text.trim()) {
            showToast('Please enter or record some Tanglish text first.', 'error', 'fa-triangle-exclamation');
            return;
        }

        // Show AI Loader Overlay
        elements.analysisLoadingOverlay.classList.add('active');
        elements.loaderProgressFill.style.width = '0%';
        elements.loaderStatusText.textContent = 'Parsing acoustic & lexical Tanglish structure...';
        playTone(600, 'triangle', 0.2);

        setTimeout(() => {
            elements.loaderProgressFill.style.width = '45%';
            elements.loaderStatusText.textContent = 'Identifying Tamil-English code-switching boundaries...';
        }, 300);

        setTimeout(() => {
            elements.loaderProgressFill.style.width = '85%';
            elements.loaderStatusText.textContent = 'Computing communication score & summary insights...';
        }, 600);

        setTimeout(() => {
            elements.loaderProgressFill.style.width = '100%';
            const resultPayload = performNLPAnalysis(text, duration);
            updateAnalysisUI(resultPayload);

            // Hide overlay & navigate to Analytics tab
            elements.analysisLoadingOverlay.classList.remove('active');
            switchTab('analytics-view');
            showToast('Tanglish Analysis completed successfully!', 'success', 'fa-check');
            playTone(880, 'sine', 0.25);
        }, 900);
    }

    // ==========================================================================
    // 7. CHART.JS VISUALIZATION GENERATOR
    // ==========================================================================
    function renderAllCharts() {
        const payload = state.lastAnalyzedPayload;
        if (!payload || typeof Chart === 'undefined') return;

        // Custom chart default options for dark space aesthetic
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

        // --- Chart 1: Language Distribution Doughnut ---
        const ctxLang = document.getElementById('chartLangDist')?.getContext('2d');
        if (ctxLang) {
            if (state.charts.langDist) state.charts.langDist.destroy();
            state.charts.langDist = new Chart(ctxLang, {
                type: 'doughnut',
                data: {
                    labels: ['Tamil Words', 'English Words', 'Mixed / Suffix'],
                    datasets: [{
                        data: [payload.tamilCount, payload.englishCount, payload.mixedCount],
                        backgroundColor: [
                            'rgba(255, 45, 117, 0.85)',
                            'rgba(139, 92, 246, 0.85)',
                            'rgba(0, 242, 254, 0.85)'
                        ],
                        borderColor: '#0c0f1d',
                        borderWidth: 3,
                        hoverOffset: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, padding: 14 } }
                    },
                    cutout: '70%'
                }
            });
        }

        // --- Chart 2: Filler Word Frequency Bar ---
        const ctxFillers = document.getElementById('chartFillers')?.getContext('2d');
        if (ctxFillers) {
            if (state.charts.fillers) state.charts.fillers.destroy();

            const fillerLabels = Object.keys(payload.fillerFrequencyMap);
            const fillerData = Object.values(payload.fillerFrequencyMap);

            state.charts.fillers = new Chart(ctxFillers, {
                type: 'bar',
                data: {
                    labels: fillerLabels.length > 0 ? fillerLabels : ['No Fillers'],
                    datasets: [{
                        label: 'Occurrences',
                        data: fillerData.length > 0 ? fillerData : [0],
                        backgroundColor: 'rgba(245, 158, 11, 0.75)',
                        borderColor: '#f59e0b',
                        borderWidth: 1,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { precision: 0 },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        // --- Chart 3: Code-Switching Flow Timeline ---
        const ctxFlow = document.getElementById('chartSwitchingFlow')?.getContext('2d');
        if (ctxFlow) {
            if (state.charts.switchingFlow) state.charts.switchingFlow.destroy();

            const tokenLabels = payload.tokens.map((t, idx) => `W${idx + 1}: ${t.clean.slice(0, 5)}`);
            const langLevels = payload.tokens.map(t => {
                if (t.type === 'TAMIL') return 1;
                if (t.type === 'MIXED') return 2;
                return 3; // English
            });

            state.charts.switchingFlow = new Chart(ctxFlow, {
                type: 'line',
                data: {
                    labels: tokenLabels,
                    datasets: [{
                        label: 'Language State',
                        data: langLevels,
                        stepped: true,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        borderWidth: 2,
                        pointBackgroundColor: payload.tokens.map(t => t.type === 'TAMIL' ? '#ff2d75' : t.type === 'MIXED' ? '#00f2fe' : '#8b5cf6'),
                        pointRadius: 4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const val = ctx.raw;
                                    return val === 1 ? 'Tamil' : val === 2 ? 'Mixed' : 'English';
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: 0.5,
                            max: 3.5,
                            ticks: {
                                callback: (val) => val === 1 ? 'Tamil' : val === 2 ? 'Mixed' : val === 3 ? 'English' : ''
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { maxRotation: 45, minRotation: 45 }
                        }
                    }
                }
            });
        }

        // --- Chart 4: Linguistic Performance Radar ---
        const ctxRadar = document.getElementById('chartRadarMetrics')?.getContext('2d');
        if (ctxRadar) {
            if (state.charts.radarMetrics) state.charts.radarMetrics.destroy();

            const vocabDiversity = Math.min(100, Math.round((new Set(payload.tokens.map(t => t.clean.toLowerCase())).size / payload.totalWords) * 100));
            const clarityScore = Math.max(20, 100 - (payload.totalFillers * 8));
            const balanceScore = 100 - Math.abs(payload.tamilPercent - payload.englishPercent);
            const sentenceFlow = Math.min(100, Math.round((payload.totalWords / payload.totalSentences) * 10));

            state.charts.radarMetrics = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: ['Fluency', 'Vocab Richness', 'Clarity (No Fillers)', 'Tanglish Balance', 'Sentence Flow'],
                    datasets: [{
                        label: 'Score Profile',
                        data: [payload.commScore, vocabDiversity, clarityScore, balanceScore, sentenceFlow],
                        backgroundColor: 'rgba(255, 45, 117, 0.2)',
                        borderColor: '#ff2d75',
                        borderWidth: 2,
                        pointBackgroundColor: '#00f2fe'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { display: false },
                            grid: { color: 'rgba(255, 255, 255, 0.08)' },
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' }
                        }
                    }
                }
            });
        }
    }

    // ==========================================================================
    // 8. LIVE TEXT ANALYZER & TYPING LISTENER
    // ==========================================================================
    function updateLiveTextCounters() {
        const text = elements.tanglishTextInput.value || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);

        elements.liveWordCount.textContent = words.length;
        elements.liveCharCount.textContent = text.length;

        let liveTamil = 0;
        let liveEnglish = 0;
        let liveFillers = 0;

        words.forEach(w => {
            const classified = classifyWord(w);
            if (classified.type === 'TAMIL' || classified.type === 'MIXED') liveTamil++;
            else if (classified.type === 'ENGLISH') liveEnglish++;
            if (classified.isFiller) liveFillers++;
        });

        elements.liveTamilCount.textContent = liveTamil;
        elements.liveEnglishCount.textContent = liveEnglish;
        elements.liveFillerCount.textContent = liveFillers;
    }

    if (elements.tanglishTextInput) {
        elements.tanglishTextInput.addEventListener('input', updateLiveTextCounters);
    }

    if (elements.analyzeTextSubmitBtn) {
        elements.analyzeTextSubmitBtn.addEventListener('click', () => {
            const text = elements.tanglishTextInput.value;
            executeAnalysis(text, 0);
        });
    }

    if (elements.clearTextBtn) {
        elements.clearTextBtn.addEventListener('click', () => {
            elements.tanglishTextInput.value = '';
            updateLiveTextCounters();
            showToast('Text cleared.', 'info', 'fa-eraser');
        });
    }

    if (elements.pasteTextBtn) {
        elements.pasteTextBtn.addEventListener('click', async () => {
            try {
                const clipText = await navigator.clipboard.readText();
                elements.tanglishTextInput.value = clipText;
                updateLiveTextCounters();
                showToast('Pasted from clipboard!', 'success', 'fa-paste');
            } catch (err) {
                showToast('Unable to read clipboard. Please paste manually.', 'error', 'fa-triangle-exclamation');
            }
        });
    }

    // Tray Sample Buttons in Text Analyzer
    document.querySelectorAll('.tray-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const sampleText = pill.dataset.text;
            elements.tanglishTextInput.value = sampleText;
            updateLiveTextCounters();
            playTone(550, 'sine', 0.1);
        });
    });

    // Sample Example Buttons in Dashboard
    document.querySelectorAll('.sample-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sample = btn.dataset.sample;
            elements.tanglishTextInput.value = sample;
            updateLiveTextCounters();
            executeAnalysis(sample, 0);
        });
    });

    if (elements.quickSampleBtn) {
        elements.quickSampleBtn.addEventListener('click', () => {
            const randomSample = PREDEFINED_EXAMPLES[Math.floor(Math.random() * PREDEFINED_EXAMPLES.length)];
            elements.tanglishTextInput.value = randomSample.tanglish;
            updateLiveTextCounters();
            executeAnalysis(randomSample.tanglish, 0);
        });
    }

    // ==========================================================================
    // 9. SPEECH RECORDING & RECOGNITION (WEB SPEECH + MEDIARECORDER)
    // ==========================================================================
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    function initSpeechRecognition() {
        if (!SpeechRecognition) {
            elements.speechErrorBanner.style.display = 'flex';
            elements.speechErrorTitle.textContent = 'Web Speech API Not Supported';
            elements.speechErrorDesc.textContent = 'Your browser does not support SpeechRecognition natively. You can still use Text Analysis or manual audio testing.';
            return null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = state.settings.continuousSpeech;
        recognition.interimResults = true;
        recognition.lang = state.settings.speechLang;

        recognition.onstart = () => {
            elements.recordingStatusLabel.textContent = 'Listening to Tanglish...';
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            if (finalTranscript || interimTranscript) {
                elements.speechTranscriptionText.value = (elements.speechTranscriptionText.value + ' ' + finalTranscript).trim() + (interimTranscript ? ' ' + interimTranscript : '');
                state.currentTranscript = elements.speechTranscriptionText.value;
                updateSpeechFooterStats();
            }
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                elements.speechErrorBanner.style.display = 'flex';
                elements.speechErrorTitle.textContent = 'Microphone Access Denied';
                elements.speechErrorDesc.textContent = 'Please enable microphone access in your browser settings to use live voice analysis.';
            }
        };

        recognition.onend = () => {
            if (state.isRecording && state.settings.continuousSpeech) {
                try { recognition.start(); } catch (e) {}
            }
        };

        return recognition;
    }

    state.recognition = initSpeechRecognition();

    function updateSpeechFooterStats() {
        const text = elements.speechTranscriptionText.value || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const dur = Math.max(1, state.recordingDurationSeconds);
        const wpm = Math.round((wordCount / dur) * 60);

        elements.spWordCountText.textContent = wordCount;
        elements.spDurationText.textContent = `${dur.toFixed(1)}s`;
        elements.spWpmText.textContent = `${wpm} WPM`;
    }

    // Audio Context Waveform Visualizer
    function setupAudioVisualizer(stream) {
        try {
            state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = state.audioContext.createMediaStreamSource(stream);
            state.analyser = state.audioContext.createAnalyser();
            state.analyser.fftSize = 128;
            source.connect(state.analyser);

            const bufferLength = state.analyser.frequencyBinCount;
            state.dataArray = new Uint8Array(bufferLength);

            drawStudioWaveform();
        } catch (e) {
            console.warn('AudioContext setup error:', e);
        }
    }

    function drawStudioWaveform() {
        const canvas = elements.liveAudioWaveform;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        function renderFrame() {
            if (!state.isRecording && !state.analyser) {
                // Draw idle soothing wave
                drawIdleWave(ctx, width, height);
                state.animationFrameId = requestAnimationFrame(renderFrame);
                return;
            }

            state.animationFrameId = requestAnimationFrame(renderFrame);

            if (state.analyser && state.dataArray) {
                state.analyser.getByteFrequencyData(state.dataArray);
            }

            ctx.clearRect(0, 0, width, height);

            // Draw Frequency Bars
            const barWidth = (width / 32) - 2;
            let x = 0;

            for (let i = 0; i < 32; i++) {
                const barHeight = state.dataArray ? (state.dataArray[i] / 255) * height * 0.8 : 10;

                const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
                grad.addColorStop(0, '#00f2fe');
                grad.addColorStop(0.5, '#8b5cf6');
                grad.addColorStop(1, '#ff2d75');

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
                ctx.fill();

                x += barWidth + 2;
            }
        }

        renderFrame();
    }

    let wavePhase = 0;
    function drawIdleWave(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        wavePhase += 0.03;
        for (let x = 0; x < width; x += 5) {
            const y = (height / 2) + Math.sin(x * 0.02 + wavePhase) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    // Hero Waveform Animation
    function initHeroWaveform() {
        const canvas = elements.heroWaveformCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let phase = 0;

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            phase += 0.04;

            // Gradient line 1
            const grad1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
            grad1.addColorStop(0, '#ff2d75');
            grad1.addColorStop(0.5, '#8b5cf6');
            grad1.addColorStop(1, '#00f2fe');

            ctx.strokeStyle = grad1;
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 4) {
                const y = (canvas.height / 2) + Math.sin(x * 0.03 + phase) * 25 * Math.sin(x * 0.01);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Symmetrical wave
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 4) {
                const y = (canvas.height / 2) - Math.sin(x * 0.03 + phase) * 20 * Math.sin(x * 0.01);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            requestAnimationFrame(loop);
        }
        loop();
    }

    // Start Recording Action
    async function startRecording() {
        try {
            state.audioChunks = [];
            state.recordingDurationSeconds = 0;
            elements.speechTranscriptionText.value = '';
            state.currentTranscript = '';

            // Request Mic Stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            state.audioStream = stream;

            state.mediaRecorder = new MediaRecorder(stream);
            state.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) state.audioChunks.push(e.data);
            };

            state.mediaRecorder.onstop = () => {
                state.audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
                state.audioUrl = URL.createObjectURL(state.audioBlob);
                elements.recordedAudioElement.src = state.audioUrl;
                elements.audioPlayerWidget.style.display = 'flex';
                elements.deleteRecordBtn.disabled = false;
                elements.analyzeSpeechBtn.disabled = false;
            };

            state.mediaRecorder.start();

            // Start Web Speech Recognition if available
            if (state.recognition) {
                try { state.recognition.start(); } catch (e) {}
            }

            // Setup Visualizer
            setupAudioVisualizer(stream);

            // Update UI State
            state.isRecording = true;
            document.querySelector('.recording-studio-card').classList.add('recording-active');
            elements.recordingTimerBox.classList.add('is-recording');
            elements.startRecordBtn.disabled = true;
            elements.stopRecordBtn.disabled = false;
            elements.deleteRecordBtn.disabled = true;
            elements.analyzeSpeechBtn.disabled = true;

            // Timer
            state.recordingStartTime = Date.now();
            elements.recordingTimerInterval = setInterval(() => {
                const elapsedSecs = (Date.now() - state.recordingStartTime) / 1000;
                state.recordingDurationSeconds = elapsedSecs;
                const mins = Math.floor(elapsedSecs / 60).toString().padStart(2, '0');
                const secs = Math.floor(elapsedSecs % 60).toString().padStart(2, '0');
                elements.recordTimer.textContent = `${mins}:${secs}`;
                elements.recordingStatusLabel.textContent = 'Recording in progress...';
                updateSpeechFooterStats();
            }, 500);

            playTone(800, 'sine', 0.15);
            showToast('Microphone recording started. Speak now!', 'info', 'fa-microphone');

        } catch (err) {
            console.error('Error starting recording:', err);
            elements.speechErrorBanner.style.display = 'flex';
            elements.speechErrorTitle.textContent = 'Microphone Access Error';
            elements.speechErrorDesc.textContent = 'Could not access microphone. Please check permissions or use text mode.';
            showToast('Microphone access denied or unavailable.', 'error', 'fa-circle-xmark');
        }
    }

    // Stop Recording Action
    function stopRecording() {
        if (!state.isRecording) return;
        state.isRecording = false;

        // Stop MediaRecorder & Mic stream
        if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
            state.mediaRecorder.stop();
        }
        if (state.audioStream) {
            state.audioStream.getTracks().forEach(track => track.stop());
        }

        // Stop Recognition
        if (state.recognition) {
            try { state.recognition.stop(); } catch (e) {}
        }

        // Stop Timer
        clearInterval(elements.recordingTimerInterval);
        document.querySelector('.recording-studio-card').classList.remove('recording-active');
        elements.recordingTimerBox.classList.remove('is-recording');
        elements.recordingStatusLabel.textContent = 'Recording Finished';
        elements.startRecordBtn.disabled = false;
        elements.stopRecordBtn.disabled = true;
        elements.deleteRecordBtn.disabled = false;
        elements.analyzeSpeechBtn.disabled = false;

        playTone(400, 'sine', 0.15);
        showToast('Recording stopped.', 'success', 'fa-circle-stop');

        // Auto-analyze if enabled
        if (state.settings.autoAnalyze && elements.speechTranscriptionText.value.trim().length > 0) {
            setTimeout(() => {
                executeAnalysis(elements.speechTranscriptionText.value, state.recordingDurationSeconds);
            }, 500);
        }
    }

    // Delete Recording Action
    function deleteRecording() {
        state.audioChunks = [];
        state.audioBlob = null;
        state.audioUrl = null;
        elements.recordedAudioElement.src = '';
        elements.speechTranscriptionText.value = '';
        elements.recordTimer.textContent = '00:00';
        elements.recordingStatusLabel.textContent = 'Ready to Record';
        elements.audioPlayerWidget.style.display = 'none';
        elements.deleteRecordBtn.disabled = true;
        elements.analyzeSpeechBtn.disabled = true;
        updateSpeechFooterStats();
        showToast('Recording discarded.', 'info', 'fa-trash');
    }

    // Custom Audio Playback Player
    function toggleAudioPlayback() {
        const audio = elements.recordedAudioElement;
        if (!audio.src) return;

        if (audio.paused) {
            audio.play();
            elements.playAudioIcon.className = 'fa-solid fa-pause';
        } else {
            audio.pause();
            elements.playAudioIcon.className = 'fa-solid fa-play';
        }
    }

    if (elements.recordedAudioElement) {
        elements.recordedAudioElement.ontimeupdate = () => {
            const audio = elements.recordedAudioElement;
            const current = audio.currentTime;
            const total = audio.duration || 1;
            const pct = (current / total) * 100;
            elements.audioProgressBar.style.width = `${pct}%`;
            elements.audioDurationLabel.textContent = `${current.toFixed(1)}s / ${total.toFixed(1)}s`;
        };

        elements.recordedAudioElement.onended = () => {
            elements.playAudioIcon.className = 'fa-solid fa-play';
            elements.audioProgressBar.style.width = '0%';
        };
    }

    // Bind Recording Controls
    if (elements.startRecordBtn) elements.startRecordBtn.addEventListener('click', startRecording);
    if (elements.stopRecordBtn) elements.stopRecordBtn.addEventListener('click', stopRecording);
    if (elements.deleteRecordBtn) elements.deleteRecordBtn.addEventListener('click', deleteRecording);
    if (elements.playAudioBtn) elements.playAudioBtn.addEventListener('click', toggleAudioPlayback);

    if (elements.analyzeSpeechBtn) {
        elements.analyzeSpeechBtn.addEventListener('click', () => {
            executeAnalysis(elements.speechTranscriptionText.value, state.recordingDurationSeconds);
        });
    }

    if (elements.btnSubmitSpeechForAnalysis) {
        elements.btnSubmitSpeechForAnalysis.addEventListener('click', () => {
            executeAnalysis(elements.speechTranscriptionText.value, state.recordingDurationSeconds);
        });
    }

    if (elements.speechAnalyzeAgainBtn) {
        elements.speechAnalyzeAgainBtn.addEventListener('click', () => {
            executeAnalysis(elements.speechTranscriptionText.value, state.recordingDurationSeconds);
        });
    }

    if (elements.copySpeechTranscriptionBtn) {
        elements.copySpeechTranscriptionBtn.addEventListener('click', () => {
            const text = elements.speechTranscriptionText.value;
            if (text) {
                navigator.clipboard.writeText(text);
                showToast('Transcription copied to clipboard!', 'success', 'fa-copy');
            }
        });
    }

    // Text-to-Speech Replay
    if (elements.listenTranscriptBtn) {
        elements.listenTranscriptBtn.addEventListener('click', () => {
            const text = elements.speechTranscriptionText.value;
            if (!text) {
                showToast('No transcript to read aloud.', 'error', 'fa-volume-xmark');
                return;
            }
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
                showToast('Speaking transcription aloud...', 'info', 'fa-volume-high');
            }
        });
    }

    // Copy Suggestions Buttons
    if (elements.copyImprovedEnBtn) {
        elements.copyImprovedEnBtn.addEventListener('click', () => {
            const text = elements.suggImprovedEnglish.textContent.replace(/^“|”$/g, '');
            navigator.clipboard.writeText(text);
            showToast('Improved English copied!', 'success', 'fa-copy');
        });
    }

    if (elements.copyNaturalTaBtn) {
        elements.copyNaturalTaBtn.addEventListener('click', () => {
            const text = elements.suggNaturalTanglish.textContent.replace(/^“|”$/g, '');
            navigator.clipboard.writeText(text);
            showToast('Natural Tanglish copied!', 'success', 'fa-copy');
        });
    }

    // ==========================================================================
    // 10. LOCALSTORAGE HISTORY MANAGER
    // ==========================================================================
    const HISTORY_STORAGE_KEY = 'tanglish_nlp_history_v2';

    function getSavedHistory() {
        try {
            const data = localStorage.getItem(HISTORY_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    function saveHistoryRecord(recordPayload) {
        try {
            const history = getSavedHistory();
            // Store compact payload
            const item = {
                id: 'rec_' + Date.now(),
                timestamp: recordPayload.timestamp,
                dateStr: recordPayload.formattedDate,
                text: recordPayload.text,
                totalWords: recordPayload.totalWords,
                tamilPercent: recordPayload.tamilPercent,
                englishPercent: recordPayload.englishPercent,
                totalFillers: recordPayload.totalFillers,
                commScore: recordPayload.commScore,
                durationSecs: recordPayload.durationSecs
            };

            // Prepend latest item
            history.unshift(item);
            // Limit to max 30 records
            if (history.length > 30) history.pop();

            localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
            renderHistoryList();
        } catch (e) {
            console.warn('LocalStorage save error:', e);
        }
    }

    function renderHistoryList(filterQuery = '') {
        const history = getSavedHistory();
        elements.historyCounter.textContent = history.length;
        elements.historyCountSummary.textContent = `${history.length} sessions saved`;

        if (history.length === 0) {
            elements.historyListContainer.innerHTML = '';
            elements.emptyHistoryState.style.display = 'flex';
            return;
        }

        elements.emptyHistoryState.style.display = 'none';
        elements.historyListContainer.innerHTML = '';

        const filtered = filterQuery.trim()
            ? history.filter(item => item.text.toLowerCase().includes(filterQuery.toLowerCase()))
            : history;

        if (filtered.length === 0) {
            elements.historyListContainer.innerHTML = '<div class="text-center p-4 text-muted">No records match your search.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'history-item-card glass-card';
            card.innerHTML = `
                <div class="history-item-left">
                    <div class="history-item-date">
                        <i class="fa-regular fa-calendar"></i> ${item.dateStr}
                    </div>
                    <div class="history-item-snippet">
                        “${item.text.length > 70 ? item.text.slice(0, 70) + '...' : item.text}”
                    </div>
                    <div class="history-item-badges">
                        <span class="hist-badge b-words">${item.totalWords} words</span>
                        <span class="hist-badge b-ta">Tamil: ${item.tamilPercent}%</span>
                        <span class="hist-badge b-en">English: ${item.englishPercent}%</span>
                        <span class="hist-badge b-score">Score: ${item.commScore}/100</span>
                    </div>
                </div>
                <div class="history-item-actions">
                    <button class="btn-hist-del" title="Delete record" data-id="${item.id}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            // Clicking card re-runs analysis
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-hist-del')) return;
                elements.tanglishTextInput.value = item.text;
                updateLiveTextCounters();
                executeAnalysis(item.text, item.durationSecs || 0);
            });

            // Delete individual item
            const delBtn = card.querySelector('.btn-hist-del');
            delBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteHistoryItem(item.id);
            });

            elements.historyListContainer.appendChild(card);
        });
    }

    function deleteHistoryItem(id) {
        let history = getSavedHistory();
        history = history.filter(item => item.id !== id);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
        renderHistoryList(elements.historySearchInput.value);
        showToast('Record deleted.', 'info', 'fa-trash');
    }

    if (elements.clearAllHistoryBtn) {
        elements.clearAllHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all analysis history?')) {
                localStorage.removeItem(HISTORY_STORAGE_KEY);
                renderHistoryList();
                showToast('History cleared.', 'info', 'fa-trash');
            }
        });
    }

    if (elements.historySearchInput) {
        elements.historySearchInput.addEventListener('input', (e) => {
            renderHistoryList(e.target.value);
        });
    }

    // Export Analysis Report
    if (elements.exportReportBtn) {
        elements.exportReportBtn.addEventListener('click', () => {
            const payload = state.lastAnalyzedPayload;
            if (!payload) {
                showToast('No active analysis to export.', 'error', 'fa-triangle-exclamation');
                return;
            }

            const report = `
=====================================================
TANGLISH SPEECH & NLP ANALYSIS REPORT
TanglishAI Engine v2.4
Date: ${payload.formattedDate}
=====================================================

1. INPUT TRANSCRIPT
-------------------
"${payload.text}"

2. VOCABULARY & LANGUAGE BREAKDOWN
----------------------------------
- Total Words: ${payload.totalWords}
- Tamil Words: ${payload.tamilCount} (${payload.tamilPercent}%)
- English Words: ${payload.englishCount} (${payload.englishPercent}%)
- Mixed Suffix Words: ${payload.mixedCount}

3. CODE-SWITCHING METRICS
-------------------------
- Switching Transition Count: ${payload.switchCount}
- Code-Mixing Index (CMI): ${payload.cmiScore}%
- Switch Density: ${payload.switchDensity} per word

4. FILLERS & REPETITIONS
------------------------
- Total Fillers: ${payload.totalFillers}
- Filler Frequency: ${JSON.stringify(payload.fillerFrequencyMap)}
- Repeated Words: ${payload.repeatedWordsList.map(r => `${r.word} (${r.count}x)`).join(', ') || 'None'}

5. SPEECH PACING & SENTENCE STATS
---------------------------------
- Estimated Speed: ${payload.wpm} WPM (${payload.speedCategory})
- Total Sentences: ${payload.totalSentences}
- Avg Words/Sentence: ${payload.avgWordsPerSentence}

6. AI POLISH & SUGGESTIONS
--------------------------
- Improved English: ${payload.improvedEnglish}
- Natural Tanglish: ${payload.naturalTanglish}

7. ESTIMATED COMMUNICATION SCORE
--------------------------------
- Score: ${payload.commScore} / 100
- AI Summary: ${payload.summary}

=====================================================
Generated by Tanglish Speech Analyzer
=====================================================
            `.trim();

            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tanglish-analysis-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Analysis report downloaded!', 'success', 'fa-file-arrow-down');
        });
    }

    if (elements.printReportBtn) {
        elements.printReportBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ==========================================================================
    // 11. SETTINGS & PREFERENCES MANAGER
    // ==========================================================================
    function loadSettings() {
        const saved = localStorage.getItem('tanglish_settings');
        if (saved) {
            try {
                state.settings = { ...state.settings, ...JSON.parse(saved) };
            } catch (e) {}
        }

        elements.settingSpeechLang.value = state.settings.speechLang;
        elements.settingContinuousSpeech.checked = state.settings.continuousSpeech;
        elements.settingAutoAnalyze.checked = state.settings.autoAnalyze;
        elements.settingTargetWpm.value = state.settings.targetWpm;
        elements.targetWpmVal.textContent = `${state.settings.targetWpm} WPM`;
        elements.settingStrictFillers.checked = state.settings.strictFillers;
        elements.settingAutoSaveHistory.checked = state.settings.autoSaveHistory;
        elements.settingParticlesToggle.checked = state.settings.particles;
        elements.settingGlowToggle.checked = state.settings.glow;
        elements.settingSoundFxToggle.checked = state.settings.soundFx;
    }

    function saveSettings() {
        state.settings.speechLang = elements.settingSpeechLang.value;
        state.settings.continuousSpeech = elements.settingContinuousSpeech.checked;
        state.settings.autoAnalyze = elements.settingAutoAnalyze.checked;
        state.settings.targetWpm = parseInt(elements.settingTargetWpm.value, 10);
        state.settings.strictFillers = elements.settingStrictFillers.checked;
        state.settings.autoSaveHistory = elements.settingAutoSaveHistory.checked;
        state.settings.particles = elements.settingParticlesToggle.checked;
        state.settings.glow = elements.settingGlowToggle.checked;
        state.settings.soundFx = elements.settingSoundFxToggle.checked;

        if (state.recognition) {
            state.recognition.lang = state.settings.speechLang;
            state.recognition.continuous = state.settings.continuousSpeech;
        }

        localStorage.setItem('tanglish_settings', JSON.stringify(state.settings));
        showToast('Preferences saved successfully!', 'success', 'fa-floppy-disk');
        playTone(660, 'sine', 0.15);
    }

    if (elements.settingTargetWpm) {
        elements.settingTargetWpm.addEventListener('input', (e) => {
            elements.targetWpmVal.textContent = `${e.target.value} WPM`;
        });
    }

    if (elements.saveSettingsBtn) {
        elements.saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // ==========================================================================
    // 12. INTERACTIVE PARTICLES CONSTELLATION BACKGROUND
    // ==========================================================================
    function initParticles() {
        const canvas = elements.bgCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(50, Math.floor(width / 25));

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                radius: Math.random() * 2 + 1,
                color: ['rgba(255, 45, 117, 0.4)', 'rgba(139, 92, 246, 0.4)', 'rgba(0, 242, 254, 0.4)'][Math.floor(Math.random() * 3)]
            });
        }

        function animate() {
            if (!state.settings.particles) {
                ctx.clearRect(0, 0, width, height);
                requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connect nearby particles
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ==========================================================================
    // 13. INITIALIZATION & DEFAULT BOOTSTRAP
    // ==========================================================================
    function init() {
        loadSettings();
        renderHistoryList();
        initParticles();
        initHeroWaveform();
        drawStudioWaveform(); // start idle studio wave

        // Pre-load default initial analysis for immediate visual impact
        const defaultSample = "Naan tomorrow college-ku poganum because enakku project work irukku.";
        elements.tanglishTextInput.value = defaultSample;
        updateLiveTextCounters();

        const initialPayload = performNLPAnalysis(defaultSample, 4.2);
        updateAnalysisUI(initialPayload);
    }

    init();
});
