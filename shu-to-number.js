/**
 * https://segmentfault.com/a/1190000004881457
 */

var chnNumChar = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9
};

var chnNameValue = {
  十: {value: 10, secUnit: false},
  百: {value: 1e2, secUnit: false},
  千: {value: 1e3, secUnit: false},
  万: {value: 1e4, secUnit: true},
  亿: {value: 1e8, secUnit: true}
}

function ShuToNumber(chnStr){
  var rtn = 0;
  var section = 0;
  var number = 0;
  var preSecUnit = false;
  var preUnit = false;
  var str = chnStr.split('');

  for(var i = 0; i < str.length; i++){
    var num = chnNumChar[str[i]];
    if(typeof num !== 'undefined'){
      if(preSecUnit){
        rtn += section;
        section = 0;
        preSecUnit = false;
      }
      number = num;
      if(i === str.length - 1){
        section += number;
      }
    }else{
      var unit = chnNameValue[str[i]].value;
      var secUnit = chnNameValue[str[i]].secUnit;
      if(secUnit){
          section = (section + number) * unit;
          number = 0;
          preSecUnit = true;
      }else{
          section += (number * unit);
      }
    }
  }
  return rtn + section;
}


console.log(ShuToNumber('九千零七万亿一千九百九十二亿五千四百七十四万零九百九十五'));
// 9007199254740996

module.exports = ShuToNumber;
