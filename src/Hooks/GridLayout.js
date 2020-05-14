import _ from "lodash";

export function generateDefault() {
  var maxitems = 60;
  var width = 1; 
  var height = 2;
  var maxc = 9;   
  var y = 0;
  var label = "";
  return _.map(_.range(0, maxitems), function(item, i) {
    y = i <= maxc ? y : y+1;
    if (i<2) label = "POS";
    else if (i>1 && i<30) label = "Item";
    else if (i>29 && i<42) label = "Cat";
    else label = "Action";
    label = label+"-"+(i.toString());
    return {
      x: i % maxc, 
      y: y,
      w: width,
      h: height,
      i: i.toString(),
      t: label,
      static: false 
    };
  });
}


export function getFromLS (key) {
    let ls = {};
    if (global.localStorage) {
      try {
        ls = JSON.parse(global.localStorage.getItem("rgl-8")) || {};
      } catch (e) {
        /*Ignore*/
      }
    }
    return ls[key];
  }
  
export function saveToLS(key, value) {
    if (global.localStorage) {
      global.localStorage.setItem(
        "rgl-8",
        JSON.stringify({
          [key]: value
        })
      );
    }
}