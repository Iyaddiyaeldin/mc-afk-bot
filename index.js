// index.js - نسخة Bedrock فقط

const { createClient } = require('bedrock-protocol');
const express = require('express');

const SERVER_HOST = 'MCZonee.aternos.me';
const SERVER_PORT = 41445;

const NAME_PREFIXES = ['AFKBott', 'LazyJump', 'SkyWalker', 'CloudHop', 'BotNomad'];

let client;

function randomUsername() {
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 10000);
  return `${prefix}${suffix}`;
}

function createBot() {
  const username = randomUsername();
  console.log(`▶️ Connecting as ${username}...`);

  client = createClient({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username,
    offline: true,
    version: '1.21.94'
  });

  client.on('join', () => {
    console.log('✅ Successfully joined the Bedrock server.');
  });

  client.on('disconnect', (reason) => {
    console.log('🔌 Disconnected:', reason);
    setTimeout(() => {
      console.log('🔁 Reconnecting...');
      createBot();
    }, 30000);
  });

  client.on('error', (err) => {
    console.log('⚠️ Error:', err.message);
  });
}

createBot();

// خادم ويب بسيط لإبقاء الخدمة شغالة
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('🚀 Bedrock AFK Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Server listening on port ${PORT}`));
