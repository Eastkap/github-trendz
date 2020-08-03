const api = require("./api")
const config = require("./config");
const tweet = require("./twitter");

const globalObject = {}
let init = false;
let {
  languages
} = config;
languages = languages.split(',')

const main = async () => {
  for (const language of languages) {
    console.log(language);
    const rep = await api.getter({
      language
    });
    rep.forEach(trending => {
      if (!globalObject[trending.url]) {
        globalObject[trending.url] = true;
        if (init) {
          const {
            author,
            name,
            description,
            stars,
            forks,
            currentPeriodStars
          } = trending;
          let text = `📈 project : ${name}

${description}

⭐${stars} 🍴${forks} ✨${currentPeriodStars}
Thanks ${author}`
          console.log(text)
          if (text.length > 280) {
            text = `📈 project : ${name}

⭐${stars} 🍴${forks} ✨${currentPeriodStars}
Thanks ${author}`
          }
          const hashtags = [`#${language}`, "#github", "#trending", "#githubTrending"]
          let newlined = false;
          for (const hashtag of hashtags) {
            if (hashtag.length + text.length + Number(newlined)) {
              newlined = true;
              text = `${text}${newlined ? ' ' : '\n'}${hashtag}`
            }
          }
          tweet({
            text
          })
        }
      }
    })
  }
}

(async () => {
  while (true) {
    try {
      await main()
      console.log('one round')
      await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 5));
      init = true;
    } catch (err) {
      console.warn(err)
    }
  }
})()