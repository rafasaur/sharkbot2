const {AttachmentBuilder} = require('discord.js');

// pass an array of filepaths and the path to the folder containing them
// returns an array of attachments to send in messages (via {files:<attachments>})
module.exports = async (fileArray, folderPath='') => {
    let attachments = [];
    await fileArray.forEach(async filepath => {
      const attachment = await new AttachmentBuilder(folderPath + filepath);
      attachments.push(attachment);
    });
    return attachments;
}
