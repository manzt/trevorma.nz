<script>  a
  import { onMount } from "svelte";

  let imgElement;
  let imgDim = 200;
  let imgWidth;
  let imgHeight;

  let canvasElement;

  let mouseDown = false;
  let dpi;

  let windowWidth;
  let windowHeight;

  let maxWidth;
  let maxHeight;[



  
  function trackMouse({x, y, type}) {
    if (type === "mousedown") {
      mouseDown = true;
    }
    if (type === "mouseup") {
      mouseDown = false;
    }
    if (mouseDown) {
      drawImage(x, y);
    }
  }

  function drawImage(x, y) {
    const dimensions = imgDim;
    const ctx = canvasElement.getContext("2d");

    ctx.drawImage(
      imgElement,
      x - dimensions / 2,
      y - dimensions,
      dimensions,
      dimensions
    );
  }

  // function resetDrawing() {
  //   const ctx = canvasElement.getContext("2d");
  //   ctx.clearRect(0, 0, windowWidth, windowHeight);
  // }
  function resize(){
    const ctx = canvasElement.getContext("2d");
    let temp = ctx.getImageData(0, 0, windowWidth, windowHeight);
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    canvasElement.width = windowWidth;
    canvasElement.height = windowHeight;
    ctx.putImageData(temp, 0, 0);
  }

  onMount(() => {
    const ctx = canvasElement.getContext("2d");
    dpi = devicePixelRatio;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    resize();
  });
</script>

<!-- Bind size of window to local varaibles -->
<svelte:window on:resize={() => resize()} />



<div>
  <img
    width={imgDim}
    height={imgDim}
    bind:this={imgElement}
    src="/appricot.png"
    alt="appricot1" 
  />

  <canvas
    on:mousemove={trackMouse}
    on:mouseup={trackMouse}
    on:mousedown={trackMouse}
    bind:this={canvasElement}
  />
</div>

<style>
  img {
    display: none;
    mix-blend-mode: multiply;
  }
</style>