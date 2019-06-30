/* eslint-disable radix */
/* eslint-disable no-use-before-define */
export const PENCIL = 'pensil';
export const COLOR_PICKER = 'color_picker';
export const ERASER = 'eraser';
export const BUCKET = 'bucket';

export const state = {
  penSize: 16,
  frames: [],
  activeFrame: 0,
  mainCanvas: {
    context: null,
    isMouseDown: false,
  },
  color: null,
  activeTool: PENCIL,
};

document.addEventListener('DOMContentLoaded', () => {
  const canv = document.getElementById('myCanvas');
  const frames = document.getElementById('frames');

  state.mainCanvas.context = document.getElementById('myCanvas').getContext('2d');
  state.color = document.querySelector('#chosen_color').value;
  state.frames = [createFrame(0)];
  Array.from(document.getElementsByClassName('canvas-item')).forEach(e => e.classList.add('canvas-item-selected'));

  Array.from(document.getElementsByClassName('pen-size-tool'))
    .forEach((element) => {
      element.addEventListener('click', (e) => {
        state.penSize = parseInt(e.target.dataset.size);
      });
    });

  // Color input changing
  document.querySelector('#chosen_color').addEventListener('input', updateColor, false);

  function updateColor(event) {
    state.color = event.target.value;
  }
  // Add frame
  function createFrame(frameInd) {
    const newItem = document.createElement('div');
    newItem.classList.add('canvas-item');

    newItem.addEventListener('click', () => {
      state.activeFrame = frameInd;
      Array.from(document.getElementsByClassName('canvas-item'))
        .forEach(e => e.classList.remove('canvas-item-selected'));
      newItem.classList.add('canvas-item-selected');

      drawFrame(state.mainCanvas.context, state.frames[frameInd].points);
      drawFrame(state.frames[frameInd].canvasContext, state.frames[frameInd].points);
    });

    const canvasChild = document.createElement('canvas');
    canvasChild.width = 96;
    canvasChild.height = 96;
    const canvasContext = canvasChild.getContext('2d');
    canvasContext.scale(0.14, 0.14);
    newItem.appendChild(canvasChild);

    const delBtn = document.createElement('button');
    delBtn.innerText = ' ';
    delBtn.className = 'del-btn';
    delBtn.style.backgroundImage = "url('src/pictures/trash-alt-solid.svg')";
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.frames.length === 1) {
        return;
      }
      state.frames.splice(frameInd, 1);
      if (state.activeFrame === frameInd) {
        state.activeFrame = 0;
        state.frames[state.activeFrame].container.click();
      }
      newItem.remove();
    });

    // Duplicate
    const duplBtn = document.createElement('button');
    duplBtn.innerText = ' ';
    duplBtn.className = 'dupl-frame-btn';
    duplBtn.style.backgroundImage = "url('src/pictures/copy-regular.svg')";

    duplBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newFrameInd = state.frames.length;
      state.frames.push(createFrame(newFrameInd));
      state.frames[newFrameInd].points = [...state.frames[frameInd].points];
      state.frames[newFrameInd].container.click();
    });

    newItem.appendChild(delBtn);
    newItem.appendChild(duplBtn);
    frames.appendChild(newItem);

    return {
      points: [],
      canvasContext,
      container: newItem,
    };
  }

  document.getElementById('add-frame-btn')
    .addEventListener('click', () => {
      state.frames.push(createFrame(state.frames.length));
    });



  // Pensil
  canv.onmousedown = (e) => {
    state.mainCanvas.isMouseDown = true;
    const [x, y] = getMouseXY(e, canv);
    state.frames[state.activeFrame].points.push({
      x,
      y,
      penSize: state.penSize,
      color: state.color,
      draw: true,
    });
  };

  canv.addEventListener('mouseup', (e) => {
    state.mainCanvas.isMouseDown = false;
    const [x, y] = getMouseXY(e, canv);
    state.frames[state.activeFrame].points.push({
      x,
      y,
      penSize: state.penSize,
      color: state.color,
      draw: false,
    });
  });

  function getMouseXY(event, canvas) {
    let offsetX = 0;
    let offsetY = 0;

    let theCanvas = canvas;
    if (theCanvas.offsetParent !== undefined) {
      do {
        offsetX += theCanvas.offsetLeft;
        offsetY += theCanvas.offsetTop;
        theCanvas = theCanvas.offsetParent;
      } while (theCanvas);
    }

    const x = event.pageX - offsetX;
    const y = event.pageY - offsetY;
    const targetCoord = document.getElementById('cursor-coordinates');
    targetCoord.innerHTML = `<p>${`${x} : ${y}`}<p>`;

    return [x, y];
  }

  canv.addEventListener('mousemove', (e) => {
    if (state.mainCanvas.isMouseDown) {
      const [x, y] = getMouseXY(e, canv);
      const point = {
        x,
        y,
        penSize: state.penSize,
        color: state.color,
        draw: true,
      };
      if (state.activeTool === ERASER) {
        point.color = '#FFF';
      }

      state.frames[state.activeFrame].points.push(point);
      drawFrame(state.mainCanvas.context, state.frames[state.activeFrame].points);
      drawFrame(state.frames[state.activeFrame].canvasContext, state.frames[state.activeFrame].points);
    }
  });

  function drawFrame(context, points) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.lineJoin = 'round';
    for (let i = 0; i < points.length; i += 1) {
      const prevPoint = points[i - 1];
      const curPoint = points[i];
      context.lineWidth = curPoint.penSize;

      context.beginPath();

      if (curPoint.draw && prevPoint) {
        context.moveTo(prevPoint.x, prevPoint.y);
      } else {
        context.moveTo(curPoint.x - 1, curPoint.y);
      }
      context.lineTo(curPoint.x, curPoint.y);
      context.closePath();

      context.strokeStyle = curPoint.color;
      context.stroke();
    }
  }

  const targetCanvas = document.getElementById('canvas-size');
  targetCanvas.innerHTML = `<p>${`${canv.width} : ${canv.height}`}<p>`;
});
