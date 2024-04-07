const { App } = require('@slack/bolt');
const axios = require("axios")
const fs = require("fs")
require('dotenv').config();
const options = ["Hello Human!","Hey! How's it going","Whats Up!","Hiya"]
const app = new App({
  token: process.env.token,
  signingSecret: process.env.signingSecret,
  socketMode:true, // enable to use socket mode
  appToken:process.env.appToken,
});


app.message("hey", async ({ command, say }) => {
    try {
      const msg = Math.floor(Math.random() * (4 - 0 + 1) + 0)
      say(`${options[msg]}`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});


app.event('file_shared', async ({ event }) => {

 const fileId = event.file_id
 const fileInfo   = await app.client.files.info({token:process.env.slack_token,file: fileId});
const downloadUrl = fileInfo.file.url_private;

    const response = await axios.get(downloadUrl, {
      headers: {
        Authorization: `Bearer ${process.env.slack_token}`,
      },
      responseType: 'stream',
    });
     const fileStream = fs.createWriteStream(`${fileInfo.file.name}`);
    response.data.pipe(fileStream);
     }
);


(async () => {
  const port = 3000
  await app.start(process.env.PORT || port);
  console.log('Bolt app started!!');
})();

