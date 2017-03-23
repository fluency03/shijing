#!/usr/bin/env node

/**
 * shijing
 * @author fluency.03@gmail.com (Chang Liu)
 */

'use strict';

var net = require("net");
var repl = require("repl");
var Q = require("q");
var emoji = require('node-emoji');

var shijingJSON = require('./json/shijing.json');
var NumberToShu = require('./json/num-to-shu.json');
var ShuToNumber = require('./json/shu-to-num.json');
var logger = require("./logger");
var print = console.log;


var keys = Object.keys(shijingJSON);


/**
 * Get a random key from an array of keys.
 * @param  {array}  keys an array of keys.
 * @return {string}      a random key.
 */
var randomKey = function(keys) {
  return keys[keys.length * Math.random() << 0];
};


/**
 * Merge one piece of shijing.
 * @param  {string} key key (1 ~ 305) of shijingJSON
 * @return {string}     one piece of shijing.
 */
var getOnePoem = function(key) {
  var poem = shijingJSON[key];
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
// function evalInput(cmd, context, filename, callback) {
//   var result;
//   print('------------------------------------------');
//   print(cmd);
//   print('------------------------------------------');
//   print(context);
//   print('------------------------------------------');
//   print(filename);
//   print('------------------------------------------');
//   print(callback);
//   callback(null, cmd.trim());
// }


/**
 * [myWriter description]
 * @param  {[type]} output [description]
 * @return {[type]}        [description]
 */
// function writer(output) {
//   if (typeof output === 'integer' && output >= 1 && output <=305) {
//     print(typeof output, output);
//     return getOnePoem(output);
//   }
// }


/**
 * Define REPL server and relevant commands, and Start it.
 */
var startRepl = function() {

  var replServer = repl.start({
    prompt: "诗经> "
  });

  replServer.defineCommand('一首', {
    help: '诗经一首',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(getOnePoem(randomKey(keys)));
      this.displayPrompt();
    }
  });

  replServer.defineCommand('心情', {
    help: '心情一个',
    action() {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(emoji.random().emoji);
      this.displayPrompt();
    }
  });

  replServer.defineCommand('编号', {
    help: '诗经一首',
    action(shu) {
      this.lineParser.reset();
      this.bufferedCommand = '';
      print(getOnePoem(ShuToNumber[shu]));
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
  // start the REPL
  this.start = startRepl;

  // get one poem based on key
  this.poem = function(key) {
    return getOnePoem(key);
  };

  // get one poem randomly
  this.random = function() {
    return getOnePoem(randomKey(keys));
  };

  // get one emoji randomly
  this.emoji = emoji.random;
}

module.exports = shijing;
