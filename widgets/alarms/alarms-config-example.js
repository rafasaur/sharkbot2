module.exports = {
  active: false,

  alarms: {
    timezone: "America/Chicago",
    rules: [
      {
        "title": "noon",
        "channelIds": [""],
        "cronExpression": "0 0 12 * * *",
        "contentType": "static",
        "content": "welcome to fuck noon!",
        "embeds": []
      },
    ]
  }

}
