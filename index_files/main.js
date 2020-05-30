window.onload = function () {

    // When a direction button is clicked, add a number of navigations to Codey's nav and write to the #instructions <div>.
    // The number is determined by the current value of the <select> element.
    document.querySelectorAll('.direction-button').forEach( (elem) => {
      elem.addEventListener('click', (event) => {
        const count = Number.parseInt(document.querySelector('select').value);
        const div = document.querySelector('div#instructions');
  
        for (let i=0; i<count; i++) {
          addNavigation(event.target.value);
        }
  
        div.innerHTML += `${count} ${event.target.value.toUpperCase()}<br>`
      });
    });
  
    // When the reset button is clicked, reset Codey, the path, the nav, the #instructions.div
    document.querySelector('button#reset').addEventListener('click', (event) => {
      resetCodey();
      resetPath();
      resetNav();
      resetInstructionsDiv();
    });
  
    // When the run button is clicked, reset Codey and the path
    document.querySelector('button#run').addEventListener('click', (event) => {
      resetCodey();
      resetPath();
      codey.static = false;
    });
  
  }
  