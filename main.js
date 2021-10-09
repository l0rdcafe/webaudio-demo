document.addEventListener("DOMContentLoaded", () => {
  const audioCtx = new AudioContext();

  let osc;

  const play = document.getElementById("play");
  const stop = document.getElementById("stop");

  play.addEventListener("click", () => {
    osc = audioCtx.createOscillator();
    const waveType = document.querySelector('input[name="wave"]:checked').value;
    osc.type = waveType;
    osc.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime);
  });

  stop.addEventListener("click", () => {
    osc.stop();
  });
});
