import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const exec = promisify(_exec).bind(cp);

const handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { text: '⚠️ يرجى إدخال الأمر المطلوب للبحث عنه.' }, { quoted: m });
    return;
  }

  // عرض رسالة تفاعلية
  await conn.sendMessage(m.chat, { text: '🔍 جاري البحث عن الأمر...' }, { quoted: m });

  const ar = Object.keys(plugins);
  const ar1 = ar.map((v) => v.replace('.js', ''));
  const matchedFiles = [];

  // البحث عن الأمر في جميع الملفات
  for (const fileName of ar1) {
    const filePath = path.join('plugins', `${fileName}.js`);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // البحث عن التعبير النمطي الخاص بالأوامر
      const commandMatches = fileContent.match(/handler\.command\s*=\s*\/\^?(.*?)\/i/);

      if (commandMatches) {
        // إذا كان هناك تعبير نمطي يحتوي على أكثر من أمر
        const commands = commandMatches[1].split('|').map(cmd => cmd.trim()).filter(cmd => cmd);

        // البحث عن الأمر المدخل سواء كان فرديًا أو داخل مجموعة أوامر
        if (commands.includes(text) || commandMatches[1].includes(text)) {
          matchedFiles.push({ fileName, fileContent }); // حفظ اسم الملف والمحتوى
        }
      }
    } catch (error) {
      await conn.sendMessage(m.chat, { text: `❌ خطأ أثناء قراءة الملف: ${fileName}` }, { quoted: m });
    }
  }

  // عرض النتائج
  if (matchedFiles.length > 0) {
    let responseMessage = `✅ تم العثور على الأمر "${text}" في الملف(ات):\n`;
    matchedFiles.forEach(({ fileName, fileContent }) => {
      responseMessage += `\n--- ${fileName} ---\n${fileContent}\n`;
    });
    await conn.sendMessage(m.chat, { text: responseMessage }, { quoted: m });
  } else {
    await conn.sendMessage(m.chat, { text: `❌ لم يتم العثور على أي ملف يحتوي على الأمر "${text}".` }, { quoted: m });
  }
};

handler.help = ['gp2'].map((v) => v + ' *<الأمر>*');
handler.tags = ['owner'];
handler.command = /^(كشف)$/i;
handler.rowner = true;

export default handler;
