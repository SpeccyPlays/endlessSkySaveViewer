const fs = require("node:fs");

function formatData(filePath, res) {
  let response = {
    success: false,
    errors: [],
    data: {},
  };

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      response.errors.push(err);
      console.log("Error reading file:", err);
      return res.json({ response });
    }
    try {
      const jsonData = parseToNestedObject(data);
      response.data = jsonData;
      response.success = true;
      console.log(jsonData);
      console.log(filePath, "Read and parsed successfully");
    } catch (parseErr) {
      response.errors.push(parseErr);
      console.log("Error parsing data:", parseErr);
    }

    return res.json({ response });
  });
}

function parseToNestedObject(data) {
  let output = {
    conditions: {},
    ships: [],
  };
  data = data.split("\n");
  let topLevelLine = "";
  for (line in data) {
    //a lot of repeated code but slight differences between some of the values
    const text = data[line];
    const numOfTabs = numberOfTabs(text);
    const newLine = text.slice(0, text.indexOf(" ")).toLowerCase();
    if (numOfTabs == 0) {
      topLevelLine = text;
    }
    if (newLine.includes("pilot") && numOfTabs == 0) {
      const tidiedText = text.trim().replace(/"/g, "");
      const key = tidiedText.slice(0, tidiedText.indexOf(" "));
      const value = tidiedText.slice(tidiedText.indexOf(" ") + 1).trim();
      if (!output[key]) {
        output[key] = [];
      }
      output[key].push(value);
    }
    if (newLine.includes("mission") && numOfTabs == 0) {
      const tidiedText = text.trim().replace(/"/g, "");
      const key = tidiedText.slice(0, tidiedText.indexOf(" "));
      const value = tidiedText.slice(tidiedText.indexOf(" ") + 1).trim();
      if (!output[key]) {
        output[key] = [];
      }
      output[key].push(value);
    }
    if (newLine.includes("conditions")) {
      //seems pointless but stops extra value being added
    } else if (topLevelLine.includes("conditions")) {
      //groups the different missions a bit better
      const tidiedText = text.trim().replace(/"/g, "");
      const key = tidiedText.slice(0, tidiedText.indexOf(":"));
      const value = tidiedText.slice(tidiedText.indexOf(":") + 1).trim();
      if (!output.conditions[key]) {
        output.conditions[key] = [];
      }
      output.conditions[key].push(value);
    }
    if (newLine.includes("visited") && numOfTabs == 0) {
      const tidiedText = text.trim().replace(/"/g, "");
      const key = tidiedText.slice(0, tidiedText.indexOf(" "));
      const value = tidiedText.slice(tidiedText.indexOf(" ") + 1).trim();
      if (!output[key]) {
        output[key] = [];
      }
      output[key].push(value);
    }
    if (newLine.includes("ship") && numOfTabs == 0) {
      output.ships.push(text);
    } else if (topLevelLine.includes("ship")) {
      output.ships.push(text);
    }
  }
  return output;
}
function numberOfTabs(text) {
  return text.match(/^\s*/)[0].length;
}
module.exports = { formatData };
