const mineflayer = require('mineflayer');
const express = require('express');

const SERVER_HOST = 'MCZonee.aternos.me';
const SERVER_PORT = 41445;
const MINECRAFT_VERSION = '1.21.7';

const NAME_PREFIXES = ['AFKBott', 'LazyJump', 'SkyWalker', 'CloudHop', 'BotNomad'];

let bot;

function randomUsername() {
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 10000);
  return `${prefix}${suffix}`;
}

function createBot() {
  const username = randomUsername();
  console.log(`▶️ Connecting as ${username}...`);

  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username,
    version: MINECRAFT_VERSION,
    // offlineMode: true, // Uncomment if the server is not premium
  });

  bot.once('spawn', () => {
    console.log('✅ Spawned in world!');

    setInterval(() => {
      if (bot.entity && bot.entity.onGround) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
      }
    }, 10000 + Math.random() * 5000);

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

  const reconnectHandler = (err) => {
    console.log('🔌 Disconnected or error:', err?.message || err);
    setTimeout(() => {
      console.log('🔁 Reconnecting...');
      createBot();
    }, 30000);
  };

  bot.on('end', reconnectHandler);
  bot.on('error', reconnectHandler);
  bot.on('kicked', reconnectHandler);
}

createBot();

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🚀 Minecraft AFK Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Server listening on port ${PORT}`));
