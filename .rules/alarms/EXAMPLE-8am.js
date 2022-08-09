const fs = require('fs'); const path = require('path');
function getFilesFromFolder(folderpath) {
  return fs.readdirSync(path.resolve(__dirname,folderpath))
                  .filter(name => path.extname(name).length > 0)
}

module.exports = {
  cronTime: " 0 0 0 8 * * *",
  timezone: "", // if using a different timezone than the default
  channelIds: [""], // channel ids to message, regardless of policy
  mentionIds: [""], // mention ids (roles, members) to include, regardless of policy
  surpriseDelay: 0, // maximum delay time for surprise-types
  policies: {
    surprise: false, /* If 0 < value < 1, randomly posts with that frequency.
                        If not false/undefined, posts with default surpriseFreq in config.
                        Uses surpriseDelay to randomly "adjust" cronTime for additonal surpise */
    post: "static", /* controls which post from posts get sent. Options are:
                        - static (default, sends 0th entry)
                        - random (uses random entry)
                        - weighted (randomly picks using weight values to weight posts) */
    content: "random", /* controls which text to send from selected post. Options are:
                        - static (default, sends 0th entry)
                        - random (picks random entry)
                        For weighted, use weighted posts */
    files: "static", /* same options as content, same reasoning. Can pull all files
                        from a single folder with getFilesFromFolder(folderpath) above,
                        where folderpath is relative path to folder */
  },
  posts: [
    {
      title: "", // just for labelling posts for readability
      delayTime: 0, // time delay from cronTime (default 0)
      channelIds: [""], // array of channel ids to send to
      metionIds: [""], // array of ids (roles, members) to mention in post
      weight: 1, // weight for use in "weighted" post policy
      content: [
        "oh wow! It's 8am! Lookitthat!",
        "can you believe it! It's 8am! Yay!",
        "ok actually 8am shouldn't be a time where anyone does anything. Smh."
      ],
      files: getFilesFromFolder("../../assets/weekend") //[ ]
    }
  ]
}
