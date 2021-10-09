document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;
  let gainOsc;
  let filter;

  const play = document.getElementById("play");
  const stop = document.getElementById("stop");
  const waveFrequency = document.getElementById("wave-frequency");
  const filterFrequency = document.getElementById("filter-frequency");
  const detune = document.getElementById("detune");
  const gain = document.getElementById("gain");

  const waveFreq = document.getElementById("wave-freq");
  const filterFreq = document.getElementById("filter-freq");
  const det = document.getElementById("det");
  const vol = document.getElementById("vol");

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
      if (filter != null) {
        filter.type = e.target.value;
      }
    });
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
    if (osc != null) {
      osc.stop();
    }

    osc = audioCtx.createOscillator();
    gainOsc = audioCtx.createGain();
    filter = audioCtx.createBiquadFilter();
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    osc.type = waveType;
    osc.frequency.value = waveFrequency.value;
    osc.detune.value = detune.value;

    const filterType = document.querySelector(
      'input[name="filter-type"]:checked'
    ).value;
    console.log({ filterType });
    filter.type = filterType;
    filter.frequency.value = filterFrequency.value;
    osc.connect(gainOsc);
    gainOsc.gain.value = gain.value;
    gainOsc.connect(filter);
    filter.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
  });

  stop.addEventListener("click", () => {
    if (osc != null) {
      osc.stop();
    }

    if (filter != null) {
      delete filter;
    }

    if (gainOsc != null) {
      delete gainOsc;
    }
  });
});
