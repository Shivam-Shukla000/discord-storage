// const write = require("./FileSystem/write");
const fs = require("fs");
require("dotenv").config();
const Token = process.env.LOGIN_ID;
const axios = require("axios");
const https = require("https");
const StreamWrite = require("./FileSystem/StreamWrite");
const { resolve } = require("path");

const parts = [
  "1212305326452252672",
  "1212305327152955463",
  "1212305326183948300",
  "1212305329661157417",
  "1212305323583606794",
  "1212305326305706014",
  "1212305392147636247",
  "1212305413656285244",
  "1212305405359693854",
  "1212305405481590785",
  "1212305397675982892",
  "1212305409172316185",
  "1212305447197999165",
  "1212305456354304030",
  "1212305477321494559",
  "1212305470157623328",
  "1212305469452849173",
];
(async () => {
  const outputpath = `${__dirname}/output/video.mp4`;

  console.time("done in");

  const writeStream = fs.createWriteStream(outputpath);
  const options = {
    headers: {
      Authorization: `Bot ${Token}`,
    },
  };
  for (const part of parts) {
    const res = await axios.get(
      `https://discord.com/api/v9/channels/1202772184968462346/messages/${part}`,
      options
    );
    const proxyUrl = await res.data.attachments[0].url;
    const processChunk = async (chunk) => {
      writeStream.write(chunk);
      await new Promise((resolve) => {
        writeStream.once("drain", resolve());
      });
    };
    await new Promise((resolve, reject) => {
      https.get(proxyUrl, (res) => {
        console.log(res.statusCode);
        console.time("finished in");
        res
          .pipe(new StreamWrite(processChunk))
          .on("finish", () => {
            resolve(), console.timeEnd("finished in");
          })
          .on("error", () => {
            reject(err);
          });
      });
    });

    console.log("wrote");
  }
  writeStream.end();
  console.timeEnd("done in");
})();

// (() => {
//   const file = fs.createReadStream(
//     "/home/katari/myProjects/discord-storage/backend/input/0"
//   );
//   const write = fs.createWriteStream(
//     "/home/katari/myProjects/discord-storage/backend/output/Video.mp4"
//   );
//   file.on("data", (chunk) => {
//     const data = Buffer.from(chunk);
//     write.write(data);
//   });
// })();
