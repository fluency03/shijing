/**
 * https://segmentfault.com/a/1190000004881457
 */

var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

var chnUnitChar = ["", "十", "百", "千"];

var ling = "零";
var fu = "负";

var wan = "万";
var yi = "亿";


var chnUnitSection = function(unitPos) {
  var numYi = Math.floor(unitPos / 2);
  var numWan = unitPos % 2;
  return wan.repeat(numWan) + yi.repeat(numYi);
}


function SectionToChinese(section){
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var zero = true;
  while(section > 0){
    var v = section % 10;
    if(v === 0){
      if(!zero){
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    }else{
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}


function NumberToShu(num){
  var unitPos = 0;
  var strIns = '', chnStr = '';
  var needZero = false;

  if(num === 0){
    return ling;
  }

  if(num < 0){
    return fu + NumberToShu(-num);
  }

  while(num > 0){
    var section = num % 10000;
    if(needZero){
      chnStr = ling + chnStr;
    }
    strIns = SectionToChinese(section);
    console.log(section);
    strIns += (section !== 0) ? chnUnitSection(unitPos) : "";
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }

  return chnStr;
}

// 9007199254740992

console.log(NumberToShu(9007199254740995));
// 九千零七万亿一千九百九十二亿五千四百七十四万零九百九十六

module.exports = NumberToShu;
