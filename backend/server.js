const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();
const port = 5002;
const timeout = require("connect-timeout");
//const asyncHandler = require("express-async-handler");
const handleUpload = require("./controller/uploadController");
// const handleDownload = require("./controller/downloadController");
// const playVideo = require("./controller/playerController");
const app = express();
app.use(cors());
//const upload = require("./middleware/multer");
//const { handleDownload } = require("./controller/downloadController");

// app.get("/videos/:filename", playVideo);

app.post("/upload", handleUpload);

// app.get("/files/:filename", handleDownload);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
