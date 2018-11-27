client.on("message", message => {
    const kufur = ["küfür","",""];
    if (kufur.some(word => message.content.includes(word)) ) {
        message.reply("Küfür Etme! :rage:")
        message.delete()
    }
});
