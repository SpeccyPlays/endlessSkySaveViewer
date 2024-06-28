/*
Contains the functions that are called upon during user navigation
*/
function openTab(evt, tabName) {
    console.log("Click registered ", tabName);
    // Declare all variables
    var i, tabcontent, tablinks, searchInputs;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    //hide all the search inputs
    searchInputs = document.getElementsByClassName("search");
    for (let i = 0; i < searchInputs.length; i++){
      searchInputs[i].style.display = "none";
      searchInputs[i].className = searchInputs[i].className.replace(" active", "");
    }
    
    //find the search input related to the tab selected and show it
    const searchInput = document.getElementsByName(tabName+"search");
    if (searchInput.length > 0){
      //There should only ever be one search element with the name
      searchInput[0].style.display = "block";
      searchInput[0].className += " active";
    }
    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  function mouseOverTable(evt){
    /*
    Show a tooltip and summary of the row on the table the mouse is over
    */
    const tooltip = document.getElementById('tooltip');
    const table = evt.target.closest('table');
    const target = evt.target.closest('tr');
    if (target) {
      const headers = table.querySelectorAll('thead th');
        const cells = target.querySelectorAll('td');
        let tooltipText = '';
        headers.forEach((header, index) => {
            if (cells[index].textContent != ""){
              tooltipText += `${header.textContent}: ${cells[index].textContent}\n`;
            }
            
        });
        tooltip.style.display = 'block';
        tooltip.textContent = tooltipText;
    }
  }
  function moveMoveTable(evt){
    tooltip.style.top = evt.pageY + 10 + 'px';
    tooltip.style.left = evt.pageX + 10 + 'px';
  }
  function mouseOutTable(evt){
    tooltip.style.display = 'none';
  }
  function searchTable(evt){

  }