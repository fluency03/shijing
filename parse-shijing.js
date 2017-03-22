/**
 * Parse shijing
 * @author fluency.03@gmail.com (Chang Liu)
 */

var fs = require('fs')
var readline = require("readline");
var path = require('path')

var reader = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, 'shijing.txt')),
  output: fs.createWriteStream("/dev/null"),
  terminal: false
});


function parseShijing(callback) {
  var shijing = {};

  var numZhang = 0;
  var numPian = 0;

  var zhang;
  var pian;

  reader.on("line", function(line) {

    if (line.indexOf('::') !== -1) {
      numZhang++;
      zhang = line;
      // console.log("numZhang: ", numZhang);
    } else if (line.match(/\d+/g)) {
      numPian++;
      pian = line;
      // console.log("numPian: ", numPian);
      shijing[pian] = [];
    } else {
      shijing[pian].push(line);
    }
  }).on('close', () => {
    callback(null, shijing);
  });

}

module.exports = parseShijing;
