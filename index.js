const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const mcData = require('minecraft-data');

const bot = mineflayer.createBot({
  host: 'MCZonee.aternos.me',
  port: 41445, // تأكد أن هذا هو البورت الصحيح لسيرفرك
  username: 'BotHelper',
  version: false // auto-detect version
});

bot.once('spawn', () => {
  bot.loadPlugin(pathfinder);

  const mcVersion = bot.version;
  const movements = new Movements(bot, mcData(mcVersion));
  bot.pathfinder.setMovements(movements);

  bot.chat('تم الاتصال بالسيرفر بنجاح!');
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (message === 'اقفز') {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 1000);
  }

  if (message.startsWith('قل ')) {
    const msg = message.slice(3);
    bot.chat(msg);
  }
});

bot.on('end', () => {
  console.log('تم طرد البوت، جاري إعادة الاتصال...');
  setTimeout(() => {
    process.exit(1); // سيعيد Render تشغيل البوت تلقائيًا
  }, 3000);
});

bot.on('error', err => console.log('حدث خطأ:', err));
