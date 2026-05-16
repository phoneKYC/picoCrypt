/* ==================== الجسيمات ==================== */
var pCanvas = document.getElementById('particles-canvas');
var pCtx = pCanvas.getContext('2d');
var particlesArr = [];
var animFrameId = null;

function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
    } else {
        if (!animFrameId) animateParticles();
    }
});

function createParticle() {
    return {
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
    };
}

for (var i = 0; i < 60; i++) particlesArr.push(createParticle());

function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    var w = pCanvas.width, h = pCanvas.height;
    for (var i = 0; i < particlesArr.length; i++) {
        var p = particlesArr[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
            particlesArr[i] = createParticle();
            p = particlesArr[i];
        }
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(0,200,150,' + p.opacity + ')';
        pCtx.fill();
    }
    for (var i = 0; i < particlesArr.length; i++) {
        for (var j = i + 1; j < particlesArr.length; j++) {
            var dx = particlesArr[i].x - particlesArr[j].x;
            var dy = particlesArr[i].y - particlesArr[j].y;
            var dist = dx * dx + dy * dy;
            if (dist < 14400) {
                pCtx.beginPath();
                pCtx.moveTo(particlesArr[i].x, particlesArr[i].y);
                pCtx.lineTo(particlesArr[j].x, particlesArr[j].y);
                pCtx.strokeStyle = 'rgba(0,200,150,' + (0.06 * (1 - Math.sqrt(dist) / 120)) + ')';
                pCtx.lineWidth = 0.5;
                pCtx.stroke();
            }
        }
    }
    animFrameId = requestAnimationFrame(animateParticles);
}
animateParticles();

/* ==================== ظهور العناصر ==================== */
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.scroll-reveal').forEach(function(el) { revealObserver.observe(el); });

/* ==================== الحالة ==================== */
var fileMode = 'encrypt';
var selectedFile = null;
var currentKeyLength = 32;
var downloadBlob = null;
var downloadFileName = '';
var currentGeneratedKey = '';
var currentGeneratedPassword = '';
var isProcessing = false;

/* ==================== التبويبات ==================== */
function switchTab(tab) {
    // مسح البيانات الحساسة عند تبديل التبويب
    clearAll();
    if(document.getElementById('text-password')) document.getElementById('text-password').value = '';
    if(document.getElementById('text-input')) document.getElementById('text-input').value = '';
    if(document.getElementById('text-output')) document.getElementById('text-output').value = '';

    document.querySelectorAll('.tab-btn').forEach(function(b) {
        b.classList.remove('tab-active'); b.classList.add('text-gray-400');
    });
    var activeBtn = document.getElementById('tab-' + tab);
    activeBtn.classList.add('tab-active');
    activeBtn.classList.remove('text-gray-400');
    ['file', 'text', 'keygen'].forEach(function(t) {
        document.getElementById('panel-' + t).classList.toggle('hidden', t !== tab);
    });
}

/* ==================== تبديل الوضع ==================== */
function toggleMode() {
    // مسح كامل للبيانات السابقة لمنع الخلط
    clearAll();

    var toggle = document.getElementById('mode-toggle');
    var btnText = document.getElementById('action-btn-text');
    var iconSvg = document.getElementById('action-icon');

    if (fileMode === 'encrypt') {
        fileMode = 'decrypt';
        toggle.classList.add('decrypt');
        btnText.textContent = 'فك تشفير الملف';
        iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>';
    } else {
        fileMode = 'encrypt';
        toggle.classList.remove('decrypt');
        btnText.textContent = 'تشفير الملف';
        iconSvg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>';
    }
}

/* ==================== التعامل مع الملفات ==================== */
var dropZone = document.getElementById('file-drop-zone');
dropZone.addEventListener('dragover', function(e) { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', function() { dropZone.classList.remove('drag-over'); });
dropZone.addEventListener('drop', function(e) {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

function handleFileSelect(event) {
    if (event.target.files.length > 0) handleFile(event.target.files[0]);
}

function handleFile(file) {
    selectedFile = file;
    document.getElementById('file-name').textContent = file.name || 'ملف';
    document.getElementById('file-size').textContent = formatFileSize(file.size);
    document.getElementById('file-info').classList.remove('hidden');
    document.getElementById('file-result').classList.add('hidden');
    dropZone.classList.add('hidden');
    downloadBlob = null;
    downloadFileName = '';
}

function clearFile() {
    selectedFile = null;
    document.getElementById('file-input').value = '';
    document.getElementById('file-info').classList.add('hidden');
    document.getElementById('file-result').classList.add('hidden');
    dropZone.classList.remove('hidden');
    downloadBlob = null; downloadFileName = '';
}

function clearAll() {
    clearFile();
    document.getElementById('file-password').value = '';
    document.getElementById('strength-bar').style.width = '0%';
    document.getElementById('strength-text').textContent = '--';
    document.getElementById('file-progress').classList.add('hidden');
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('progress-percent').textContent = '0%';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024; var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    var idx = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, idx)).toFixed(2)) + ' ' + sizes[idx];
}

/* ==================== صيغة PicoCrypt (.pcdz) ==================== */
var MAGIC = new Uint8Array([0x50, 0x69, 0x63, 0x43, 0x72, 0x79, 0x70, 0x74]);
var MAGIC_STR = 'PicCrypt';
var PC_VERSION = 1;
var PC_ITERATIONS = 100000;
var HEADER_SIZE = 60;

function uint32ToBE(n) {
    return new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}

function uint32FromBE(arr) {
    return ((arr[0] << 24) | (arr[1] << 16) | (arr[2] << 8) | arr[3]) >>> 0;
}

function uint8ToBase64(bytes) {
    var binary = '';
    for (var i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

async function deriveKey(password, salt, iterations) {
    iterations = iterations || PC_ITERATIONS;
    var enc = new TextEncoder();
    var keyMaterial = await crypto.subtle.importKey(
        'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
    );
    return await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: iterations, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptFilePico(file, password, onProgress) {
    if (onProgress) onProgress(5, 'قراءة الملف...');
    var fileData = await file.arrayBuffer();
    
    if (onProgress) onProgress(20, 'توليد المعاملات...');
    var salt = crypto.getRandomValues(new Uint8Array(32));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    
    if (onProgress) onProgress(25, 'اشتقاق المفتاح...');
    var key = await deriveKey(password, salt);
    
    if (onProgress) onProgress(60, 'تشفير البيانات...');
    var encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, fileData);
    
    if (onProgress) onProgress(90, 'بناء الملف...');
    var ctBytes = new Uint8Array(encrypted);
    var result = new Uint8Array(HEADER_SIZE + ctBytes.length);

    result.set(MAGIC, 0);
    result.set(uint32ToBE(PC_VERSION), 8);
    result.set(salt, 12);
    result.set(uint32ToBE(PC_ITERATIONS), 44);
    result.set(iv, 48);
    result.set(ctBytes, 60);

    if (onProgress) onProgress(100, 'اكتمل التشفير!');
    return result;
}

async function decryptFilePico(file, password, onProgress) {
    if (onProgress) onProgress(5, 'قراءة الملف...');
    var data = new Uint8Array(await file.arrayBuffer());
    
    if (onProgress) onProgress(20, 'تحليل الملف...');
    if (data.byteLength < HEADER_SIZE + 16) throw new Error('الملف تالف — الحجم صغير جداً');

    var magicStr = String.fromCharCode.apply(null, data.slice(0, 8));
    if (magicStr !== MAGIC_STR) throw new Error('ليس ملف PicoCrypt صالح (.pcdz)');

    var version = uint32FromBE(data.slice(8, 12));
    if (version !== PC_VERSION) throw new Error('إصدار غير مدعوم: ' + version);

    var salt = new Uint8Array(data.slice(12, 44));
    var iterations = uint32FromBE(data.slice(44, 48));
    var iv = new Uint8Array(data.slice(48, 60));
    var ciphertext = new Uint8Array(data.slice(60));

    if (ciphertext.byteLength === 0) throw new Error('لا توجد بيانات مشفرة في الملف');

    if (onProgress) onProgress(30, 'اشتقاق المفتاح...');
    var key = await deriveKey(password, salt, iterations);
    
    if (onProgress) onProgress(70, 'فك التشفير...');
    try {
        var decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ciphertext);
        if (onProgress) onProgress(100, 'اكتمل فك التشفير!');
        return new Uint8Array(decrypted);
    } catch (e) {
        throw new Error('كلمة المرور غير صحيحة أو الملف تالف');
    }
}

async function encryptText(text, password) {
    var salt = crypto.getRandomValues(new Uint8Array(32));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var key = await deriveKey(password, salt);

    var enc = new TextEncoder();
    var data = enc.encode(text);
    var encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, data);

    var ctBytes = new Uint8Array(encrypted);
    var combined = new Uint8Array(HEADER_SIZE + ctBytes.length);
    combined.set(MAGIC, 0);
    combined.set(uint32ToBE(PC_VERSION), 8);
    combined.set(salt, 12);
    combined.set(uint32ToBE(PC_ITERATIONS), 44);
    combined.set(iv, 48);
    combined.set(ctBytes, 60);

    return 'PCDZ:' + uint8ToBase64(combined);
}

async function decryptText(encoded, password) {
    if (!encoded.startsWith('PCDZ:')) throw new Error('النص غير مشفر بصيغة PicoCrypt');

    var b64 = encoded.slice(5);
    var data;
    try {
        var raw = atob(b64);
        data = new Uint8Array(raw.length);
        for (var i = 0; i < raw.length; i++) data[i] = raw.charCodeAt(i);
    } catch (e) {
        throw new Error('البيانات المشفرة تالفة');
    }

    if (data.byteLength < HEADER_SIZE + 16) throw new Error('البيانات غير كافية');

    var magicStr = String.fromCharCode.apply(null, data.slice(0, 8));
    if (magicStr !== MAGIC_STR) throw new Error('تنسيق غير صالح');

    var salt = new Uint8Array(data.slice(12, 44));
    var iterations = uint32FromBE(data.slice(44, 48));
    var iv = new Uint8Array(data.slice(48, 60));
    var ciphertext = new Uint8Array(data.slice(60));

    var key = await deriveKey(password, salt, iterations);

    try {
        var decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ciphertext);
        return new TextDecoder().decode(decrypted);
    } catch (e) {
        throw new Error('كلمة المرور غير صحيحة');
    }
}

/* ==================== معالجة الملف ==================== */
async function processFile() {
    if (isProcessing) return;

    var password = document.getElementById('file-password').value;
    if (!selectedFile) { showToast('يرجى اختيار ملف أولاً'); return; }
    if (!password) { showToast('يرجى إدخال كلمة المرور'); return; }
    if (password.length < 4) { showToast('كلمة المرور قصيرة جداً (4 أحرف على الأقل)'); return; }

    var btn = document.getElementById('file-action-btn');
    var btnText = document.getElementById('action-btn-text');
    var progressDiv = document.getElementById('file-progress');
    var progressFill = document.getElementById('progress-fill');
    var progressLabel = document.getElementById('progress-label');
    var progressPercent = document.getElementById('progress-percent');
    var resultDiv = document.getElementById('file-result');

    isProcessing = true;
    btn.disabled = true;
    var originalText = btnText.textContent;
    btnText.textContent = 'جاري المعالجة...';

    progressDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    progressFill.style.width = '0%';

    function onProgress(pct, label) {
        progressFill.style.width = pct + '%';
        progressPercent.textContent = pct + '%';
        if (label) progressLabel.textContent = label;
    }

    try {
        var result;
        var fileName;

        if (fileMode === 'encrypt') {
            result = await encryptFilePico(selectedFile, password, onProgress);
            fileName = selectedFile.name + '.pcdz';
        } else {
            result = await decryptFilePico(selectedFile, password, onProgress);
            fileName = selectedFile.name.replace(/\.pcdz$/, '') || 'decrypted_file';
        }

        downloadBlob = new Blob([result]);
        downloadFileName = fileName;

        setTimeout(function() {
            resultDiv.classList.remove('hidden');
            document.getElementById('result-title').textContent = fileMode === 'encrypt' ? 'تم التشفير بنجاح!' : 'تم فك التشفير بنجاح!';
            document.getElementById('result-desc').textContent = 'الحجم: ' + formatFileSize(result.byteLength) + ' — ' + fileName;
        }, 200);

    } catch (error) {
        progressDiv.classList.add('hidden');
        showToast(error.message);
    } finally {
        isProcessing = false;
        btn.disabled = false;
        btnText.textContent = originalText;
    }
}

/* ==================== التحميل ==================== */
function triggerDownload() {
    if (!downloadBlob || !downloadFileName) { showToast('لا يوجد ملف للتحميل'); return; }

    var url = URL.createObjectURL(downloadBlob);
    var link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(function() {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 200);

    showToast('جاري تحميل: ' + downloadFileName);
}

/* ==================== معالجة النص ==================== */
async function processText(mode) {
    var input = document.getElementById('text-input').value;
    var password = document.getElementById('text-password').value;
    if (!input.trim()) { showToast('يرجى إدخال نص'); return; }
    if (!password) { showToast('يرجى إدخال كلمة المرور'); return; }

    var output = document.getElementById('text-output');
    output.value = 'جاري المعالجة...';

    try {
        var result;
        if (mode === 'encrypt') {
            result = await encryptText(input, password);
        } else {
            result = await decryptText(input, password);
        }
        output.value = result;
        showToast(mode === 'encrypt' ? 'تم التشفير بنجاح' : 'تم فك التشفير بنجاح');
    } catch (error) {
        output.value = '';
        showToast(error.message);
    }
}

function copyText() {
    var output = document.getElementById('text-output').value;
    if (output && output !== 'جاري المعالجة...') {
        navigator.clipboard.writeText(output).then(function() { showToast('تم نسخ النص'); });
    }
}

/* ==================== توليد المفاتيح وكلمات المرور ==================== */
function setKeyLength(len) {
    currentKeyLength = len;
    document.querySelectorAll('.key-len-btn').forEach(function(b) {
        b.classList.remove('tab-active');
        b.classList.add('border', 'border-gray-700', 'text-gray-400');
    });
    var btn = document.querySelector('.key-len-btn[data-len="' + len + '"]');
    btn.classList.add('tab-active');
    btn.classList.remove('border-gray-700', 'text-gray-400');
}

function generateKey() {
    var display = document.getElementById('generated-key');
    display.textContent = 'جاري التوليد...';

    var randomBytes = crypto.getRandomValues(new Uint8Array(currentKeyLength));
    var hex = Array.from(randomBytes, function(b) {
        return b.toString(16).padStart(2, '0');
    }).join('');
    currentGeneratedKey = hex;

    var chars = '0123456789abcdef';
    var iterations = 0;
    var maxIter = 12;

    var interval = setInterval(function() {
        var animated = '';
        var revealCount = Math.floor(iterations * (hex.length / maxIter));
        for (var i = 0; i < hex.length; i++) {
            animated += (i < revealCount) ? hex[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        display.textContent = animated;
        iterations++;
        if (iterations >= maxIter) {
            clearInterval(interval);
            display.textContent = hex;
            showToast('تم توليد المفتاح');
        }
    }, 50);
}

function generatePassword() {
    var length = parseInt(document.getElementById('pass-length').value);
    var chars = '';
    if (document.getElementById('pass-upper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('pass-lower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('pass-numbers').checked) chars += '0123456789';
    if (document.getElementById('pass-symbols').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    if (!chars) { showToast('اختر مجموعة أحرف واحدة على الأقل'); return; }

    var randomValues = crypto.getRandomValues(new Uint8Array(length));
    var password = '';
    for (var i = 0; i < length; i++) password += chars[randomValues[i] % chars.length];

    currentGeneratedPassword = password;
    document.getElementById('generated-password').textContent = password;
}

function copyGeneratedKey() {
    if (!currentGeneratedKey) { showToast('لا يوجد مفتاح للنسخ'); return; }
    navigator.clipboard.writeText(currentGeneratedKey).then(function() { showToast('تم نسخ المفتاح'); });
}

function copyGeneratedPassword() {
    if (!currentGeneratedPassword) { showToast('لا توجد كلمة مرور للنسخ'); return; }
    navigator.clipboard.writeText(currentGeneratedPassword).then(function() { showToast('تم نسخ كلمة المرور'); });
}

/* ==================== أدوات مساعدة ==================== */
function togglePassword(id) {
    var el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
}

function checkPasswordStrength(password) {
    var bar = document.getElementById('strength-bar');
    var text = document.getElementById('strength-text');
    if (!password) {
        bar.style.width = '0%';
        bar.className = 'h-full rounded-full transition-all duration-300';
        text.textContent = '--';
        return;
    }
    var score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    var strength, percent, colorClass;
    if (score <= 2) { strength = 'ضعيفة'; percent = 25; colorClass = 'strength-weak'; }
    else if (score <= 3) { strength = 'متوسطة'; percent = 50; colorClass = 'strength-fair'; }
    else if (score <= 4) { strength = 'جيدة'; percent = 75; colorClass = 'strength-good'; }
    else { strength = 'قوية جداً'; percent = 100; colorClass = 'strength-strong'; }

    bar.style.width = percent + '%';
    bar.className = 'h-full rounded-full transition-all duration-300 ' + colorClass;
    text.textContent = strength;
}

var toastTimer = null;
function showToast(message) {
    var toast = document.getElementById('toast');
    document.getElementById('toast-text').textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3000);
}

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});