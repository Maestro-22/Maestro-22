import ytSearch from 'yt-search';
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (message, { conn, text }) => {
  if (!text) {
    return conn.reply(message.chat, "[❗] *شكلك نسيت تحط نص user@ \n ادخل نصا لاستطيع البحث علي يوتيوب?*", message);
  }

  // إظهار الرمز التعبيري فور كتابة الأمر
  await conn.sendMessage(message.chat, { react: { text: '🔍', key: message.key } });

  // تصفية نتائج البحث بناءً على دقة الفيديو والمدة الزمنية
  let filterOptions = ['480p', '720p', '1080p', 'قصير', 'طويل'];
  let filterButtons = filterOptions.map(option => ({
    buttonId: `filter_${option}`,
    buttonText: { displayText: option },
    type: 1
  }));

  let searchResults = await ytSearch(text);
  let videos = searchResults.videos.slice(0, 6); // عرض 6 فيديوهات فقط

  async function generateVideoMessage(video) {
    const { imageMessage } = await generateWAMessageContent({ 'image': { 'url': video.thumbnail } }, { 'upload': conn.waUploadToServer });
    return {
      title: video.title,
      url: video.url,
      imageMessage: imageMessage,
      channelName: video.author.name,
      views: video.views,
      duration: video.timestamp,
      resolution: video.resolution || 'غير معروف', // لا يوفر yt-search معلومات الدقة، يمكن تحديث المكتبة لاحقاً
      uploadDate: video.ago
    };
  }

  let results = [];
  for (let video of videos) {
    let videoMessage = await generateVideoMessage(video);
    results.push({
      'body': proto.Message.InteractiveMessage.Body.fromObject({
        'text': `${videoMessage.title}\n\n` +
                `📺 *القناة:* ${videoMessage.channelName}\n` +
                `👁️ *المشاهدات:* ${videoMessage.views}\n` +
                `⏰ *المدة:* ${videoMessage.duration}\n` +
                `📅 *نشر في:* ${videoMessage.uploadDate}\n` +
                `🖥️ *الدقة:* ${videoMessage.resolution}`
      }),
      'footer': proto.Message.InteractiveMessage.Footer.fromObject({
        'text': "『 🄱🄾🅃 🄰🄻🄼🅄🅂🄰🄱🄸 』"
      }),
      'header': proto.Message.InteractiveMessage.Header.fromObject({
        'title': '',
        'hasMediaAttachment': true,
        'imageMessage': videoMessage.imageMessage
      }),
      'nativeFlowMessage': proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        'buttons': [{
          'name': "cta_url",
          'buttonParamsJson': JSON.stringify({
            "display_text": "Watch Video 📹",
            "url": videoMessage.url
          })
        }]
      })
    });
  }

  // إضافة الرسالة التفاعلية مع تصفية النتائج
  const messageContent = generateWAMessageFromContent(message.chat, proto.Message.fromObject({
    'viewOnceMessage': {
      'message': {
        'messageContextInfo': {
          'deviceListMetadata': {},
          'deviceListMetadataVersion': 2
        },
        'interactiveMessage': proto.Message.InteractiveMessage.fromObject({
          'body': proto.Message.InteractiveMessage.Body.fromObject({
            'text': `🧞‍♂️ النتيجة لي\n\`🔎 『   ${text}   』\``
          }),
          'footer': proto.Message.InteractiveMessage.Footer.fromObject({
            'text': "اختر فلتر النتائج حسب المدة أو الدقة:"
          }),
          'header': proto.Message.InteractiveMessage.Header.fromObject({
            'hasMediaAttachment': false
          }),
          'interactiveButtonsMessage': {
            'buttons': filterButtons
          },
          'carouselMessage': proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            'cards': results
          })
        })
      }
    }
  }), {
    'quoted': message
  });

  await conn.relayMessage(message.chat, messageContent.message, { 'messageId': messageContent.key.id });
};

handler.help = ["youtube"];
handler.tags = ["downloader"];
handler.command = /^(بحث-يوتيوب)$/i;

export default handler;
