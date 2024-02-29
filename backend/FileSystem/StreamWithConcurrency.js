const { Transform } = require("stream");

function originalCallback(callback) {
  //this function calls the last callback from _final
  //callback is provided in callOnFinish function
  console.log("finished");
  callback();
}

class StreamWithConcurrency extends Transform {
  constructor(chunkProcessor, maxConcurrency = 1) {
    super();
    this.chunkProcessor = chunkProcessor;
    this.maxConcurrency = maxConcurrency;
    this.concurrent = 0;
    this.chunkCount = 0;
    this.awaitCallback = null;
    this.pendingFinishCallback = null;
    this._final = this.callOnFinish(originalCallback);
  }
  callOnFinish(original) {
    return function (callback) {
      //here we call callback with the use of originalCallback by passing callback as argument
      if (this.concurrent === 0) original.call(this, callback);
      //else we store callback in pending to call the last callback later when we have processed last chunk of data
      else this.pendingFinishCallback = original.bind(this, callback);
    };
  }

  _transform(chunk, encoding, callback) {
    this.concurrent += 1;
    if (this.concurrent < this.maxConcurrency) {
      console.log("callback");
      callback(null);
    } else {
      this.awaitCallback = callback;
    }
    this.chunkProcessor(chunk, this.chunkCount)
      .then(() => {
        this.concurrent--;
        if (this.awaitCallback) {
          this.awaitCallback();
          this.awaitCallback = undefined;
        }
        if (this.concurrent === 0 && this.pendingFinishCallback) {
          this.pendingFinishCallback();
          this.pendingFinishCallback = null;
        }
      })
      .catch((err) => this.emit("error", err));
    this.chunkCount++;
  }
}

// class AsyncStreamProcessorWithConcurrency extends Transform {
//   constructor(chunkProcessor, maxConcurrency = 1) {
//     super();
//     this.chunkProcessor = chunkProcessor;
//     this.maxConcurrency = maxConcurrency;
//     this.chunkCount = 0;

//     this.lastCallback = undefined;
//     this.pendingFinish = undefined;
//     this.concurrent = 0;
//     this._final = this.callOnFinish(cbNoop);
//   }

//   callOnFinish(original) {
//     return function cbHell(callback) {
//       if (this.concurrent === 0) original.call(this, callback);
//       else this.pendingFinish = original.bind(this, callback);
//     };
//   }

//   _transform(chunk, encoding, callback) {
//     this.concurrent += 1;
//     if (this.concurrent < this.maxConcurrency) {
//       callback(null);
//     } else this.lastCallback = callback;
//     this.chunkProcessor(chunk, this.chunkCount)
//       .then(() => {
//         this.concurrent -= 1;
//         if (this.lastCallback) {
//           this.lastCallback();
//           this.lastCallback = null;
//         }
//         if (this.concurrent === 0 && this.pendingFinish) {
//           this.pendingFinish();
//           this.pendingFinish = null;
//         }
//       })
//       .catch((err) => this.emit("error", err));
//     this.chunkCount += 1;
//   }
// }

module.exports = { StreamWithConcurrency };
