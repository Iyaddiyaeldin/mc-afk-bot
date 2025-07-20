const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'MCZonee.aternos.me', // غيّره حسب سيرفرك
    port: 41445, // البورت
    username: 'AFKBOT_JAVA', // اسم البوت (يمكن تغييره)
    version: false // استخدام إصدار السيرفر تلقائيًا
  });

  bot.on('spawn', () => {
    console.log('✅ Bot spawned in the server');
    bot.chat('البوت متصل الآن ✔');
    setInterval(() => bot.setControlState('jump', true), 500);
  });

  bot.on('end', () => {
    console.log('🔁 Bot disconnected, reconnecting in 5s...');
    setTimeout(createBot, 5000
