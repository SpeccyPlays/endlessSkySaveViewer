/*
Contains all of the functions around initially building the page content
*/

function displayData(output) {
    /*
      Section to set up the html
      The output is all key:array apart from confitions which has another level of keys before the array
      */
    const tabsDiv = document.getElementById("tabs");
    const contentDiv = document.getElementById("content");
    //add pilot as heading and remove from ouput so doesn't get added as a tab
    if (output.pilot && output.pilot.length > 0) {
      const pilotDiv = document.getElementById("pilotname");
      const heading = document.createElement("h3");
      heading.innerText = "Pilot: " + output.pilot[0];
      pilotDiv.appendChild(heading);
      delete output.pilot;
    }
    const keys = Object.keys(output);
    keys.forEach((key) => {
      //create the buttons
      const keyDiv = document.createElement("button");
      keyDiv.setAttribute("class", "tablinks");
      keyDiv.setAttribute("name", key);
      keyDiv.onclick = function (e) {
        openTab(e, e.target.name);
      };
      keyDiv.innerHTML = key.toString();
      tabsDiv.appendChild(keyDiv);
      //create the content table
      const keyContentDiv = document.createElement("table");
      keyContentDiv.setAttribute("id", key);
      keyContentDiv.setAttribute("class", "tabcontent");
      //add headings
      addTableHeadings(keyContentDiv, key);
      contentDiv.appendChild(keyContentDiv);
      if (Array.isArray(output[key])) {
        try {
          output[key].forEach((item) => {
            //create tab content
            setSubContent(item, keyDiv, keyContentDiv, output);
          });
        } catch (e) {
          console.log("There was an error :", e);
        }
      } else if (checkIfObject(output[key])) {
        try {
          const conditionKeys = Object.keys(output[key]);
          conditionKeys.forEach((item) => {
            if (Array.isArray(output[key][item])) {
              setSubContent(item, keyDiv, keyContentDiv, output[key]);
            }
          });
        } catch (e) {
          console.log("There was an error :", e);
        }
      }
      removeEmptyCols(keyContentDiv);
    });
  }
  function setSubContent(item, keyDiv, contentDiv, output) {
    const row = contentDiv.insertRow(-1);
    row.addEventListener("mouseover", mouseOverTable);
    row.addEventListener("mouseout", mouseOutTable);
    row.addEventListener("mousemove", moveMoveTable);
    const headings = returnTableHeadings();
    let cells = [];
    //go backwards to create in correct order
    for (let i = headings.length - 1; i >= 0; i--) {
      cells[i] = row.insertCell(0);
      //default to a cross and change if positive later
      cells[i].innerHTML = "";
    }
    cells[0].innerHTML = item.toString();
    cells[0].setAttribute("class", "cellalignleft")
    cells[1].innerHTML = "";
    const statusKeywords = {
      offered: 2,
      done: 3,
      failed: 4,
      aborted: 5,
      declined: 6,
    };
    if (output[item] != undefined && Array.isArray(output[item])) {
      //check all values in array to see if any only contain numbers
      //this for the reputation & tribute - should only be one value
      output[item].forEach((arrayItem) => {
        // Check if the item is a number
        if (arrayItem.match(/^-?\d+(\.\d+)?$/) != null) {
          cells[1].innerHTML = arrayItem.toString();
        }

        // Loop through the status keywords to handle each case programmatically -
        //yeah chat gpt did this bit as it was way too manual before
        for (const [keyword, index] of Object.entries(statusKeywords)) {
          if (arrayItem.includes(keyword)) {
            const hasNumber = arrayItem.match(/\d+/);
            let value = "";
            if (hasNumber) {
              value = hasNumber[0].toString();
            }
            cells[index].innerHTML = value + "✓";
            break; // Exit the loop after the first match
          }
        }
      });
    }
  }
  function checkIfObject(obj) {
    return typeof obj === "object" && obj !== null;
  }
  function removeEmptyCols(table) {
    const rows = table.rows;
    if (rows.length === 0) return;

    const colCount = rows[0].cells.length;
    const emptyCols = new Array(colCount).fill(true);

    // Check for empty columns
    for (let i = 1; i < rows.length; i++) {
      // Start from 1 to skip the header row
      for (let j = 0; j < colCount; j++) {
        if (rows[i].cells[j].textContent.trim() !== "") {
          emptyCols[j] = false;
        }
      }
    }
    // Delete empty columns
    for (let j = colCount - 1; j >= 0; j--) {
      // Iterate from last to first to avoid index issues
      if (emptyCols[j]) {
        for (let i = 0; i < rows.length; i++) {
          rows[i].deleteCell(j);
        }
      }
    }
    // Check if the header cell is empty after deleting columns
    var headers = table.getElementsByTagName("th");
    for (var h = headers.length - 1; h >= 0; h--) {
      if (headers[h].textContent.trim() === "") {
        headers[h].parentNode.removeChild(headers[h]);
      }
    }
  }
  function removedChildren() {
    //remove children of high level divs
    //to remove duplication if another file is opened
    const highLevelDivs = ["pilotname", "tabs", "content"];
    highLevelDivs.forEach((divName) => {
      const element = document.getElementById(divName);
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    });
  }
  function addTableHeadings(keyContentDiv, key) {
    //create headings for content tables
    const header = keyContentDiv.createTHead();
    const row = header.insertRow(0);
    const headings = returnTableHeadings();
    headings.forEach((heading) => {
      let cell = row.insertCell(-1);
      
      if (heading == "title"){
        cell.outerHTML = `<th class="cellalignleft">${heading}</th>`;
      }
      else {
        cell.outerHTML = `<th>${heading}</th>`;
      }
    });
    keyContentDiv.appendChild(header);
  }
  function returnTableHeadings() {
    //these are used in a couple of places so putting in one function for ease of editing
    const headings = [
      "title",
      "value",
      "offered",
      "done",
      "failed",
      "aborted",
      "declined",
    ];
    return headings;
  }