// Polyfill for readable-stream/lib/_stream_writable.js to avoid process usage
// This is a minimal implementation to avoid the process is not defined error

const EventEmitter = require('events').EventEmitter;
const util = require('util');

function Writable(options) {
  if (!(this instanceof Writable)) return new Writable(options);

  this._writableState = new WritableState(options, this);
  EventEmitter.call(this);
}

util.inherits(Writable, EventEmitter);

function WritableState(options, stream) {
  this.objectMode = !!options && options.objectMode;
  this.highWaterMark = options && options.highWaterMark || 16384;
  this.writable = true;
  this.ended = false;
  this.ending = false;
  this.finished = false;
  this.destroyed = false;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  // Minimal implementation
  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }
  if (cb) cb();
  return true;
};

Writable.prototype.end = function(chunk, encoding, cb) {
  this._writableState.ending = true;
  this._writableState.ended = true;
  this._writableState.finished = true;
  if (cb) cb();
  this.emit('finish');
};

Writable.prototype.destroy = function() {
  this._writableState.destroyed = true;
  this.emit('close');
};

module.exports = Writable;
