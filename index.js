const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'ourserver-5LOn.aternos.me';
const SERVER_PORT = 41445;
const MINECRAFT_VERSION = '1.21.7';

const NAME_PREFIXES = ['AFKBott', 'LazyJump', 'SkyWalker', 'CloudHop', 'BotNomad'];
let bot;

// دالة لاختيار اسم عشوائي عند كل اتصال
function randomUsername() {
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 10000);
  return `${prefix}${suffix}`;
}

function createBot() {
  const username = randomUsername();
  console.log(`▶️  Connecting as ${username}...`);

  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username,
    version: MINECRAFT_VERSION,
    // في حال كان السيرفر “cracked” (غير محمي): أزل التعليق عن السطر التالي
    // offlineMode: true,
  });

  bot.once('spawn', () => {
    console.log('✅  Spawned in world!');

    // ➡️ القفز كل 10–15 ثانية
    setInterval(() => {
      if (bot.entity && bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 10000 + Math.random() * 5000);

    // ➡️ إرسال رسالة في الشات كل 60 ثانية
    setInterval(() => {
      const msgs = [
        'Hello world!',
        'Just hopping around 🐇',
        'AFK but still here!',
        'Keep calm and mine on ⛏️',
        'I like to jump!',
      ];
      bot.chat(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 60000);
  });

  // عند الطرد أو الخطأ: أعد الاتصال بعد 5 ثواني باسم جديد
  function reconnectHandler(err) {
    console.log('🔌 Disconnected:', err?.message || err);
    setTimeout(createBot, 5000);
  }
  bot.on('end', reconnectHandler);
  bot.on('error', reconnectHandler);
  bot.on('kicked', (reason) => {
    console.log('⛔ Kicked for:', reason);
    bot.quit(() => {}); // هذا يجبر إعادة الاتصال
  });
}

createBot();

// ——— خادم ويب بسيط يبقي الحاوية “نشطة” على Render ———
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🚀 Minecraft AFK Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Server listening on port ${PORT}`));
