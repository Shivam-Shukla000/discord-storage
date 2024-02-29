const asyncHandler = require("express-async-handler");
const write = require("../FileSystem/write");

const handleUpload = asyncHandler(async (req, res) => {
  try {
    console.time("total upload done in");
    const parts = await write(req);
    console.log(parts);

    console.timeEnd("total upload done in");
    res.status(200).json({ message: "file uploaded" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "file not uploaded" });
  }
});

module.exports = handleUpload;
