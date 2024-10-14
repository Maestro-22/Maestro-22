let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*[❗تحذير❗] ادخل مشكلتك و بلاغك*\n\n*مثال:*\n*${usedPrefix + command} مرحباً سيدي المصعبي${usedPrefix}كيف اخبارك*`;
    if (text.length < 10) throw `*[❗تحذير❗] البلاغ لا يقل عن عشرة أحرف*`;
    if (text.length > 1000) throw `*[❗تحذير❗] البلاغ لا يزيد عن ألف حرف*`;

    // الحصول على التاريخ والوقت الحالي بتوقيت اليمن
    let date = new Date();
    // ضبط الوقت ليكون بتوقيت اليمن (UTC+3)
    date.setHours(date.getHours() + 3); // إضافة 3 ساعات للتوقيت اليمني
    let day = date.toLocaleDateString('ar-EG'); // صيغة التاريخ
    let options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    let time = date.toLocaleTimeString('ar-EG', options); // صيغة الوقت

    // الحصول على البلد من الرقم
    let phoneNumber = m.sender.split('@')[0]; // رقم المستخدم بدون @
    let countryCode = phoneNumber.slice(0, 3); // استخراج رمز البلد
    let country = getCountryFromCode(countryCode); // جلب اسم الدولة

    // إعداد البلاغ بتنسيق محسّن
    let teks = `*🧞‍♂️* *\`『 ❒═「 إبلاغ مهم 」═❒ 』\`*\n` +
               `*┏━━━━━━━━━━━┓*\n` +
               `*┃* *📲 الرقم:* wa.me/${phoneNumber}\n` +
               `*┃* *👤 الاسم:* ${m.pushName || 'مجهول'}\n` +
               `*┃* *📅 التاريخ:* ${day}\n` +
               `*┃* *🕒 الوقت:* ${time}\n` +
               `*┃* *🌍 البلد:* ${country}\n` +
               `*┗━━━━━━━━━━━┛*\n` +
               `*┏━━[ نص البلاغ ]━━*\n` +
               `*┃* *\`『 ${text} 』\`*\n` +
               `*┗━━━━━━━━━━*\n`;

    // إرسال الرسالة للمطورين
    let developers = ['967738512629@s.whatsapp.net', '967738512629@s.whatsapp.net'];
    for (let dev of developers) {
        conn.reply(dev, m.quoted ? teks + m.quoted.text : teks, null, { contextInfo: { mentionedJid: [m.sender] } });
    }

    // الرد على المستخدم
    m.reply(`*🧞‍♂️* *\`『 تم إبلاغ المطور 』\`*`);
}

// دالة للحصول على اسم الدولة من رمز البلد
function getCountryFromCode(code) {
    const countryCodes = {
        '967': 'اليمن',
        '201': 'مصر',
        '966': 'السعودية',
        '971': 'الإمارات',
        '968': 'عُمان',
        '965': 'الكويت',
        '964': 'العراق',
        // إضافة المزيد من رموز الدول حسب الحاجة
    };
    return countryCodes[code] || 'غير معروف';
}

handler.help = ['reporte', 'request'].map(v => v + ' <teks>');
handler.tags = ['info'];
handler.command = /^(report|بلاغ|بلغ|ابلاغ|bug|report-owner|reportes)$/i;
export default handler;
