<div align="center">

![PicoCrypt Web Banner](https://img.shields.io/badge/PicoCrypt_Web-AES--256--GCM-00c896?style=for-the-badge&logo=shield&logoColor=black&labelColor=050508&color=00c896)

### 🔐 حماية بياناتك بأعلى معايير التشفير | Protect your data with top encryption standards

[![Made By IIDZII](https://img.shields.io/badge/Developed%20by-IIDZII-ff69b4?style=flat-square)](https://github.com/IIDZII)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web Crypto API](https://img.shields.io/badge/Web_Crypto-API-blueviolet?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🌍 English | [🇸🇦 العربية](#-العربية)

### 🛡️ About PicoCrypt Web
PicoCrypt Web is a professional, client-side encryption tool that runs entirely in your browser. It requires no servers, no backend, and no installation. Your files and texts never leave your device. It uses military-grade encryption (AES-256-GCM) combined with a robust key derivation function (PBKDF2-SHA256) to ensure your data is impenetrable, exporting to a custom secure `.pcdz` format.

### ✨ Features
- 🗄️ **File Encryption/Decryption**: Encrypt any file type into the secure `.pcdz` format.
- ✍️ **Text Encryption/Decryption**: Encrypt texts and export as a safe `PCDZ:Base64` string.
- 🔑 **Cryptographic Key Generator**: Generate 128-bit, 192-bit, or 256-bit hex keys.
- 🔒 **Secure Password Generator**: Create strong, customizable passwords.
- 🛡️ **100% Client-Side**: Zero server interaction. Your data stays on your machine.
- 🎨 **Modern UI/UX**: Glassmorphism design, responsive layout, and smooth animations.

### ⚙️ Technical Specifications & Cryptography
PicoCrypt doesn't just "encrypt"—it implements a structured, verifiable, and secure cryptographic pipeline using the native Web Crypto API.

| Component | Specification | Description |
| :--- | :--- | :--- |
| **Encryption Algorithm** | `AES-256-GCM` | Provides both Confidentiality and Integrity (Authenticated Encryption). |
| **Key Derivation** | `PBKDF2-SHA256` | Resistant to brute-force and rainbow table attacks. |
| **Iterations** | `100,000` | High iteration count to slow down cracking attempts. |
| **Salt** | `32 Bytes` (Random) | Ensures unique key derivation even with the same password. |
| **IV (Nonce)** | `12 Bytes` (Random) | Initialization Vector for GCM, unique per encryption operation. |
| **RNG** | `crypto.getRandomValues` | Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). |

### 📁 The `.pcdz` File Format
PicoCrypt uses a custom binary format to store encrypted data, ensuring metadata integrity and future compatibility.

```text
Offset  Length  Description
0       8       Magic Bytes: "PicCrypt" (ASCII)
8       4       Version: 1 (Uint32 Big-Endian)
12      32      Salt: 32 bytes (Random, for PBKDF2)
44      4       Iterations: 100000 (Uint32 Big-Endian)
48      12      IV: 12 bytes (Random, for AES-GCM)
60      ...     Ciphertext (Includes 16-byte GCM Auth Tag at the end)
```

### 🚀 How to Use
1. Clone the repository or download the `index.html` file.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. Choose between File, Text, or Key Generator tabs.
4. Enter your data and a strong password.
5. Click Encrypt/Decrypt!

---

## 🇸🇦 العربية

### 🛡️ حول PicoCrypt Web
بيكوكريبت ويب هي أداة تشفير احترافية تعمل بالكامل في متصفحك مباشرةً (Client-side). لا تتطلب خوادم، أو واجهة خلفية، أو تثبيت. ملفاتك ونصوصك لا تغادر جهازك أبداً. تستخدم الأداة معايير تشفير عسكرية (AES-256-GCM) مع دالة اشتقاق مفاتيح قوية (PBKDF2-SHA256) لضمان حماية بياناتك بشكل مطلق، وتصدرها بصيغة مخصصة وآمنة `.pcdz`.

### ✨ المميزات
- 🗄️ **تشفير وفك تشفير الملفات**: تشفير أي نوع من الملفات وتصديره بصيغة `.pcdz` الآمنة.
- ✍️ **تشفير وفك تشفير النصوص**: تشفير النصوص وتصديرها كنص آمن `PCDZ:Base64`.
- 🔑 **توليد المفاتيح التشفيرية**: توليد مفاتيح Hex بأطوال 128-bit أو 192-bit أو 256-bit.
- 🔒 **مولد كلمات المرور الآمنة**: إنشاء كلمات مرور قوية وقابلة للتخصيص.
- 🛡️ **تشفير محلي 100%**: لا يوجد أي تواصل مع الخوادم. بياناتك تبقى على جهازك.
- 🎨 **واجهة مستخدم حديثة**: تصميم زجاجي (Glassmorphism)، تخطيط متجاوب، وحركات سلسة.

### ⚙️ المواصفات التقنية والتشفير
بيكوكريبت لا يقوم بعملية "تشفير" فحسب، بل ينفذ مساراً تشفيرياً منظماً وقابلاً للتحقق وآمناً باستخدام واجهة برمجة تطبيقات تشفير الويب الأصلية (Web Crypto API).

| المكون | المواصفة | الوصف |
| :--- | :--- | :--- |
| **خوارزمية التشفير** | `AES-256-GCM` | توفر السرية والسلامة معاً (تشفير مصدق). |
| **اشتقاق المفتاح** | `PBKDF2-SHA256` | مقاوم لهجمات القوة الغاشمة والجداول القوسية. |
| **التكرارات** | `100,000` | عدد تكرارات عالي لإبطاء محاولات كسر كلمة المرور. |
| **الملح (Salt)** | `32 بايت` (عشوائي) | يضمن اشتقاق مفتاح فريد حتى مع استخدام نفس كلمة المرور. |
| **المتجه الأولي (IV)** | `12 بايت` (عشوائي) | متجه تهيئة لـ GCM، فريد لكل عملية تشفير. |
| **مولد الأرقام** | `crypto.getRandomValues` | مولد أرقام عشوائي آمن تشفيرياً (CSPRNG). |

### 📁 بنية صيغة ملف `.pcdz`
يستخدم بيكوكريبت صيغة ثنائية (Binary) مخصصة لتخزين البيانات المشفرة، مما يضمن سلامة البيانات الوصفية والتوافق المستقبلي.

```text
الإزاحة  الطول  الوصف
0       8       التوقيع السحري: "PicCrypt" (ASCII)
8       4       الإصدار: 1 (Uint32 Big-Endian)
12      32      الملح (Salt): 32 بايت (عشوائي، لـ PBKDF2)
44      4       التكرارات: 100000 (Uint32 Big-Endian)
48      12      المتجه الأولي (IV): 12 بايت (عشوائي، لـ AES-GCM)
60      ...     النص المشفر (يتضمن 16 بايت لوسم المصادقة GCM Auth Tag في النهاية)
```

### 🚀 كيفية الاستخدام
1. قم باستنساخ المستودع (Clone) أو تحميل ملف `index.html`.
2. افتح ملف `index.html` في أي متصفح ويب حديث (Chrome, Firefox, Safari, Edge).
3. اختر بين تبويبات الملفات، النصوص، أو مولد المفاتيح.
4. أدخل بياناتك وكلمة مرور قوية.
5. اضغط على تشفير أو فك التشفير!

---

<div align="center">

**Developed with 🖤 by [IIDZII](https://github.com/IIDZII) © 2026**

</div>