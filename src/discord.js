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
  const date = getWeekNumber(new Date());
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
  return topic;
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
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
