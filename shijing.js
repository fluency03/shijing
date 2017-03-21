#!/usr/bin/env node

/**
 * shijing
 *
 * @author fluency.03@gmail.com (Chang Liu)
 */

'use strict';

var net = require("net");
var repl = require("repl");

var logger = require("./logger");

var print = console.log;

var mood = function () {
  var m = [ "^__^", "-___-;", ">.<", "<_>" ];
  return m[Math.floor(Math.random()*m.length)];
};


function shijing() {
  //A remote node repl that you can telnet to!
  net.createServer(function (socket) {
    var remote = repl.start("诗经::远程> ", socket);
    //Adding "mood" and "bonus" to the remote REPL's context.
    remote.context.mood = mood;
    remote.context.诗经 = "shijing";
    remote.context.bonus = "UNLOCKED";
  }).listen(5001);

  logger.info("Remote REPL started on port 5001.");

  //A "local" node repl with a custom prompt
  var local = repl.start("诗经::本地> ");

  // Exposing the function "mood" to the local REPL's context.
  local.context.mood = mood;
  local.context.诗经 = "shijing";
  local.context.shijing = "诗经";
  local.context.作者 = "刘畅";
}

shijing();

module.exports = shijing;
