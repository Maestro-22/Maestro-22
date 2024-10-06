let handler = async (m, { conn, text }) => {
  // تحقق من النص
  const pesan = m.quoted && m.quoted.text ? m.quoted.text : text;
  if (!pesan) return conn.sendMessage(m.chat, { text: 'ادخل نص الرساله اولا' }, { quoted: m });

  // جلب كل المجموعات
  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);

  if (groups.length === 0) {
    return conn.sendMessage(m.chat, { text: 'لا توجد مجموعات متاحة لإرسال الرسالة إليها.' }, { quoted: m });
  }

  // إنشاء الأزرار لاختيار المجموعة
  let buttonList = groups.map(([id, chat]) => [chat.subject, `.sendToGroup ${chat.subject} ${pesan}`]);
  
  // إرسال قائمة بالمجموعات مع الأزرار
  const groupMessage = `يرجى اختيار مجموعة لإرسال الرسالة:\n\n`;
  await conn.sendButton(m.chat, groupMessage, ' > PLUTO | 🐼❤️', '', buttonList, m);
};

// دالة لإرسال الرسالة إلى مجموعة معينة عند الضغط على الزر
const sendToGroupHandler = async (m, { conn, args }) => {
  const groupName = args[0]; // اسم المجموعة
  const textMessage = args.slice(1).join(' ');

  // جلب معرف المجموعة بناءً على الاسم
  const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats);
  const groupId = groups.find(([jid, chat]) => chat.subject === groupName)?.[0];

  if (!groupId || !textMessage) {
    return conn.reply(m.chat, 'يرجى توفير اسم المجموعة والنص المطلوب.', m);
  }

  // إرسال الرسالة إلى المجموعة المحددة
  const formattedMessage = `المطور بيقولكو: ${textMessage}`;
  await conn.sendMessage(groupId, { text: formattedMessage, mentions: [m.sender] }, { quoted: m });
  m.reply('تم إرسال الرسالة إلى المجموعة المحددة!');
}

handler.sendToGroup = sendToGroupHandler;

handler.help = ['tx'];
handler.tags = ['owner'];
handler.command = /^(نشرو)$/i;
handler.owner = true;

export default handler;
