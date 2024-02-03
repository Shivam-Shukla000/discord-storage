const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const handleUpload = asyncHandler(async (req, res) => {
  try {
    const readpath = path.resolve(`${__dirname}/../uploads/video`);
    const readFile = await fsPromise.open(readpath, "r");
    const readStream = readFile.createReadStream({
      highWaterMark: 7 * 1024 * 1024,
    });
    let i = 0;
    console.time("done in");
    readStream.on("data", (chunk) => {
      console.log("chunk ready to write");
      i += 0.0001;
      const writepath = path.resolve(
        `${__dirname}/../store/video_part${i.toFixed(4)}.mp4`
      );
      console.log(writepath);
      const writeStream = fs.createWriteStream(writepath);
      writeStream.write(chunk);
      writeStream.end();
    });
    readStream.on("end", () => {
      readFile.close();
      fs.unlink(path.resolve(`${__dirname}/../uploads/video`), (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("deleted");
        }
      });
      res.status(200).json({ message: "file uploaded" });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "file not uploaded" });
  }
});

module.exports = handleUpload;
