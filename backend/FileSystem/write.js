require("dotenv").config();
const Token = process.env.LOGIN_ID;
const axios = require("axios");
const uuid = require("uuid").v4;
const FormData = require("form-data");
const { Readable } = require("stream");
const Chunker = require("../FileSystem/Chunker");
const {
  StreamWithConcurrency,
} = require("../FileSystem/StreamWithConcurrency");
const { read, createReadStream } = require("fs");

async function write(stream) {
  const highWaterMark = 23 * 1024 * 1024;
  let parts = [];
  const options = {
    headers: {
      Authorization: `Bot ${Token}`,
    },
  };
  function streamFromBuffer(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  const processChunk = async (chunk, chunkCount) => {
    try {
      const formData = new FormData();
      console.log(chunk.length);

      formData.append("files[0]", chunk, `${chunkCount}`);
      const res = await axios.post(
        "https://discord.com/api/v9/channels/1202772184968462346/messages",
        formData,
        {
          headers: {
            Authorization: `Bot ${Token}`,
            ...formData.getHeaders(),
          },
        }
      );
      parts[chunkCount] = res.data.id;
    } catch (err) {
      console.log(err);
      console.log("processchunk failed");
    }
  };
  return new Promise((resolve, reject) => {
    stream
      .on("aborted", () => reject(new Error("file upload aborted")))
      .pipe(new Chunker(highWaterMark))
      .pipe(new StreamWithConcurrency(processChunk, 6))
      .on("finish", () => resolve(parts))
      .on("error", (err) => reject(err));
  });
}

module.exports = write;
