module.exports = member => {
  let guild = member.guild;
  member.send('Yok Yere Gittin Canimin Iciydin Sevdaaa');
  guild.defaultChannel.send(`${member.user.username} gitti.`);
};
