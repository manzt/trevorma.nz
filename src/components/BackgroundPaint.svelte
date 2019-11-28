<script>
  import { onMount } from "svelte";

  let windowWidth = 0;
  let windowHeight = 0;
  let imgWidth;
  let imgHeight;
  let canvasElement;
  let imgElement;
  let mouseDown = false;
  const mousePos = {
    x: 0,
    y: 0
  };
  let imgDim = 200;
  // let source = "/apricot.png";
  function trackMouse({ x, y, type }) {
    if (type === "mousedown") {
      mouseDown = true;
    }
    if (type === "mouseup") {
      mouseDown = false;
    }
    if (mouseDown) {
      mousePos.x = x;
      mousePos.y = y;
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

  function resetDrawing() {
    coords = [];
    const ctx = canvasElement.getContext("2d");
    ctx.clearRect(0, 0, windowWidth, windowHeight);
  }

  onMount(() => {
    const ctx = canvasElement.getContext("2d");
  
  });
</script>

<!-- Bind size of window to local varaibles -->
<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div>
  <div
    bind:clientWidth={imgWidth}
    bind:clientHeight={imgHeight}>
    
    <img
      class="dn"
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
      width={windowWidth}
      height={windowHeight} 
    />

  </div>

</div>

<style>
  img {
    display: none;
    mix-blend-mode: multiply;
  }
</style>