/*
Contains the functions that format the data from the text file
*/
function formatData(data) {
  let output = {
    conditions: {},
    event: [],
  };
  let topLevelLine = "";
  for (line in data) {
    //a lot of repeated code but slight differences between some of the values
    const text = data[line];
    const numOfTabs = numberOfTabs(text);
    const newLine = text.slice(0, text.indexOf(" ")).toLowerCase();
    const tidiedText = text.trim().replace(/"/g, "");
    if (numOfTabs == 0) {
      topLevelLine = text;
      const key = tidiedText.slice(0, tidiedText.indexOf(" "));
      const value = tidiedText.slice(tidiedText.indexOf(" ") + 1).trim();
      if (newLine.includes("pilot")) {
        if (!output[key]) {
          output[key] = [];
        }
        output[key].push(value);
      } else if (newLine.includes("reputation")) {
        if (!output[key]) {
          output[key] = {};
        }
      } else if (newLine.includes("tribute")) {
        if (!output[key]) {
          output[key] = {};
        }
      } else if (newLine.includes("licenses")) {
        const key = tidiedText;
        if (!output[key]) {
          output[key] = [];
        }
      } else if (newLine.includes("conditions")) {
        if (!output.conditions) {
          output.conditions = {};
        }
      } else if (newLine.includes("visited")) {
        if (!output[key]) {
          output[key] = [];
        }
        output[key].push(value);
      }
    }

    //Not including mission as I think it's the current live missions
    /*if (newLine.includes("mission") && numOfTabs == 0) {
        const tidiedText = text.trim().replace(/"/g, "");
        const key = tidiedText.slice(0, tidiedText.indexOf(" "));
        const value = tidiedText.slice(tidiedText.indexOf("\"") + 1).trim();
        if (!output[key]) {
          output[key] = [];
        }
        output[key].push(value);
      }*/
    if (topLevelLine.includes("reputation")) {
      const key = tidiedText.slice(0, tidiedText.lastIndexOf(" "));
      const value = tidiedText.slice(tidiedText.lastIndexOf(" ") + 1, tidiedText.length);
      //avoids a spurious entry
      if (key !== "reputation") {
        if (!output.reputation[key]) {
          output.reputation[key] = [];
        }
        output.reputation[key].push(value);
      }
    } else if (topLevelLine.includes("tribute")) {
      const key = tidiedText.slice(0, tidiedText.indexOf(" "));
      const value = tidiedText.slice(tidiedText.indexOf(" ") + 1).trim();
      //avoids a spurious entry
      if (key !== "tribute") {
        if (!output.tribute[key]) {
          output.tribute[key] = [];
        }
        output.tribute[key].push(value);
      }
    } else if (topLevelLine.includes("licenses")) {
      const value = tidiedText;
      //avoid ending up with a wrong entry
      if (tidiedText !== "licenses") {
        output.licenses.push(value);
      }
    } else if (topLevelLine.includes("conditions")) {
      //groups the different missions a bit better
      let key = "";
      let value = "";
      //Some conditions are events so account for this
      //this is really messy but works
      if (tidiedText.slice(0, tidiedText.indexOf(":")).includes("event")) {
        key = tidiedText.slice(0, tidiedText.indexOf(":"));
        value = tidiedText.slice(tidiedText.indexOf(":") + 1).trim();
      } else {
        key = tidiedText.slice(0, tidiedText.lastIndexOf(":"));
        value = tidiedText.slice(tidiedText.lastIndexOf(":") + 1).trim();
      }
      //avoid ending up with a wrong entry
      //chops the s of conditions
      if (key !== "condition") {
        if (key.includes("event")) {
          output.event.push(value);
        } else if (!output.conditions[key]) {
          output.conditions[key] = [];
          output.conditions[key].push(value);
        } else {
          output.conditions[key].push(value);
        }
      }
    }

    /*
      //commenting out ship as I think the game makes ship data easily viewable
      if (newLine.includes("ship") && numOfTabs == 0) {
        if (!output.ships){
          output.ships = [];
        }
        output.ships.push(text);
      } else if (topLevelLine.includes("ship")) {
        output.ships.push(text);
      }*/
  }
  return output;
}
function numberOfTabs(text) {
  return text.match(/^\s*/)[0].length;
}
