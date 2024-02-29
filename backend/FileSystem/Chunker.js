const { Transform } = require("stream");

class Chunker extends Transform {
  constructor(chunkSize) {
    super();
    this.chunkSize = chunkSize;
    this.chunkArray = [];
    this.bufferSize = 0;
  }
  _transform(chunk, encoding, callback) {
    this.bufferSize += chunk.length;
    this.chunkArray.push(chunk);
    if (this.bufferSize >= this.chunkSize) {
      this.push(Buffer.concat(this.chunkArray, this.chunkSize));
      this.bufferSize -= this.chunkSize;
      const lastChunk = this.chunkArray[this.chunkArray.length - 1];
      this.chunkArray =
        this.bufferSize === 0
          ? []
          : [Buffer.from(lastChunk.slice(lastChunk.length - this.bufferSize))];
    }
    callback();
  }
  _flush(callback) {
    this.push(Buffer.concat(this.chunkArray));
    callback();
  }
}

module.exports = Chunker;
