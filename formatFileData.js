const fs = require('node:fs');

function formatData(filePath, res) {
  let response = {
    success: false,
    errors: [],
    data: {}
  };

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      response.errors.push(err);
      console.log('Error reading file:', err);
      return res.json({ response });
    }

    try {
      const lines = data.split('\n');
      const jsonData = parseToNestedObject(data);
      //const jsonData = parseLines(lines);
      response.data = jsonData;
      response.success = true;
      console.log(filePath, 'Read and parsed successfully');
    } catch (parseErr) {
      response.errors.push(parseErr);
      console.log('Error parsing data:', parseErr);
    }

    return res.json({ response });
  });
}

function parseToNestedObject(data) {
  function parseData(lines, level = 0) {
      const result = new Map();
      let currentKey = null;

      while (lines.length > 0) {
          const line = lines[0];
          const currentLevel = line.search(/\S/);

          if (currentLevel < level) break;

          if (currentLevel === level) {
              const parts = line.trim().split(/ (.+)/);
              const key = parts[0].replace(/"/g, '');
              const value = parts[1] ? parts[1].replace(/"/g, '').trim() : null;

              if (value) {
                  if (!result.has(key)) result.set(key, []);
                  if (result.get(key) instanceof Map) {
                      result.set(key, [{ [value]: "" }]);
                  } else {
                      result.get(key).push({ [value]: "" });
                  }
                  lines.shift();
              } else {
                  if (!result.has(key)) result.set(key, []);
                  lines.shift();
                  currentKey = key;
              }
          } else if (currentLevel > level) {
              const nestedLines = [];
              while (lines.length > 0 && lines[0].search(/\S/) > level) {
                  nestedLines.push(lines.shift());
              }
              if (currentKey) {
                  result.set(currentKey, parseData(nestedLines, currentLevel));
                  currentKey = null;
              }
          } else {
              lines.shift();
          }
      }

      return result;
  }

  function mapToObject(map) {
      const obj = {};
      for (const [key, value] of map.entries()) {
          if (value instanceof Map) {
              obj[key] = mapToObject(value);
          } else {
              obj[key] = value;
          }
      }
      return obj;
  }

  const lines = data.split('\n').filter(line => line.trim() !== '');
  const output = parseData(lines);

  return mapToObject(output);
}

function parseLines(lines) {
  const jsonData = [];
  let currentObj = {};
  let currentKey = null;
  let currentNestedObj = null;

  lines.forEach(line => {
    if (!line.trim()) return; // Skip empty lines

    const keyMatch = line.match(/^\t*/); // Match leading tabs
    const indentLevel = keyMatch ? keyMatch[0].length : 0;
    const lineContent = line.trim();

    if (indentLevel === 0) {
      // New top-level key
      if (Object.keys(currentObj).length > 0) {
        jsonData.push(currentObj);
      }

      const [key, ...values] = lineContent.split('\t').map(item => item.trim().replace(/"/g, ''));
      currentObj = {};
      currentKey = key;
      currentObj[currentKey] = [];

      // Handle nested values after the first tab-separated value
      if (values.length > 0) {
        currentNestedObj = {};
        currentNestedObj[values[0]] = values.slice(1).join('\t');
        currentObj[currentKey].push(currentNestedObj);
      }
    } else {
      // Nested values under currentKey
      const [key, ...values] = lineContent.split('\t').map(item => item.trim().replace(/"/g, ''));
      currentNestedObj = {};

      if (!currentNestedObj[key]) {
        currentNestedObj[key] = values.join('\t'); // Join remaining values with tabs
      } else {
        if (!Array.isArray(currentNestedObj[key])) {
          currentNestedObj[key] = [currentNestedObj[key]]; // Convert to array if not already
        }
        currentNestedObj[key].push(values.join('\t')); // Push new value to array
      }

      currentObj[currentKey].push(currentNestedObj);
    }
  });

  // Push the last currentObj to jsonData if it exists and has data
  if (Object.keys(currentObj).length > 0) {
    jsonData.push(currentObj);
  }

  return jsonData;
}
module.exports = { formatData };

