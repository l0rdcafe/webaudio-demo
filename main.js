document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;
  let compReductionTimeout;
  // global audio nodes for oscillator
  const gainOsc = audioCtx.createGain();
  const filterNode = audioCtx.createBiquadFilter();
  const delayNode = audioCtx.createDelay(2);
  const delayDryNode = audioCtx.createGain();
  const delayWetNode = audioCtx.createGain();
  const delayMixNode = audioCtx.createGain();
  const compressor = audioCtx.createDynamicsCompressor();
  const panner = audioCtx.createPanner();

  // playback controls
  const play = document.getElementById("play");
  const stop = document.getElementById("stop");

  // input fields
  const waveFrequency = document.getElementById("wave-frequency");
  const delayTime = document.getElementById("delay-time");
  const filterFrequency = document.getElementById("filter-frequency");
  const filterBandwidth = document.getElementById("filter-bandwidth");
  const detune = document.getElementById("detune");
  const gain = document.getElementById("gain");
  const delayWet = document.getElementById("delay-wet");
  const compressorThreshold = document.getElementById("compressor-threshold");
  const compressorRatio = document.getElementById("compressor-ratio");
  const compressorKnee = document.getElementById("compressor-knee");
  const compressorAttack = document.getElementById("compressor-attack");
  const compressorRelease = document.getElementById("compressor-release");
  const pan = document.getElementById("pan");
  const depth = document.getElementById("depth");

  // DOM nodes to display values
  const waveFreq = document.getElementById("wave-freq");
  const filterFreq = document.getElementById("filter-freq");
  const filterBand = document.getElementById("filter-band");
  const det = document.getElementById("det");
  const vol = document.getElementById("vol");
  const delayMS = document.getElementById("delay-ms");
  const delayWetness = document.getElementById("delay-wetness");
  const compThreshold = document.getElementById("comp-threshold");
  const compRatio = document.getElementById("comp-ratio");
  const compKnee = document.getElementById("comp-knee");
  const compAttack = document.getElementById("comp-attack");
  const compRelease = document.getElementById("comp-release");
  const compReduction = document.getElementById("comp-reduction");
  const panVal = document.getElementById("pan-val");
  const depthVal = document.getElementById("depth-val");

  function stopOscillator() {
    if (osc != null) {
      osc.stop();
    }

    clearReductionMeter();
  }

  function reductionMeter() {
    compReduction.innerHTML = `${compressor.reduction.toFixed(2)} db`;
    compReductionTimeout = requestAnimationFrame(reductionMeter);
  }

  function clearReductionMeter() {
    if (compReductionTimeout != null) {
      cancelAnimationFrame(compReductionTimeout);
    }

    compReduction.innerHTML = "0 db";
  }

  const waveShapes = document.querySelectorAll('input[name="wave"]');
  waveShapes.forEach((shape) => {
    shape.addEventListener("change", (e) => {
      if (osc != null) {
        osc.type = e.target.value;
      }
    });
  });

  const filterTypes = document.querySelectorAll('input[name="filter-type"]');
  filterTypes.forEach((filterType) => {
    filterType.addEventListener("change", (e) => {
      filterNode.type = e.target.value;
    });
  });

  depth.addEventListener("change", (e) => {
    if (panner != null) {
      panner.positionZ.value = e.target.value;
    }
    depthVal.innerHTML = e.target.value;
  });

  pan.addEventListener("change", (e) => {
    if (panner != null) {
      panner.positionX.value =
        e.target.value === 0 ? e.target.value : e.target.value / 50;
    }
    panVal.innerHTML =
      e.target.value === 0
        ? "0 C"
        : e.target.value > 0
        ? `${e.target.value} R`
        : `${e.target.value * -1} L`;
  });

  delayWet.addEventListener("change", (e) => {
    delayDryNode.gain.value = (100 - e.target.value) / 100;
    delayWetNode.gain.value = e.target.value / 100;
    delayWetness.innerHTML = `${e.target.value}%`;
  });

  delayTime.addEventListener("change", (e) => {
    delayNode.delayTime.value = e.target.value / 1000;
    delayMS.innerHTML = `${e.target.value} ms`;
  });

  compressorThreshold.addEventListener("change", (e) => {
    compressor.threshold.value = e.target.value;
    compThreshold.innerHTML = `${e.target.value} db`;
  });

  compressorRatio.addEventListener("change", (e) => {
    compressor.ratio.value = e.target.value;
    compRatio.innerHTML = e.target.value;
  });

  compressorKnee.addEventListener("change", (e) => {
    compressor.knee.value = e.target.value;
    compKnee.innerHTML = e.target.value;
  });

  compressorAttack.addEventListener("change", (e) => {
    compressor.attack.value = e.target.value / 1000;
    compAttack.innerHTML = `${e.target.value} ms`;
  });

  compressorRelease.addEventListener("change", (e) => {
    compressor.release.value = e.target.value / 1000;
    compRelease.innerHTML = `${e.target.value} ms`;
  });

  filterBandwidth.addEventListener("change", (e) => {
    filterNode.Q.value = e.target.value / 100;
    filterBand.innerHTML = e.target.value / 100;
  });

  filterFrequency.addEventListener("change", (e) => {
    filterNode.frequency.value = e.target.value;
    filterFreq.innerHTML = `${e.target.value} Hz`;
  });

  gain.addEventListener("change", (e) => {
    gainOsc.gain.value = e.target.value / 100;
    vol.innerHTML = `${e.target.value / 100} db`;
  });

  waveFrequency.addEventListener("change", (e) => {
    if (osc != null) {
      osc.frequency.value = e.target.value;
    }
    waveFreq.innerHTML = `${e.target.value} Hz`;
  });

  detune.addEventListener("change", (e) => {
    if (osc != null) {
      osc.detune.value = e.target.value;
    }
    det.innerHTML = `${e.target.value} ct`;
  });

  play.addEventListener("click", () => {
    // stop if already playing
    stopOscillator();

    // init audio nodes
    osc = audioCtx.createOscillator();
    // delay time config
    delayNode.delayTime.value = delayTime.value / 1000;

    // compressor node
    compressor.threshold.value = compressorThreshold.value;
    compressor.ratio.value = compressorRatio.value;
    compressor.knee.value = compressorKnee.value;
    compressor.attack.value = compressorAttack.value;
    compressor.release.value = compressorRelease.value;

    // set osc wave, freq and pitch
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    osc.type = waveType;
    osc.frequency.value = waveFrequency.value;
    osc.detune.value = detune.value;

    // set filter type, freq and band
    const filterType = document.querySelector(
      'input[name="filter-type"]:checked'
    ).value;
    filterNode.type = filterType;
    filterNode.frequency.value = filterFrequency.value;
    filterNode.Q.value = filterBandwidth.value / 100;

    // set delay channels
    delayDryNode.gain.value = (100 - delayWet.value) / 100;
    delayWetNode.gain.value = delayWet.value / 100;

    panner.positionX.value = pan.value / 50;
    panner.positionZ.value = depth.value / 10;

    // osc into gain node
    osc.connect(gainOsc);
    // set gain value
    gainOsc.gain.value = gain.value;
    // gain into filter node
    gainOsc.connect(filterNode);
    // filter into delay
    filterNode.connect(delayNode);
    // delay to wet channel
    delayNode.connect(delayWetNode);
    // wet channel back to delay
    delayWetNode.connect(delayNode);

    // OG filter signal into dry delay channel
    filterNode.connect(delayDryNode);
    // dry delay signal into delay mix
    delayDryNode.connect(delayMixNode);
    // wet delay signal into delay mix
    delayWetNode.connect(delayMixNode);

    // delay mix to compressor
    delayMixNode.connect(compressor);
    // compressor to panner
    compressor.connect(panner);
    // panner to output
    panner.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
    reductionMeter();
  });

  stop.addEventListener("click", stopOscillator);
});
