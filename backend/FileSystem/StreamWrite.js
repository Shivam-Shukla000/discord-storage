const { Transform } = require("stream");
class StreamWrite extends Transform {
  constructor(chunkProcessor) {
    super();
    this.chunkProcessor = chunkProcessor;
  }

  _transform(chunk, encoding, callback) {
    const buff = Buffer.from(chunk);
    this.chunkProcessor(buff)
      .then(() => callback(null))
      .catch((err) => callback(err));
  }
}

module.exports = StreamWrite;
