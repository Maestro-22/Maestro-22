import axios from 'axios';

const handler = async (m, { conn, text }) => {
    if (!text) {
        // إرسال الصورة عندما يكتب الأمر بدون اسم التطبيق
        return conn.sendMessage(m.chat, {
            image: { url: 'https://qu.ax/pqbVH.jpg' },
            caption: "🧞‍♂️ اكتب اسم التطبيق مثل:\n.تطبيق Picsart مهكر"
        }, { quoted: m });
    }

    try {
        m.reply("لحظة، أجيب لك التطبيق...🧞");

        let { data } = await axios({
            method: 'GET',
            url: `https://manaxu-seven.vercel.app/api/tools/apk?query=${encodeURIComponent(text)}`
        });

        // تحقق من وجود نتيجة
        if (!data.result) {
            return m.reply("عذرًا، لم أتمكن من العثور على التطبيق.");
        }

        const { name, download } = data.result;

        // إعداد الرسالة مع التطبيق
        let message = `
        🎉 تم تحميل التطبيق! استمتع! 🧞
        🌟 إذا واجهت أي مشكلة، لا تتردد في إخباري!
        `;

        // إرسال ملف التطبيق مع الرسالة
        await conn.sendMessage(m.chat, {
            document: { url: download },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption: message
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("عذرًا، صار خطأ أثناء تنزيل التطبيق. جرب مرة ثانية.");
    }
};

handler.command = handler.help = ["تطبيق"];
handler.tags = ["tools"];

export default handler;
