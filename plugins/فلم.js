let handler = async (m, { conn }) => {
    // ارسال رد فعل
    await conn.sendMessage(m.chat, { react: { text: '📽️', key: m.key } });

    // اختيار فيلم عشوائي
    let randomMovie = pickRandom(global.bxviu);

    // نص الرسالة مع الزر
    const captionn = `*ارشحلك تشوف⚡*:\n*ꔹ━━━━━ꔹ❰ افلام اكشن ❱ꔹ━━━━━ꔹ*\n*『${randomMovie}』*\n*ꔹ━━━━━ꔹ❰ 𝐆𝐎𝐉𝐎⚡𝐁𝐎𝐓 ❱*`;

    const link = ''; 

    // ارسال الرسالة مع الزر
    await conn.sendButton(m.chat, captionn, ' > PLUTO | 🐼❤️', link, [['🔄 فلم كمان ✨📽️', '.فيلم-اكشن']], m);
}

handler.help = ['Z O R O'];
handler.tags = ['fun'];
handler.command = /فيلم-اكشن|اكشن|action|action$/i;

export default handler;

// دالة لاختيار عنصر عشوائي من القائمة
function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())];
}

// قائمة الأفلام
global.bxviu = [
    "Tenet • 2020", "Gods of Egypt • 2016", "Man of Steel • 2013", 
    "Batman v Superman: Dawn of Justice • 2016", "Watchmen • 2009", 
    "Kill Bill: Vol. 1 • 2003", "Kill Bill: Vol. 2 • 2004", 
    "Die Hard • 1988", "Jumanji: Welcome to the Jungle • 2017", 
    "Ronin • 1998", "Mortal Kombat • 2021", "V for Vendetta • 2005", 
    "Gemini Man • 2019", "Suicide Squad • 2016", "The Gentleman • 2019", 
    "Mad Max: Fury Road • 2015", "Heat • 1995", "Inception • 2010", 
    "The Matrix • 1999", "Memento • 2000", "Prisoners • 2013", 
    "Catch Me If You Can • 2002", "Child 44 • 2015", 
    "The Tourist • 2010", "The Revenant • 2015", "Asuran", 
    "Harakiri", "Seven Samurai", "Gladiator", "Léon: The Professional", 
    "Terminator 2", "Fury", "No Country for Old Men", 
    "Moonfall • 2022", "The Adam Project • 2022", "Blacklight • 2022", 
    "Last Looks • 2022", "Old Guard • 2020", "No Time To Die • 2022", 
    "The Contract • 2006", "Saving Private Ryan • 1998", 
    "Terminator 2 • 1991", "The Rescue • 2021", "DUNE • 2022", 
    "Casino Royale • 2006", "District 9 • 2009", "Skyfall • 2012", 
    "Hot Fuzz • 2007", "Dunkirk • 2017", "The Raid • 2011", 
    "Dark City • 1998", "Kick-Ass • 2010", "Lone Survivor • 2013", 
    "24: Redemption • 2008", "Ghost Dog • 1999", "Undisputed 1-2-3", 
    "John Wick 1-2-3", "Nobody • 2021", "Little Boy • 2015", 
    "Taken • 2008", "The Bourne Identity • 2002", "V for Vendetta • 2005"
];
