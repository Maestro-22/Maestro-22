import axios from "axios";
import { toAudio } from '../lib/converter.js';

const handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[0]) throw `يرجى إدخال رابط صحيح لاستخدام الأمر _${usedPrefix + command} https://www.instagram.com/reel/C8sWV3Nx_GZ/?igsh=MWZoeTY2cW01Nzg1bQ==`;

  try {
    // إرسال إيموجي الساعة للدلالة على أن المعالجة بدأت
    await conn.sendMessage(m.chat, { react: { text: '⏲️', key: m.key } });

    const img = await instagramDownload(args[0]);
    for (let i = 0; i < img.data.length; i++) {
      const item = img.data[i];
      if (item.type === "image") {
        await conn.sendMessage(m.chat, { image: { url: item.url } }, { quoted: m });
      } else if (item.type === "video") {
        const videoBuffer = await axios.get(item.url, { responseType: 'arraybuffer' }).then(res => res.data);
        
        // إرسال الفيديو
        await conn.sendMessage(m.chat, { video: videoBuffer }, { quoted: m });
        
        // تحويل الفيديو إلى صوت وإرساله
        const audio = await toAudio(videoBuffer, 'mp4');
        if (audio.data) {
          await conn.sendMessage(m.chat, { audio: audio.data, mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
          throw `تنبيه: فشل تحويل الفيديو إلى MP3.`;
        }
      }
    }

    // إرسال إيموجي التحقق عند الانتهاء بنجاح
    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
  } catch (err) {
    // إرسال إيموجي الخطأ في حالة حدوث مشكلة
    await conn.sendMessage(m.chat, { react: { text: '✖️', key: m.key } });

    const res = await axios.get("https://deliriusapi-official.vercel.app/download/instagram", { params: { url: args[0] } });
    const result = res.data.data;
    for (let i = 0; i < result.length; i++) {
      const item = result[i];
      if (item.type === "image") {
        await conn.sendMessage(m.chat, { image: { url: item.url } }, { quoted: m });
      } else if (item.type === "video") {
        const videoBuffer = await axios.get(item.url, { responseType: 'arraybuffer' }).then(res => res.data);
        
        // إرسال الفيديو
        await conn.sendMessage(m.chat, { video: videoBuffer }, { quoted: m });
        
        // تحويل الفيديو إلى صوت وإرساله
        const audio = await toAudio(videoBuffer, 'mp4');
        if (audio.data) {
          await conn.sendMessage(m.chat, { audio: audio.data, mimetype: 'audio/mpeg' }, { quoted: m });
        } else {
          throw `تنبيه: فشل تحويل الفيديو إلى MP3.`;
        }
      }
    }

    // إرسال إيموجي التحقق عند الانتهاء بنجاح
    await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
  }
};

handler.command = /^(انستا|instagram|igdl|ig|instagramdl2|instagram2|igdl2|ig2|instagramdl3|instagram3|igdl3|ig3)$/i;
export default handler;

const instagramDownload = async (url) => {
  return new Promise(async (resolve) => {
    if (!url.match(/\/(reel|reels|p|stories|tv|s)\/[a-zA-Z0-9_-]+/i)) {
      return resolve({ status: false, creator: "Sareth", msg: "الرابط غير صحيح." });
    }

    try {
      let jobId = await (
        await axios.post(
          "https://app.publer.io/hooks/media",
          {
            url: url,
            iphone: false,
          },
          {
            headers: {
              Accept: "/",
              "Accept-Encoding": "gzip, deflate, br, zstd",
              "Accept-Language": "es-ES,es;q=0.9",
              "Cache-Control": "no-cache",
              Origin: "https://publer.io",
              Pragma: "no-cache",
              Priority: "u=1, i",
              Referer: "https://publer.io/",
              "Sec-CH-UA":
                '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              "Sec-CH-UA-Mobile": "?0",
              "Sec-CH-UA-Platform": '"Windows"',
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            },
          },
        )
      ).data.job_id;
      let status = "working";
      let jobStatusResponse;
      while (status !== "complete") {
        jobStatusResponse = await axios.get(
          `https://app.publer.io/api/v1/job_status/${jobId}`,
          {
            headers: {
              Accept: "application/json, text/plain, /",
              "Accept-Encoding": "gzip, deflate, br, zstd",
              "Accept-Language": "es-ES,es;q=0.9",
              "Cache-Control": "no-cache",
              Origin: "https://publer.io",
              Pragma: "no-cache",
              Priority: "u=1, i",
              Referer: "https://publer.io/",
              "Sec-CH-UA":
                '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              "Sec-CH-UA-Mobile": "?0",
              "Sec-CH-UA-Platform": '"Windows"',
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            },
          },
        );
        status = jobStatusResponse.data.status;
      }

      let data = jobStatusResponse.data.payload.map((item) => {
        return {
          type: item.type === "photo" ? "image" : "video",
          url: item.path,
        };
      });

      resolve({
        status: true,
        data,
      });
    } catch (e) {
      resolve({
        status: false,
        msg: "حدث خطأ أثناء معالجة الطلب.",
      });
    }
  });
};
