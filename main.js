document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;

  const play = document.getElementById("play");
  const stop = document.getElementById("stop");
  const frequency = document.getElementById("frequency");
  const detune = document.getElementById("detune");
  const freq = document.getElementById("freq");
  const det = document.getElementById("det");

  frequency.addEventListener("change", (e) => {
    freq.innerHTML = `${e.target.value} Hz`;
  });

  detune.addEventListener("change", (e) => {
    det.innerHTML = e.target.value;
  });

  play.addEventListener("click", () => {
    if (osc != null) {
      osc.stop();
    }

    osc = audioCtx.createOscillator();
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    console.log({ frequency: frequency.value, detune: detune.value, waveType });
    osc.type = waveType;
    osc.frequency.value = frequency.value;
    osc.detune.value = detune.value;
    osc.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
  });

  stop.addEventListener("click", () => {
    if (osc != null) {
      osc.stop();
    }
  });
});
