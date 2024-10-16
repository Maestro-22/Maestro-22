import cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  try {
    const { results: matches } = await Matchlist();

    if (matches.length === 0) {
      await m.reply('لا توجد مباريات اليوم.');
      return;
    }

    let currentChampionship = '';
    const matchesInfo = matches.map(match => {
      let info = '';
      if (match.championship !== currentChampionship) {
        currentChampionship = match.championship;
        info += `🏆 ${match.championship}\n\n`;
      }
      info += `${match.team1} 🆚 ${match.team2}\n`;
      info += `⏰ ${match.time}\n`;
      info += `📺 ${match.channel}\n`;
      info += `🏁 ${match.result}\n`;
      return info;
    }).join('\n');

    await m.reply(matchesInfo);

  } catch (e) {
    console.error(e);
    await m.reply('حدث خطأ أثناء جلب المباريات.\nالخطأ: ' + e.message);
  }
};

handler.command = /^(المباريات)$/i;

export default handler;

async function Matchlist() {
  const url = `https://www.yallakora.com/match-center/%D9%85%D8%B1%D9%83%D8%B2-%D8%A7%D9%84%D9%85%D8%A8%D8%A7%D8%B1%D9%8A%D8%A7%D8%AA#`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    const $ = cheerio.load(text);
    
    const results = [];

    $('.matchCard').each((index, element) => {
      const $element = $(element);
      const championshipName = $element.find('.title').text().trim();
      
      $element.find('li').each((i, match) => {
        const $match = $(match);
        results.push({
          championship: championshipName,
          team1: $match.find('.teamA .teamName').text().trim(),
          team2: $match.find('.teamB .teamName').text().trim(),
          result: $match.find('.MResult').text().trim() || 'لم تبدأ بعد',
          time: $match.find('.MDate').text().trim(),
          channel: $match.find('.channel').text().trim() || 'غير متوفر'
        });
      });
    });

    return { results };
  } catch (e) {
    console.error('خطأ في جلب قائمة المباريات:', e);
    throw new Error('حدث خطأ أثناء جلب الصفحة: ' + e.message);
  }
}
