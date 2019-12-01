<script> 
  import { onMount } from 'svelte';

  export let width = 500;
  export let height = 500;
  export let imgScale = 0.25;
  export let imgSrc;
  export let imgAlt;

  let canvas;
  let img;
  let mouseDown = false;
  let cachedCoords = [];

  function trackMouse(e) {
    if (e.type === "mousedown") mouseDown = true;
    if (e.type === "mouseup") mouseDown = false;
    if (mouseDown) {
      const x = e.x;
      const y = e.y + window.scrollY; 
      // Keep track of x, y positions in case of resize event
      cachedCoords = [...cachedCoords, [x, y]];
      // Add single layer to existing canvas
      drawImage(x, y);
    }
  }

  function clearCanvas() {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawImage(x, y) {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      img,
      x - img.width / 2,
      y - img.height / 2,
      img.width,
      img.height
    );
  }

  function drawAllCoords() {
      for (const [x, y] of cachedCoords) {
        drawImage(x, y);
      }
  }

  // https://github.com/observablehq/stdlib/blob/master/src/dom/context2d.js
  function createContext2d(w, h) {
    const ctx = canvas.getContext("2d");
    const dpi = window.devicePixelRatio;
    canvas.width = w * dpi;
    canvas.height = h * dpi;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpi, dpi);
  }

  $: if (canvas) {
    // create new canvas if width or height changes
    createContext2d(width, height - 7);
    // re-render all cached points
    drawAllCoords();
  }

  onMount(() => {
    img.width = img.width * imgScale;
    img.height = img.height * imgScale;
  });

</script>

<div >
  <img
    bind:this={img}
    src={imgSrc}
    alt={imgAlt}
  />

  <canvas
    on:mousemove={trackMouse}
    on:mouseup={trackMouse}
    on:mousedown={trackMouse}
    bind:this={canvas}
  />
</div>

{#if cachedCoords.length !== 0}
    <button on:click={() => {
      cachedCoords = [];
      clearCanvas();
    }}>clear</button>
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