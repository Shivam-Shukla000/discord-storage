const fs = require("fs");
const fsPromise = require("fs/promises");
const path = require("path");

(async () => {
  const outputpath = `${__dirname}/output/video.mp4`;
  const inputPath = `${__dirname}/store`;
  console.time("done in");
  console.log("ran");
  fs.readdir(inputPath, (err, fileNames) => {
    console.log("ran inside");
    if (err) {
      console.log(err);
    }
    console.log(fileNames);
    const writeStream = fs.createWriteStream(outputpath);
    fileNames.forEach((fileName) => {
      const filePath = path.resolve(`${__dirname}/store/${fileName}`);

      const content = fs.readFileSync(filePath);
      writeStream.write(content);
      console.log("wrote" + fileName);
    });
    writeStream.end();
    console.timeEnd("done in");
  });
})();
