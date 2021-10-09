document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;
  let gainOsc;
  let filter;
  let delay;

  const play = document.getElementById("play");
  const stop = document.getElementById("stop");
  const waveFrequency = document.getElementById("wave-frequency");
  const filterFrequency = document.getElementById("filter-frequency");
  const filterBandwidth = document.getElementById("filter-bandwidth");
  const delayTime = document.getElementById("delay-time");
  const detune = document.getElementById("detune");
  const gain = document.getElementById("gain");

  const waveFreq = document.getElementById("wave-freq");
  const filterFreq = document.getElementById("filter-freq");
  const filterBand = document.getElementById("filter-band");
  const det = document.getElementById("det");
  const vol = document.getElementById("vol");
  const delayMS = document.getElementById("delay-ms");

  const waveShapes = document.querySelectorAll('input[name="wave"]');

  function stopOscillator() {
    if (osc != null) {
      osc.stop();
    }

    if (filter != null) {
      delete filter;
    }

    if (gainOsc != null) {
      delete gainOsc;
    }

    if (delay != null) {
      delete delay;
    }
  }

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
      if (filter != null) {
        filter.type = e.target.value;
      }
    });
  });

  delayTime.addEventListener("change", (e) => {
    if (delay != null) {
      delay.delayTime.value = e.target.value / 1000;
    }

    delayMS.innerHTML =
      e.target.value === 1 ? "1 millisecond" : `${e.target.value} milliseconds`;
  });

  filterBandwidth.addEventListener("change", (e) => {
    if (filter != null) {
      filter.Q.value = e.target.value / 100;
    }

    filterBand.innerHTML = e.target.value / 100;
  });

  filterFrequency.addEventListener("change", (e) => {
    if (filter != null) {
      filter.frequency.value = e.target.value;
    }

    filterFreq.innerHTML = `${e.target.value} Hz`;
  });

  gain.addEventListener("change", (e) => {
    if (gainOsc != null) {
      gainOsc.gain.value = e.target.value / 100;
    }
    vol.innerHTML = e.target.value / 100;
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
    det.innerHTML = e.target.value;
  });

  play.addEventListener("click", () => {
    // stop if already playing
    stopOscillator();

    // init audio nodes
    osc = audioCtx.createOscillator();
    gainOsc = audioCtx.createGain();
    filter = audioCtx.createBiquadFilter();
    delay = audioCtx.createDelay(2);
    delay.delayTime.value = delayTime.value / 1000;

    // set osc wave, freq and pitch
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    osc.type = waveType;
    osc.frequency.value = waveFrequency.value;
    osc.detune.value = detune.value;

    // set filter type, freq and band
    const filterType = document.querySelector(
      'input[name="filter-type"]:checked'
    ).value;
    filter.type = filterType;
    filter.frequency.value = filterFrequency.value;
    filter.Q.value = filterBandwidth.value / 100;

    // osc into gain node
    osc.connect(gainOsc);
    // set gain value
    gainOsc.gain.value = gain.value;
    // gain into filter node
    gainOsc.connect(filter);
    // filter into delay
    filter.connect(delay);
    // delay to output
    delay.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
  });

  stop.addEventListener("click", stopOscillator);
});
