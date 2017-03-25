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
var fulltextsearchlight = require('full-text-search-light');
var search = new fulltextsearchlight();

var shijingJSON = require('./json/shijing.json');
var NumberToShu = require('./json/num-to-shu.json');
var ShuToNumber = require('./json/shu-to-num.json');
var logger = require("./logger");
var print = console.log;


var keys = Object.keys(shijingJSON);
var commands = '.break .clear .exit .help .save .load .editor ' +
               '.一首 .心情 .编号 .搜索 .清理 .再见';


/**
 * Add all poems into search.
 */
var addForSearch = function() {
  for (var order in shijingJSON) {
    search.add(shijingJSON[order]);
  }
}


/**
 * Search the given content.
 * @param  {string} word content for search
 * @return {array}       poems matched
 */
var searchWord = function(word) {
  return search.search(word);
}


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
  return mergeOnePoem(poem);
}


/**
 * Marge the content of one poem object into string.
 * @param  {object} poem one poem object
 * @return {string}      merged string from one poem
 */
var mergeOnePoem = function(poem) {
  return "\r\n" +
    poem.chapter + '.' + poem.section + '.' + poem.title + "\r\n" +
    poem.content.join("\r\n") +
    "\r\n";
}


/**
 * A completer function for TAB completion in REPL.
 * @param  {string} line input content
 * @return {array}       array of possible hits and original line
 */
var completer = function(line) {
  var completions = commands.split(' ');

  function searchCommands(c) {
    return c.indexOf(line) === 0;
  }

  var hits = completions.filter(searchCommands);
  // show all completions if none found
  return [hits.length ? hits : completions, line];
}


/**
 * Define REPL server and relevant commands, and Start it.
 */
var startRepl = function() {

  var replServer = repl.start({
    prompt: "诗经> ",
    completer: completer
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

  replServer.defineCommand('搜索', {
    help: '搜索',
    action(word) {
      this.lineParser.reset();
      this.bufferedCommand = '';
      searchWord(word).forEach(function(poem) {
        print(mergeOnePoem(poem));
      });
      this.displayPrompt();
    }
  });

  replServer.defineCommand("清理", {
    help: "清理屏幕",
    action() {
      process.stdout.write('\u001B[2J\u001B[0;0f');
      process.stdout.write('诗经> ');
    }
  });

  replServer.defineCommand('再见', function() {
    print('再见!');
    this.close();
  });

  replServer.context.shijing = "诗经";
  replServer.context.什么 = "诗经";
}

/**
 * shijing
 */
var shijing = function() {

  addForSearch();

  // start the REPL
  this.start = startRepl;

  // get one poem based on key
  this.poem = function(key) {
    return shijingJSON[key];
  };

  // get one poem randomly
  this.random = function() {
    return shijingJSON[randomKey(keys)];
  };

  // search, get an arry of poems based on given content
  this.search = searchWord;

  // get one emoji randomly
  this.emoji = emoji.random;
}

module.exports = (function() {
  return new shijing();
})();
