const write = require("./FileSystem/write");
const fs = require("fs");
(async () => {
  const readStream = fs.createReadStream(
    "/home/katari/myProjects/discord-storage/backend/input/video.mp4"
  );
  const parts = await write(readStream);
  console.log(parts);
})();
