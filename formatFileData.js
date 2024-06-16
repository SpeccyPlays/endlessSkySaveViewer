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
      const jsonData = parseLines(lines);
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

function parseLines(lines) {
    const jsonData = {};
    let currentObj = jsonData;
    let currentKey = null;
  
    for (let line of lines) {
      if (!line.trim()) continue; // Skip empty lines
  
      const keyMatch = line.match(/^\t*/); // Match leading tabs
      const indentLevel = keyMatch ? keyMatch[0].length : 0;
  
      const lineContent = line.trim();
  
      if (indentLevel === 0) {
        // Top-level key
        currentKey = lineContent.replace(/"/g, ''); // Remove quotes
        currentObj[currentKey] = {};
        currentObj = jsonData; // Reset currentObj to top-level for new keys
      } else {
        // Nested values
        const [key, ...values] = lineContent.split('\t').map(item => item.trim().replace(/"/g, ''));
        const nestedObj = currentObj[currentKey];
  
        if (!nestedObj[key]) {
          nestedObj[key] = values.join('\t'); // Join remaining values with tabs
        } else {
          if (!Array.isArray(nestedObj[key])) {
            nestedObj[key] = [nestedObj[key]]; // Convert to array if not already
          }
          nestedObj[key].push(values.join('\t')); // Push new value to array
        }
      }
    }
  
    return jsonData;
  }
  
  

module.exports = { formatData };

