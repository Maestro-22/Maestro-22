let handler = async (m, { command, text }) => m.reply(`
*💫 اسئل لي 💫*
  
*السؤال:* ${text}
*الاجابة:* ${['نعم','ممكن','في الاغلب نعم','ف الاغلب لا','لا','مستحيل'].getRandom()}
`.trim(), null, m.mentionedJid ? {
mentions: m.mentionedJid
} : {})
handler.help = ['pregunta <texto>?']
handler.tags = ['kerang']
handler.command = /^هل$/i
export default handler
