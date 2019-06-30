import { state, PENCIL, ERASER } from './index';

const toolKeys = {
  [PENCIL]: 80,
  [ERASER]: 69,
};

document.addEventListener('keydown', (e) => {
  Object.entries(toolKeys).forEach(([tool, keyCode]) => {
    if (e.keyCode === keyCode) {
      document.querySelector(`button[data-tool=${tool}]`).click();
    }
  });
});


// Modal

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that opens the modal
const btn = document.getElementById('myBtn');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close-key')[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block';
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
