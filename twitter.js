const Twit = require("twit");
const imageToBase64 = require("image-to-base64");
const config = require("./config");

const T = new Twit({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const tweet = async ({ text, image }) => {
  if (image) {
    const b64content = await imageToBase64(image); // Image URL;

    // first we must post the media to Twitter
    T.post(
      "media/upload",
      {
        media_data: b64content,
      },
      function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and
        // other text-based presentations and interpreters
        console.warn(err);
        var mediaIdStr = data.media_id_string;
        var altText = text;
        var meta_params = {
          media_id: mediaIdStr,
          alt_text: {
            text: altText,
          },
        };

        T.post("media/metadata/create", meta_params, function (
          err,
          data,
          response
        ) {
          if (!err) {
            // now we can reference the media and post a tweet (media will attach to the tweet)
            var params = {
              status: text,
              media_ids: [mediaIdStr],
            };

            T.post("statuses/update", params, function (err, data, response) {
              console.log("tweeted");
            });
          }
        });
      }
    );
  } else {
    T.post(
      "statuses/update",
      {
        status: text,
      },
      function (err, data, response) {
        console.log("tweeted");
      }
    );
  }
};
module.exports = tweet;
