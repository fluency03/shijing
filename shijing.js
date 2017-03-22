#!/usr/bin/env node

/**
 * shijing
 * @author fluency.03@gmail.com (Chang Liu)
 */

'use strict';

var net = require("net");
var repl = require("repl");
var Q = require("q");

var shijingData = require('./shijing.json');
var NumberToShu = require('./num-to-shu.json');
var ShuToNumber = require('./shu-to-num.json');
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
  return keys[keys.length * Math.random() << 0];
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
  var poem = data[key];
  return "\r\n" +
    poem.chapter + '.' + poem.section + '.' + poem.title + "\r\n" +
    poem.content.join("\r\n") +
    "\r\n";
}


/**
 * [evalInput description]
 * @param  {[type]}   cmd      [description]
 * @param  {[type]}   context  [description]
 * @param  {[type]}   filename [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function evalInput(cmd, context, filename, callback) {
  var result;
  print('------------------------------------------');
  print(cmd);
  print('------------------------------------------');
  print(context);
  print('------------------------------------------');
  print(filename);
  print('------------------------------------------');
  print(callback);
  callback(null, cmd.trim());
}

/**
 * [myWriter description]
 * @param  {[type]} output [description]
 * @return {[type]}        [description]
 */
function writer(output) {
  if (typeof output === 'integer' && output >= 1 && output <=305) {
    print(typeof output, output);
    return getOnePian(shijingData, output);
  }
}

/**
 * Define REPL server and relevant commands, and Start it.
 * @param  {object} data shijing data.
 */
var startRepl = function() {

  var keys = Object.keys(shijingData);

  var replServer = repl.start({
    prompt: "诗经> "
  });

  replServer.defineCommand('一首', {
    help: '诗经一首',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(getOnePian(shijingData, randomKey(keys)));
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

  replServer.defineCommand('编号', {
    help: '诗经一首',
    action(shu) {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(getOnePian(shijingData, ShuToNumber[shu]));
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
  startRepl();
}

module.exports = shijing;
