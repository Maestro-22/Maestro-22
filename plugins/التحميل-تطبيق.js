import axios from 'axios';

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply("🧞‍♂️يا طيب، اكتب اسم التطبيق اللي تبغى تحمله!");

    try {
        m.reply("لحظة، جالس أجيب لك التطبيق🧞‍♂️... انتظر شوي بس!");

        let { data } = await axios({
            method: 'GET',
            url: `https://manaxu-seven.vercel.app/api/tools/apk?query=${encodeURIComponent(text)}`
        });

        const { name, type, size, url, date, hacked, download } = data.result;

        // إرسال ملف التطبيق
        await conn.sendMessage(m.chat, {
            document: { url: download },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption: null
        }, { quoted: m });

        // عرض التفاصيل بعد التحميل
        let details = `*الاسم:* ${name}\n*النوع:* ${type}\n*الحجم:* ${size}\n*الموقع:* ${url}\n*تاريخ الإصدار:* ${date}\n*مهكر:* ${hacked ? 'نعم' : 'لا'}`;

        m.reply(`تم تحميل التطبيق بنجاح! إليك التطبيق:\n\n${details}`);

    } catch (e) {
        console.error(e);
        m.reply("عذرًا، صار خطأ أثناء تنزيل التطبيق. جرب مرة ثانية.");
    }
};

handler.command = handler.help = ["تطبيق"];
handler.tags = ["tools"];

export default handler;
