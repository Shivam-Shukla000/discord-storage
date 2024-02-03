const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/home/katari/myProjects/discord-storage/backend//uploads/");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname + "-" + Date.now());
    cb(null, "video");
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
