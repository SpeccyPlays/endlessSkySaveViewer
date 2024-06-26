/*
Contains the functions that are called upon during user navigation
*/
function openTab(evt, tabName) {
  console.log("Click registered ", tabName);

  document.querySelectorAll(".tabcontent").forEach(el => el.style.display = "none");
  document.querySelectorAll(".tablinks").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".search").forEach(el => {
    el.style.display = "none";
    el.classList.remove("active");
  });

  const searchInput = document.querySelector(`[name="${tabName}search"]`);
  if (searchInput) {
    searchInput.style.display = "block";
    searchInput.classList.add("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}
function mouseOverTable(evt) {
  /*
    Show a tooltip and summary of the row on the table the mouse is over
    */
  const tooltip = document.getElementById("tooltip");
  const table = evt.target.closest("table");
  const target = evt.target.closest("tr");
  if (target) {
    const headers = table.querySelectorAll("thead th");
    const cells = target.querySelectorAll("td");
    let tooltipText = "";
    headers.forEach((header, index) => {
      if (cells[index].textContent != "") {
        tooltipText += `${header.textContent}: ${cells[index].textContent}\n`;
      }
    });
    tooltip.style.display = "block";
    tooltip.textContent = tooltipText;
  }
}
function moveMoveTable(evt) {
  tooltip.style.top = evt.pageY + 10 + "px";
  tooltip.style.left = evt.pageX + 10 + "px";
}
function mouseOutTable(evt) {
  tooltip.style.display = "none";
}
function searchTable(evt) {
  let parent, input, filter, table, tr, td, i, txtValue;
  input = evt.target;
  filter = input.value.toUpperCase();
  parent = evt.target.parentElement;
  //get the child table. The tables are called tabcontent as I hacked around a tutorial
  table = parent.getElementsByClassName("tabcontent");
  tr = parent.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
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