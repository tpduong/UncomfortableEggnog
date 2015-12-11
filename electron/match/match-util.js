'use strict';
var matching = require('./matching');
var prefixTrie = require('./prefixTrie');
var formatVariable = require('./formatVariable');
var addPhrase = require('./addPhrase');
var regMatch = require('./regMatch');
var prefixTrie = require('./prefixTrie');


var matchUtil = function (input, fileInfo) {
  //create a new object to be returned
  var commandObj = {
    command: "",
    exact: true,
    phrase: "",
    prefix: "",
    variable: "",
    inputPhrase: input.term,
    phrasesPath: fileInfo.phrasesPath,
    guessedPhrase: "",
    // NOTE: Phrases now in matchUtil
    phrases: fileInfo.phraseObj
  };

  var prefixArray = prefixTrie.findPrefix(commandObj.inputPhrase);
  if (prefixArray[0] !== null) {
    commandObj.prefix = prefixArray[0];
    commandObj.variable = prefixArray[1];
  } else {
    // If no prefix is found in the trie, assume it is a command
    commandObj.prefix = prefixArray[1];
  }
  matching(commandObj);
  var phrase = commandObj.phrase;
  commandObj.guessedPhrase = commandObj.phrase + commandObj.variable;

  //add bash shell command
  commandObj.variable = formatVariable(commandObj.phrase, commandObj.variable);
  commandObj.command = fileInfo.commands[phrase] + commandObj.variable;
  return commandObj;
};


module.exports.matchUtil = matchUtil;
module.exports.matching = matching;
module.exports.regMatch = regMatch;
module.exports.addPhrase = addPhrase;
