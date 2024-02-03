const express = require("express");
const fs = require("fs");
const cors = require("cors");
const port = 5002;
const asyncHandler = require("express-async-handler");
const handleUpload = require("./controller/uploadController");
// const playVideo = require("./controller/playerController");
const app = express();
app.use(cors());
const upload = require("./middleware/multer");

// app.get("/videos/:filename", playVideo);

app.post("/upload", upload.single("file"), handleUpload);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
