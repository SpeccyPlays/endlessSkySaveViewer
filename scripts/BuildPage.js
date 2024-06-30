/*
Contains all of the functions around initially building the page content
*/
function displayData(output) {
    /*
      Section to set up the html
      The output is all key:array apart from confitions which has another level of keys before the array
      */
    const tabsDiv = document.getElementById("tabs");
    const content = document.getElementById("content");
    //add pilot as heading and remove from ouput so doesn't get added as a tab
    if (output.pilot && output.pilot.length > 0) {
      const pilotDiv = document.getElementById("pilotname");
      const heading = document.createElement("h3");
      heading.innerText = "Pilot: " + output.pilot[0];
      pilotDiv.appendChild(heading);
      delete output.pilot;
    }
    const keys = Object.keys(output);
    //counter is going to be used to set the first content to open by default
    let counter = 0;

    const fragmentTabs = document.createDocumentFragment();
    const fragmentContent = document.createDocumentFragment();

    keys.forEach((key) => {
      const contentDiv = document.createElement("div");
      contentDiv.setAttribute("name", key);
      fragmentContent.appendChild(contentDiv);
      //create the buttons
      const keyDiv = document.createElement("button");
      keyDiv.setAttribute("class", "tablinks");
      keyDiv.setAttribute("name", key);
      //set key to open by default - this is ugly
      if (counter == 0){
        keyDiv.className += " defaultOpen";
      }
      keyDiv.onclick = (e) => openTab(e, e.target.name);
      keyDiv.innerHTML = key.toString();
      fragmentTabs.appendChild(keyDiv);
      //setup search box
      const search = document.createElement("input");
      search.type = "text";
      search.name = `${key}search`;
      search.placeholder ="Search..";
      search.className = "search";
      search.onkeyup = (e) => searchTable(e);
      contentDiv.appendChild(search);
      //create the content table
      const keyContentDiv = document.createElement("table");
      keyContentDiv.setAttribute("id", key);
      keyContentDiv.setAttribute("class", "tabcontent");
      
      //add headings
      addTableHeadings(keyContentDiv);
      contentDiv.appendChild(keyContentDiv);
      if (Array.isArray(output[key])) {
        try {
          output[key].forEach((item) => setSubContent(item, keyDiv, keyContentDiv, output));
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
      counter ++;
      removeEmptyCols(keyContentDiv);
    });
    tabsDiv.appendChild(fragmentTabs);
    content.appendChild(fragmentContent);
  }
  function setSubContent(item, keyDiv, contentDiv, output) {
    const row = contentDiv.insertRow(-1);
    row.addEventListener("mouseover", mouseOverTable);
    row.addEventListener("mouseout", mouseOutTable);
    row.addEventListener("mousemove", moveMoveTable);
    const headings = returnTableHeadings();
    let cells = Array(headings.length).fill(null).map(() => row.insertCell(-1));
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

        if (/^-?\d+(\.\d+)?$/.test(arrayItem)) {
          cells[1].innerHTML = arrayItem
        }

        // Loop through the status keywords to handle each case programmatically -
        //yeah chat gpt did this bit as it was way too manual before
        for (const [keyword, index] of Object.entries(statusKeywords)) {
          if (arrayItem.includes(keyword)) {
            let value = (arrayItem.match(/\d+/) || [""])[0];
            cells[index].innerHTML = value + "✓";
            //add a hidden checkbox to each
            let deleteCheck = document.createElement("input");
            deleteCheck.type = "checkbox";
            deleteCheck.className = "deletecheck";
            deleteCheck.value = "Delete";
            cells[index].appendChild(deleteCheck);
            break; // Exit the loop after the first match
          }
        }

      });
    }
    const editableList = getEditableItems();
    if (editableList.includes(keyDiv.name)){
      let editButton = document.createElement("input");
      editButton.type = "button";
      editButton.className = "editbutton";
      //Only conditions can delete
      const text = (keyDiv.name === "conditions") ? "Delete" : "Edit";
      editButton.innerHTML = text;
      editButton.value = text;
      editButton.onclick = (e) => clickEditButton(e);
      cells[cells.length - 1].appendChild(editButton);
    };
    
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
  function addTableHeadings(keyContentDiv) {
    //create headings for content tables
    const header = keyContentDiv.createTHead();
    const row = header.insertRow(0);
    const headings = returnTableHeadings();
    headings.forEach((heading) => {
      let cell = row.insertCell(-1);
      cell.outerHTML = heading === "title" ? `<th class="cellalignleft">${heading}</th>` : `<th>${heading}</th>`;
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
      "        "//used for edit button
    ];
    return headings;
  }
  function getEditableItems(){
    const editableItems = [
      "conditions",
      "reputation",
      "tribute"
    ]
    return editableItems;
  }