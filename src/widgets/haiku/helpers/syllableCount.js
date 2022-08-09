//import {syllable} from 'syllable';
const syl = require('syllabificate');

module.exports = (word) => {
  return syl.countSyllables(word);
}
