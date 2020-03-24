function spliceMime(str){
  let output = str.substring(0, str.indexOf('/'));
  return output;
}

module.exports = spliceMime;
