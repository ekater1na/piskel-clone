import { state } from './index';

// Pensil
const pensilEl = document.getElementById('pensil');
const colorValue = document.getElementById('chosen_color').value;
window.state = { currentTool: '' };
pensilEl.addEventListener('click', () => {
  window.state.currentTool = 'pensil';
  pensilEl.classList.add('highlight-color-picker');
  pensilEl.value = colorValue;
  console.log(colorValue);
  console.log(window.state.currentTool);
});

// ColorPicker
const colorPickerEl = document.getElementById('color_picker');
window.state = { currentTool: '' };
colorPickerEl.addEventListener('click', () => {
  window.state.currentTool = 'colorPicker';
  colorPickerEl.classList.add('highlight-color-picker');
  console.log(window.state.currentTool);
});

// Eraser
const eraserEl = document.getElementById('eraser');
window.state = { currentTool: '' };
eraserEl.addEventListener('click', () => {
  window.state.currentTool = 'eraser';
  eraserEl.classList.add('highlight-color-picker');
  eraserEl.value = '#FF8040';
  console.log(window.state.currentTool);
});

// Bucket
const bucketEl = document.getElementById('bucket');
window.state = { currentTool: '' };
bucketEl.addEventListener('click', () => {
  window.state.currentTool = 'bucket';
  bucketEl.classList.add('highlight-color-picker');
  console.log(window.state.currentTool);
});

const allToolsButtons = Array.from(document.getElementsByClassName('tools-button'));

Array.from(allToolsButtons).forEach((toolBtn) => {
  toolBtn.addEventListener('click', (e) => {
    allToolsButtons.forEach((node) => {
      node.classList.remove('tools-button-active');
    });
    toolBtn.classList.add('tools-button-active');
    state.activeTool = toolBtn.dataset.tool;
  });
});

document.getElementsByClassName('main-workspace-tools')[0].addEventListener('click', (event) => {
  const b = (event && event.target) || window.event.srcElement;
  if (window.state.currentTool === 'pensil') {
    console.log('pensil');
  } else if (window.state.currentTool === 'colorPicker') {
    const colorValueEl = document.getElementById('chosen_color');
    colorValueEl.value = getComputedStyle(b).getPropertyValue || 'none';
    console.log(colorValueEl.style.value);
  } else if (
    window.state.currentTool === 'eraser'
        && b.className === 'canvas-item'
  ) {
    console.log('eraser');
  } else if (window.state.currentTool === 'bucket'
        && b.className === 'canvas-item'
  ) {
    console.log('bucket');
  }
});
