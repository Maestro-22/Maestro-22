import yts from 'yt-search';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) {
        return conn.reply(m.chat, '- * 🧞 اكتب اسم الفيديو الذي تريد البحث عنها في يوتيوب وتشغيلها*', m);
    }

    let res = await yts(text);
    let play = res.videos[0];

    if (!play) {
        throw `- *🔱 حــدث خــطــأ*`;
    }

    let { title, thumbnail, ago, timestamp, views, videoId, url } = play;

    let txt = '*✧━═══━⊰🎶⊱━═══━✧*\n';
    txt += `*❐⤶ العنوان ↜* _${title}_\n\n`;
    txt += `*❐⤶ رابط المقطع ↜* _https://www.youtube.com/watch?v=${videoId}_\n`;
    txt += '*✠ ── ✷ ─ ‹🕷️› ─ ✷ ── ✠*\n\n';
    txt += `*❐⤶ تم النشر منذ ↜* _${ago}_\n`;
    txt += `*❐⤶ مدة الفيديو ↜* _${timestamp}_\n`;
    txt += `*❐⤶ عدد المشاهدات ↜* _${views.toLocaleString()}_\n`;
    txt += `*✠ ── ✷ ─ ‹🕷️› ─ ✷ ── ✠*`;

    await conn.sendButton(m.chat, 
        txt, 
        '*ʙy:ᴛᴀɴᴊɪʀᴏ𖣬ʙᴏᴛ*', 
        thumbnail, 
        [
            ['🎧 تشغيل كصوت', `${usedPrefix}اغنية ${url}`],
            ['📄 تشغيل كملف صوتي', `${usedPrefix}شغل_كصوت ${text}`],
            ['🎥 تشغيل كفيديو', `${usedPrefix}شغل_كفيديو ${url}`],
            ['🎥 تشغيل ملف كفيديو', `${usedPrefix}شغل_كفيديو2 ${url}`]
        ], 
        m
    );

    // يمكنك إضافة أي رسالة هنا إذا كنت بحاجة
};

handler.help = ['play', 'play2', 'ytmp3'];
handler.tags = ['dl'];
handler.command = ['اغنيه'];

export default handler;
