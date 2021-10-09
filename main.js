document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;
  let gainOsc;

  const play = document.getElementById("play");
  const stop = document.getElementById("stop");
  const frequency = document.getElementById("frequency");
  const detune = document.getElementById("detune");
  const gain = document.getElementById("gain");
  const freq = document.getElementById("freq");
  const det = document.getElementById("det");
  const vol = document.getElementById("vol");

  gain.addEventListener("change", (e) => {
    if (gainOsc != null) {
      gainOsc.gain.value = e.target.value / 100;
    }
    vol.innerHTML = e.target.value / 100;
  });

  frequency.addEventListener("change", (e) => {
    if (osc != null) {
      osc.frequency.value = e.target.value;
    }
    freq.innerHTML = `${e.target.value} Hz`;
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
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    osc.type = waveType;
    osc.frequency.value = frequency.value;
    osc.detune.value = detune.value;
    osc.connect(gainOsc);
    gainOsc.gain.value = gain.value;
    gainOsc.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
  });

  stop.addEventListener("click", () => {
    if (osc != null) {
      osc.stop();
    }
  });
});
