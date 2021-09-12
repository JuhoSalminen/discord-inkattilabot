require("dotenv").config();

const axios = require("axios");

const openings = [
  "Hyvää maanantaita kaikille.",
  "Miau!",
  "On taas aika luoda uutta!",
  "_Tassuttelee piirtopöydän päälle_",
  "Ink-attiaiheen aika!",
];

const themes = [
"Havuja, perkele!",
"Kajaanin linna",
"Vetäytyvä meri",
"Pätevöityminen",
"Ensimmäinen auto koskaan",
"Lokit",
"Syksy",
"#Gamedev",
"Kajaani",
"Luotikuja",
"Avaruusmatka",
"Ötököiden kilpailu",
"Supersankari",
"Paras peli lapsuudesta",
"Epätavanomaiset ystävät",
"Kamkin tapa toimia",
"Pienestä kasvaa suurta",
"Posiopäivät",
"Dungeons & Dragons",
"Kattila Royale",
"Katit laiturilla",
"Mehukatti",
"#mattimaksaa	",
"Kattila-kissa",
"Aamiainen",
"Viimeisin pelaamasi peli",
"Wholesome",
"Vesi",
"Karhu",
"Aarre",
"Lohikäärme",
"Kuppi kuumaa",
"Päivän paita",
"Feels good man",
"Kohti ääretöntä ja sen yli",
];

const finishings = [
  "Muista postata tekeleesi tänne!",
  "Eikä turhaa stressiä! Tämä on vain hauskanpitoa.",
  "Nähdään ensi maanantaina!",
  "Tämä ei ole kisa, vaan yhteistä kivaa.",
  "1... 2... 3... Piirräpiirräpiirrä!",
  "Muista myös käydä lisäämässä omat aihe-ehdotuksesi listaan! https://forms.gle/nHbaEZ19uNzAPwex6",
  "2D, 3D, traditionaalinen tai moderni: tekotapa vapaa!",
];

function constructMessage() {
  const opening = selectRandomFrom(openings);
  const date = getWeekNumber(new Date());
  const theme = getAndRemoveTheme(themes);
  const closing = selectRandomFrom(finishings);
  return `${opening} On vuoden ${date}. viikko. Ink-attiteema tällä viikolla on **"${theme}"**. ${closing}`;
}

function selectRandomFrom(selection) {
  return selection[Math.floor(Math.random() * selection.length)];
}

function getAndRemoveTheme(selection) {
  var topic;
  let chooser = [Math.floor(Math.random() * selection.length)];
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
