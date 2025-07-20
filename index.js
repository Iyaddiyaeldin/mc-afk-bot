// index.js
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;
const mc = require('minecraft-protocol');

const bot = mineflayer.createBot({
  host: 'ourserver-5LOn.aternos.me',
  port: 25565,
  username: 'BotHelper123', // يمكن تغييره إذا لزم
  auth: 'microsoft', // استعمل 'offline' إذا لم يكن بحساب مايكروسوفت
});

bot.loadPlugin(pathfinder);

bot.once('spawn', () => {
  console.log('البوت دخل السيرفر.');
  bot.chat('مرحباً! أنا بوت');
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 2000);
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  if (message === 'تعال') {
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(new GoalNear(bot.entity.position.x + 1, bot.entity.position.y, bot.entity.position.z, 1));
  }
});

bot.on('end', () => {
  console.log('تم طرد البوت، يحاول إعادة الاتصال...');
  setTimeout(reconnect, 5000);
});

bot.on('error', err => console.log('خطأ:', err));

function reconnect() {
  const newBot = require('child_process').spawn('node', ['index.js'], {
    stdio: 'inherit'
  });
}

function getUsernamePrefixSuffix(username) {
  const prefix = '[Prefix]';
  const suffix = '[Suffix]';
  return `${prefix}${username}${suffix}`;
}
