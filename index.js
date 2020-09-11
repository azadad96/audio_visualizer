var canvas, ctx, audio, context, audioSrc, analyser, bars, radius, freqs;

function render() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	analyser.getByteFrequencyData(freqs);

	var grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, radius, canvas.width / 2, canvas.height / 2, radius + 255 * 0.3);
	grad.addColorStop(0, "#4A569D");
	grad.addColorStop(1, "#DC2424");
	ctx.strokeStyle = grad;
	ctx.lineWidth = 1;
	ctx.beginPath();
	var prevR = {
		x: canvas.width / 2,
		y: canvas.height / 2 + Math.sin(1.5 * Math.PI) * (radius + freqs[0] * 0.3)
	};
	var prevL = {
		x: canvas.width / 2,
		y: canvas.height / 2 + Math.sin(1.5 * Math.PI) * (radius + freqs[0] * 0.3)
	};
	for (var i = 0; i < bars; i++) {
		var rad = 1.5 * Math.PI + (Math.PI / bars * i);
		ctx.moveTo(prevR.x, prevR.y);
		prevR.x = canvas.width / 2 + Math.cos(rad) * (radius + freqs[i] * 0.3);
		prevR.y = canvas.height / 2 + Math.sin(rad) * (radius + freqs[i] * 0.3);
		ctx.lineTo(prevR.x, prevR.y);
		ctx.moveTo(prevL.x, prevL.y);
		prevL.x = canvas.width / 2 - Math.cos(rad) * (radius + freqs[i] * 0.3);
		prevL.y = canvas.height / 2 + Math.sin(rad) * (radius + freqs[i] * 0.3);
		ctx.lineTo(prevL.x, prevL.y);
	}
	ctx.lineTo(prevR.x, prevR.y);
	ctx.stroke();
	requestAnimationFrame(render);
}

function start() {
	canvas = document.getElementById("canvas");
	canvas.hidden = false;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx = canvas.getContext("2d");
	bars = analyser.frequencyBinCount / 1.35;
	radius = 200;
	freqs = new Uint8Array(analyser.frequencyBinCount);
	audio.play();
	render();
}

window.onload = () => {
	var file = document.getElementById("audio_file");
    var lbl = document.getElementById("lbl");
	file.onchange = () => {
		file.hidden = true;
        lbl.style.visibility = "hidden";
		
		audio = new Audio();
		audio.src = URL.createObjectURL(file.files[0]);

		context = new AudioContext();
		audioSrc = context.createMediaElementSource(audio);
		analyser = context.createAnalyser();
		audioSrc.connect(analyser);
		analyser.connect(context.destination);

		start();
	};
};