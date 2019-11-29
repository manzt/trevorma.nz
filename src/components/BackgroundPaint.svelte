<script> 
  import { onMount } from "svelte";

  let canvas;
  let img;
  let imgDim = 200;
  let mouseDown = false;
  let cachedCoords = [];

  function trackMouse({x, y, type}) {
    if (type === "mousedown") {
      mouseDown = true;
    }
    if (type === "mouseup") {
      mouseDown = false;
    }
    if (mouseDown) {
      // Keep track of x, y positions in case of resize event
      cachedCoords = [...cachedCoords, [x,y]];
      // Add single layer to existing canvas
      drawImage(x, y);
    }
  }

  function drawImage(x, y) {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      x - imgDim / 2,
      y - imgDim / 2,
      imgDim,
      imgDim
    );
  }

  // https://github.com/observablehq/stdlib/blob/master/src/dom/context2d.js
  function create2dContext() {
    const ctx = canvas.getContext("2d");
    const w = window.innerWidth; 
    const h = window.innerHeight;
    const dpi = window.devicePixelRatio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w * dpi;
    canvas.height = h * dpi;
    ctx.scale(dpi, dpi);
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function resize() {
    clearCanvas();
    create2dContext();
    // Draw all points onto new resized canvas
    for (const [x,y] of cachedCoords) {
      drawImage(x, y);
    }
  }

  onMount(() => {
    create2dContext();
  });

</script>

<svelte:window on:resize={() => resize()} />

<div>
  <img
    width={imgDim}
    height={imgDim}
    bind:this={img}
    src="/appricot.png"
    alt="appricot1" 
  />

  <canvas
    on:mousemove={trackMouse}
    on:mouseup={trackMouse}
    on:mousedown={trackMouse}
    bind:this={canvas}
  />
</div>

<style>
  img {
    display: none;
  }
</style>