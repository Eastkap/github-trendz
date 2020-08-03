const request = require("request-promise-native");
const base = 'https://ghapi.huchen.dev/'

const getter = async ({
  language
}) => {
  const endpoint = `${base}?language=${language}`
  const results = request.get(endpoint, {
    json: true
  });
  return results;
}
const getImages = async ({
  username,
  name
}) => {

  const endpoint = `https://raw.githubusercontent.com/${username}/${name}/master/README.md`
  const readme = await request(endpoint);
  const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
  // TODO

}

module.exports = {
  getter,
  getImages
}