<script> 
  import { onMount, beforeUpdate } from "svelte";

  export let containerHeight;
  let canvas;
  let img;
  let imgDim = 200;
  let mouseDown = false;
  let cachedCoords = [];
  let innerHeight;

  function trackMouse({x, y, type}) {
    if (type === "mousedown") {
      mouseDown = true;
    }
    if (type === "mouseup") {
      mouseDown = false;
    }
    if (mouseDown) {
      // Keep track of x, y positions in case of resize event
      cachedCoords = [...cachedCoords, [x,y + window.scrollY]];
      // Add single layer to existing canvas
      drawImage(x, y + window.scrollY);
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
    const h = containerHeight > window.innerHeight ? 
      containerHeight : 
      window.innerHeight - 7; // prevent creating scrollbar
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

  function handleClear() {
    cachedCoords = [];
    clearCanvas();
  }

  function handleResize() {
    clearCanvas();
    create2dContext();
    // Draw all points onto new resized canvas
    for (const [x,y] of cachedCoords) {
      drawImage(x, y);
    }
  }

  beforeUpdate(() => {
    if (canvas) {
      clearCanvas();
      create2dContext();
      // Draw all points onto new resized canvas
      for (const [x,y] of cachedCoords) {
        drawImage(x, y);
      }
    }
  });

  onMount(() => {
    create2dContext();
  });
</script>

<svelte:window on:resize={handleResize} />

<div >
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

{#if cachedCoords.length !== 0}
    <button on:click={handleClear}>clear</button>
{/if}

<style>
  img {
    display: none;
  }

  button {
    font-family : inherit;
    position: fixed;
    bottom: 10px;
    right: 50px;
    font-size: 16px;
    text-decoration: underline;
    border: none;
    background: none;
    cursor: pointer;
  }

  button:hover {
    text-shadow: 2px 2px 4px #A9A9A9;
  }
</style>