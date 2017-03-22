#!/usr/bin/env node

/**
 * shijing
 * @author fluency.03@gmail.com (Chang Liu)
 */

'use strict';

var net = require("net");
var repl = require("repl");
var Q = require("q");

// var ShuToNumber = require("./ShuToNumber");
// var NumberToShu = require("./NumberToShu");
// var shus = {零:0, 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9, 十:10, 百:1e2, 千:1e3, 万:1e4, 亿:1e8};

var parseShijing = require("./parseShijing");

var logger = require("./logger");

var print = console.log;


/**
 * Get a random mood.
 * @return {string} a random mood.
 */
var mood = function() {
  var m = [ "^__^", "-___-;", ">.<", "<_>" ];
  return m[Math.floor(Math.random() * m.length)];
};

/**
 * Get a random key from an array of keys.
 * @param  {array}  keys an array of keys.
 * @return {string}      a random key.
 */
var randomKey = function(keys) {
  return keys[ keys.length * Math.random() << 0];
};

/**
 * Load shijing.
 * @return {promise} a promise with shijing data resolved, or error rejected.
 */
var getShijing = function() {
  var deferred = Q.defer();

  parseShijing(function(error, data) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
}

/**
 * Merge one piece of shijing.
 * @return {string} one piece of shijing.
 */
var getOnePian = function(data, key) {
  return key + "\r\n" + data[key].join("\r\n");
}

/**
 * Define REPL server and relevant commands, and Start it.
 * @param  {object} data shijing data.
 */
var startRepl = function(data) {

  var keys = Object.keys(data);

  var replServer = repl.start({prompt: "诗经> "});

  replServer.defineCommand('一首', {
    help: '诗经一首',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(getOnePian(data, randomKey(keys)));
      this.displayPrompt();
    }
  });

  replServer.defineCommand('心情', {
    help: '心情一个',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(mood());
      this.displayPrompt();
    }
  });

  replServer.context.shijing = "诗经";
  replServer.context.什么 = "诗经";
}

/**
 * shijing
 */
var shijing = function() {
  getShijing()
    .then(startRepl)
    .catch(print);
}

module.exports = shijing;
