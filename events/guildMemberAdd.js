module.exports = member => {
    let username = member.user.username;
    member.send('Hg KnK **' + username + '**!');
    member.guild.defaultChannel.send('hg '+username+'');
};
