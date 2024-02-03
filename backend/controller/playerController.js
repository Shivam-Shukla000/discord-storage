const fs =require('fs')
const path = require('path')
const playVideo = (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.resolve(`${__dirname}/../output/video.mp4`)
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    console.log(range);
    if (range) {
      const parts = range.replace("bytes=", "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      console.log(start);
      console.log(end);

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "content-type": "video/mp4",
      };
      res.writeHead(206, head);
      console.log("everything fone");
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "content-type": "video/mp4",
      };
      res.writeHead(200, head);
      const file = fs.createReadStream(filePath);
      file.pipe(res);
    }
  } catch (error) {
    console.log(error);
    res.status(402).json({ message: "file not found" });
  }
};

const 

module.exports = playVideo ;
