
if (command === 'çal') {
  const voiceChannel = msg.member.voiceChannel;
  if (!voiceChannel) return msg.channel.send('Üzgünüm müzik açmam için senin bir sesli kanalda olman gerekli.');
  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has('CONNECT')) {
    return msg.channel.send('Üzgünüm bu odaya bağlanma yetkim yok sunucu ayarlarından rolümdeki yetkileri arttırmalısın.');
  }
  if (!permissions.has('SPEAK')) {
    return msg.channel.send('Üzgünüm bu odada konuşma yetkim yok sunucu ayarlarından rolümdeki yetkileri arttırmalısın.');
  }

  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
    const playlist = await youtube.getPlaylist(url);
    const videos = await playlist.getVideos();
    for (const video of Object.values(videos)) {
      const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
    }
    return msg.channel.send({embed: new Discord.RichEmbed()
                        .setAuthor(`You Requested for Music, ` + msg.author.tag,msg.author.avatarURL)
                        .setDescription(`:notes: **Sıraya eklendi:**
**»** ${playlist.title}`)
                        .setColor(eColor)
                         
                       }); 
  } else {
    if(!searchString) {
        msg.channel.send({embed: new Discord.RichEmbed()
                        .setAuthor(`Çal komutu kullanımı &  ` + msg.author.tag,msg.author.avatarURL)
                        .setDescription(`**Kullanım:**  tt!çal <search>
Sizde türkiyenin ilk ve gelişmekte olan
müzik botunu kullanıyorsanız ne mutlu size.`)
                        .setColor(eColor)
                         
                       });
    } else {
    try {
      var video = await youtube.getVideo(url);
    } catch (error) {
      try {
        var videos = await youtube.searchVideos(searchString, 5);
        let index = 0;
    /*  msg.channel.send({embed: new Discord.RichEmbed()
                        .setAuthor(`You Requested for Music, ` + msg.author.tag,msg.author.avatarURL)
                        .setDescription(`<:TubeMusic:413862971865956364>__**Youtube Search Result**__
${videos.map(video2 => `**${++index}.** ${video2.title}`).join(`\n`)}
To select a song, type any number from \`1 - 5\` to choose song!
The search is cancelled in \`10 seconds\` if no number provided.`)
                        .setColor(eColor)
                         
                       }); 
        try {
          var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6, {
            maxMatches: 1,
            time: 10000,
            errors: ['time']
          });
        } catch (err) {
          console.error(err);
          return msg.channel.send('Invalid numbers inserted or no received numbers. I\'m Cancelling your Search.');
        } */
       // var response = 1;
      //	const videoIndex = parseInt(response.first().content);
        var video = await youtube.getVideoByID(videos[0].id);
      } catch (err) {
        console.error(err);
        return msg.channel.send('Hey! Ben herhangi bir sonuç bulamadım.');
      }
    }
    return handleVideo(video, msg, voiceChannel)
  }
  }
} else if (command === 'geç') {
  if (!msg.member.voiceChannel) return msg.channel.send(':red_circle: **Ses kanalında değil, ben seninle konuşuyorum**');
  if (!serverQueue) return msg.channel.send(':mailbox_with_no_mail: **Boş bir sırayı nasıl atlayayım.**');
  serverQueue.connection.dispatcher.end('Atla komutu kullanıldı.');
  return undefined;
} else if (command === 'dur') {
  if (!msg.member.voiceChannel) return msg.channel.send(':red_circle: **Ses kanalında değil, ben seninle konuşuyorum**');
  if (!serverQueue) return msg.channel.send(':mailbox_with_no_mail: **Durmayacak bir şey yok, çünkü müzik yok!**');
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end('Dur komutu kullanıldı.');
  msg.channel.send({embed: new Discord.RichEmbed()
                    .setAuthor(msg.author.tag,msg.author.avatarURL)
                    .setDescription(`Oyuncu müziği durdurdu.`)
                    .setColor(eColor)
                   })
  return undefined;
} else if (command === 'ses') {
		if (!msg.member.voiceChannel) return msg.channel.send('Sesli kanalda değilsiniz!');
		if (!serverQueue) return msg.channel.send('Çalan müzik bulunmamakta nasıl sesini düzenleyebilirsin ?');
		if (!args[1]) return msg.channel.send(`Mevcut ses şiddeti: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`Ayarlanan ses düzeyi: **${args[1]}**`);
  
} else if (command === 'çalan' || command === 'şimdi-çalan') {
  if (!serverQueue) return msg.channel.send(':mailbox_with_no_mail: **Bekle, müzik çalmıyor!**');
  return msg.channel.send({embed: new Discord.RichEmbed()
                           .setAuthor(msg.author.tag,msg.author.avatarURL)
                           .setDescription(`:notes: **Çalmakta olan şarkı:**\n${serverQueue.songs[0].title}`)
                           .setColor(eColor)
                           .setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/mqdefault.jpg`)
                            
                           .setTimestamp(new Date())
                          })
  //msg.channel.send(`Yo yo! I'm playing :notes: ,**${serverQueue.songs[0].title}**, :notes: currently!`);
} else if (command === 'kuyruk' || command === `k`) {
  if (!serverQueue) return msg.channel.send(':mailbox_with_no_mail: **Ne? Hiçbir şey oynamıyor mu ?**');
 return msg.channel.send({embed: new Discord.RichEmbed()
                           .setAuthor(msg.author.tag,msg.author.avatarURL)
                           .setDescription(`:notes: **Şarkı Mevcut Sıra:**\n${serverQueue.songs.map(song => `**»** ${song.title}`).join('\n')}`)
                           .setColor(eColor)
                            
                           .setTimestamp(new Date())
                         })
 
 msg.channel.send(`
__**Müzik kuyruğu:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Çalınan şarkı:**
:notes: ${serverQueue.songs[0].title} :notes:
  `);




} else if (command === 'duraklat') {
  if (serverQueue && serverQueue.playing) {
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.pause();
    return msg.channel.send(':pause_button: **Başarılı bir şekilde müziği durdurdun.**');
  }
  return msg.channel.send(':mailbox_with_no_mail: **Bu DJ boş şarkıyı nasıl durduracağını bilmiyor!**');
} else if (command === 'devamet') {
  if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return msg.channel.send(':play_pause: **Kullanıcı şarkıyı tekrardan başlattı.**');
  }
  return msg.channel.send(':mailbox_with_no_mail: **Bu DJ boş şarkıyı nasıl durduracağını bilmiyor!**');
  
} 
  
return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
let eColor = msg.guild.me.displayHexColor!=='#000000' ? msg.guild.me.displayHexColor : 0xffffff
const serverQueue = queue.get(msg.guild.id);
console.log(video);
const song = {
  id: video.id,
  title: Discord.escapeMarkdown(video.title),
  url: `https://www.youtube.com/watch?v=${video.id}`
};
if (!serverQueue) {
  const queueConstruct = {
    textChannel: msg.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    volume: 5,
    playing: true
  };
  queue.set(msg.guild.id, queueConstruct);

  queueConstruct.songs.push(song)
  msg.channel.send({embed: new Discord.RichEmbed()
                                                                        .setAuthor(msg.author.tag,msg.author.avatarURL)
                                                                        .setDescription(`:notes: **Şuanda çalan şarkı:**\n${video.title}`)
                                                                        .setTimestamp(new Date())
                                                                         
                    .setThumbnail(`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`)
                                                                        .setColor(eColor)
                                                                       });

  try {
    var connection = await voiceChannel.join();
    queueConstruct.connection = connection;
    play(msg.guild, queueConstruct.songs[0]);
  } catch (error) {
    console.error(`I could not join the voice channel: ${error}`);
    queue.delete(msg.guild.id);
    return msg.channel.send(`I could not join the voice channel: ${error}`);
  }
} else {
  serverQueue.songs.push(song);
  console.log(serverQueue.songs);
  if (playlist) return undefined;
  else return msg.channel.send({embed: new Discord.RichEmbed()
                                                                        .setAuthor(msg.author.tag,msg.author.avatarURL)
                                                                        .setDescription(`:notes: **Added Song:**\n${video.title}`)
                                                                        .setTimestamp(new Date())
                                .setThumbnail(`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`)
                                                                         
                                                                        .setColor(eColor)
                                                                       })
}
return undefined;
}

function play(guild, song) {
const serverQueue = queue.get(guild.id);

if (!song) {
  serverQueue.voiceChannel.leave();
  queue.delete(guild.id);
  return;
}
console.log(serverQueue.songs);

const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
      .on('end', reason => {
          if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
          else console.log(reason);
          serverQueue.songs.shift();
          setTimeout(() => {
              play(guild, serverQueue.songs[0]);
          }, 250);
      })
      .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);﻿
}
