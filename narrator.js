var fs = require('fs');

var TIME_CHAR = 40;
var TIME_WORD = 60;
var TIME_LINE = 500;
var TIME_PUNCTUATION = 700;
var TIME_COMMA = 300;
var TIME_QUESTION = 1200;
var TIME_MANYDOTS = 700;

var readmeLines = fs.readFileSync('readme.md').toString().split('\n');

var firstLine = true, firstWord = true;
var line = [], word = [];

function write() {
  function getNextChar(cb) {
    if (word.length)
      setTimeout(function() { cb(word.shift()); }, TIME_CHAR);
    else
      getNextWord(function(nextWord) {
        word = nextWord;
        if (!word) return cb();
        getNextChar(cb);
      });
  }
  function getNextWord(cb) {
    if (!firstWord)
      process.stdout.write(' ');
    firstWord = false;
    if (line.length)
      setTimeout(function() { cb(line.shift().split('')); }, TIME_WORD);
    else
      getNextLine(function(nextLine) {
        line = nextLine;
        if (!line) return cb();
        firstWord = true;
        getNextWord(cb);
      });
  }
  function getNextLine(cb) {
    if (!firstLine)
      process.stdout.write('\n');
    firstLine = false;
    if (readmeLines.length)
      setTimeout(function() { cb(readmeLines.shift().split(' ')); }, TIME_LINE);
    else
      cb();
  }

  getNextChar(function(c) {
    if (c) {
      process.stdout.write(c);
      var moreTime = 0;
      if (/[.!]|…/.test(c))
        moreTime = TIME_PUNCTUATION;
      if (/[?]/.test(c))
        moreTime = TIME_QUESTION;
      if (/,|—/.test(c))
        moreTime = TIME_COMMA;
      setTimeout(write, moreTime);
    }
  });
}

write();
