require("dotenv").config();
const Token = process.env.LOGIN_ID;
const axios = require("axios");
import { StreamWrites } from "./StreamWithConcurrency";
s;
async function read(parts) {
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
    const proxyUrl = await res.data.attachments[0].proxy_url;
    console.log(proxyUrl);

    const video = await axios.get(proxyUrl);
  }
}
s;
