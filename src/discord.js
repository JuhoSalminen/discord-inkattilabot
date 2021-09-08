require("dotenv").config();

const axios = require("axios");

const openings = [
  "Well, hello there!",
  "Greetings, Earthlings!",
  "Pens at the ready!",
  "Hope you're ready for some inking!",
  "Beep! Boop! Time to ink!",
];

const themes = [
  "Challenge 1",
  "Challenge 2",
  "Challenge 3",
  "Challenge 4",
  "Challenge 5",
];

const oldThemes = [
  
];


const topics = {
  1: "fish",
  2: "wisp",
  3: "bulky",
  4: "radio",
  5: "blade",
  6: "rodent",
  7: "fancy",
  8: "teeth",
  9: "throw",
  10: "hope",
  11: "disgusting",
  12: "slippery",
  13: "dune",
  14: "armor",
  15: "outpost",
  16: "rocket",
  17: "storm",
  18: "trap",
  19: "dizzy",
  20: "coral",
  21: "sleep",
  22: "chef",
  23: "rip",
  24: "dig",
  25: "buddy",
  26: "hide",
  27: "music",
  28: "float",
  29: "shoes",
  30: "ominous",
  31: "crawl",
};

const finishings = [
  "Hope you'll share your creations here.",
  "Draw on inkers!",
  "The journey is as important as the destination.",
  "There is no competition - show us what you made.",
  "1... 2... 3... Ink!",
];

function constructMessage() {
  const opening = selectRandomFrom(openings);
  const date = Date.GetWeek();
  const theme = getAndRemoveTheme();
  const closing = selectRandomFrom(finishings);
  return `${opening} On vuoden ${date}. viikko. Ink-attiteema tällä viikolla on **${theme}**. ${closing}`;
}

function selectRandomFrom(selection) {
  return selection[Math.floor(Math.random() * selection.length)];
}

function getAndRemoveTheme() {
  let topic;
  let chooser = (Math.random()*themes.length);
  topic = themes[chooser];
  themes.splice(chooser, 1);
  oldThemes.push(topic);
  return `$(topic)`;
}

Date.prototype.getWeek = function() {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

exports.handler = (event, context, callback) => {
  const params = {
    username: process.env.BOT_NAME,
    avatar_url: process.env.AVATAR_URL || "",
    content: constructMessage(),
  };

  async function triggerWebhook() {
    return axios.post(process.env.DISCORD_WEB_HOOK, params);
  }

  triggerWebhook()
    .then(() => {
      callback(null, {
        statusCode: 200,
        headers: {
          "Cache-Control": "no-cache",
        },
        body: "Message sent.",
      });
    })
    .catch((err) => {
      callback(null, {
        statusCode: 400,
        body: "Message failed with this error: " + err,
      });
    });
};
