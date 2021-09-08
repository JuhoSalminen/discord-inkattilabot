require("dotenv").config();

const axios = require("axios");

const openings = [
  "Hyvää maanantaita kaikille.",
  "Miau!",
  "On taas aika luoda uutta!",
  "_Tassuttelee piirtonäytön päälle_",
  "Ink-attihaasteen aika!",
];

const themes = [
  "Challenge 1",
  "Challenge 2",
  "Challenge 3",
  "Challenge 4",
  "Challenge 5",
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
  "Muista postata tekeleesi tänne!",
  "Eikä turhaa stressiä!",
  "Muista pitää hauskaa.",
  "Tämä ei ole kisa, vaan yhteistä kivaa.",
  "1... 2... 3... Piirräpiirräpiirrä!",
];

function constructMessage() {
  const opening = selectRandomFrom(openings);
  const date = getWeekNumber(new Date());
  const theme = getAndRemoveTheme(themes);
  const closing = selectRandomFrom(finishings);
  return `${opening} On vuoden ${date}. viikko. Ink-attiteema tällä viikolla on **${theme}**. ${closing}`;
}

function selectRandomFrom(selection) {
  return selection[Math.floor(Math.random() * selection.length)];
}

function getAndRemoveTheme(selection) {
  var topic;
  let chooser = (Math.random()*selection.length);
  topic = selection[chooser];
  selection.splice(chooser, 1);
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
    // Return week number
    return weekNo;
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
