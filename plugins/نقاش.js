let handler = async (m, { conn, command, text }) => {
let love = `
*☬ ⊱⊶✤⊷⊰ •〔🕸〕• ⊱⊶✤⊷⊰ ☬*
       *☬ســـؤال نـقــ♨️ـاشــي☬*
*☬ ⊱⊶✤⊷⊰ •〔🕸〕• ⊱⊶✤⊷⊰ ☬*

~*☬ الانمـــي :*~ *『』*

~*☬ النقـــاش 🗣 :*~ *『』*

~*☬ المكـــافأة 💰 :*~ *『』*

~*☬ المســـؤول 🎙:*~ *『』*
*☬ ⊱⊶✤⊷⊰ •〔🕸〕• ⊱⊶✤⊷⊰ ☬*
*~تــ✍︎ــوقــيــع اداࢪة┊📜┊↯:~*   *~〘☬╎المصعبي 𓆩❄𓆪 عبدالرحمن╎☬〙~*
`.trim()
m.reply(love, null, { mentions: conn.parseMention(love) })}
handler.help = ['estupidez']
handler.tags = ['fun']
handler.command = /^(النقاش|نقاش)$/i
export default handler
