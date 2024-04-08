import { Hono } from 'hono';
import { Ai } from '@cloudflare/ai';
declare global {
	interface Env {
		AI: any;
	}
}

const app = new Hono<Env>();

app.get('/', async (c) => {
	const html = /*html*/ `
<!DOCTYPE html>
<html lang="en" data-theme="light">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>ImageHarmony</title>
		<link
			rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
		/>
		<link rel="icon" type="image/x-icon" href="https://github.com/flos-code/DA-Bubble/assets/148456982/dc1a4eb1-42e4-49f6-b32f-b27b7c3ec286">

<style>
	:root[data-theme='light'] {
	--text: rgb(3, 33, 26);
	--text02: rgba(3, 33, 26, 0.2);
	--background: rgb(248, 254, 253);
	--primary: rgb(0, 188, 143);
	--primary03: rgba(0, 188, 143, 0.3);
	--primary05: rgba(0, 188, 143, 0.5);
	--secondary: rgb(144, 121, 243);
	--accent: rgb(170, 76, 239);
	--accent07: rgb(170, 76, 239, 0.7);
	--accentLight: rgba(191, 142, 226, 0.7);
}
:root[data-theme='dark'] {
	--text: rgb(222, 252, 245);
	--text02: rgba(222, 252, 245, 0.2);
	--background: rgb(1, 9, 8);
	--primary: rgb(66, 255, 211);
	--primary03: rgba(66, 255, 211, 0.3);
	--primary05: rgba(66, 255, 211, 0.5);
	--secondary: rgb(35, 12, 136);
	--accent: rgb(110, 16, 178);
	--accent07: rgb(110, 16, 178, 0.7);
	--accentLight: rgba(130, 64, 178, 0.7);
}

* {
	box-sizing: border-box;
}

@import url('https://fonts.googleapis.com/css?family=Salsa:700|Salsa:400');

body {
	font-family: 'Salsa';
	font-weight: 400;
	background-color: var(--background);
	color: var(--text);
	margin: 0;
}

#emojis {
	position: absolute;
	inset: 40px;
	z-index: -1;
}

.emoji {
	position: absolute;
	font-size: 32px; /* Adjust size as needed */
	filter: drop-shadow(4px 4px 8px var(--text));
}

header {
	margin: 16px calc((100vw - 1000px) / 2);
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.d-none {
	display: none !important;
}

.inputSection {
	display: flex;
	margin: 0 calc((100vw - 1000px) / 2);
	justify-content: space-between;
	align-items: center;
}

.buttonContainer {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	padding: 5px;
	width: 380px;
	background-color: var(--primary03);
}

.genreButton {
	font-family: 'Salsa';
	font-weight: 600;
	font-size: 24px;
	padding: 4px;
	width: 120px;
	height: 70px;
	color: var(--text);
	background: var(--primary05);
	backdrop-filter: blur(9.1px);
	-webkit-backdrop-filter: blur(9.1px);
	border: none;
	transition: all 0.3s;
}

.genreButton:hover {
	cursor: pointer;
	background: var(--primary03);
	box-shadow: 0 6px 30px var(--text02);
}

.genreButton:active {
	background: var(--accent);
}

.genreButton:disabled {
	cursor: not-allowed !important;
	background: lightgray !important;
	color: gray;
}

.selectedGenre {
	background-color: var(--accent) !important;
}

.imgContainer {
	width: 230px;
	height: 230px;
	position: relative;
}

#uploadedImage {
	position: absolute;
	inset: 0;
	width: 230px;
	height: 230px;
}

#uploadImageText {
	position: absolute;
	top: 32px;
	left: 50%;
	transform: translate(-50%, 0);
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	gap: 8px;
	font-weight: 600;
	font-size: 20px;
	width: 80%;
	color: var(--secondary);
}

.uploadIcon {
	font-variation-settings: 'wght' 600;
	font-size: 48px !important;
}

#uploadImageBtn {
	position: absolute;
	top: 165px;
	left: 50%;
	transform: translate(-50%, 0);
	color: var(--text);
	background: var(--primary05);
	backdrop-filter: blur(9.1px);
	-webkit-backdrop-filter: blur(9.1px);
	border: none;
	font-family: 'Salsa';
	font-weight: 600;
	font-size: 16px;
	padding: 8px;
	transition: all 0.3s;
}

#uploadImageBtn:hover {
	cursor: pointer;
	background: var(--primary03);
	box-shadow: 0 6px 30px var(--text02);
}

#uploadImageBtn:active {
	background: var(--accent);
}

#deleteImage {
	position: absolute;
	top: 0;
	right: 0;
	border: none;
	opacity: 0.7;
	background-color: var(--primary);
	transition: all 0.3s;
}

#deleteImage:hover {
	cursor: pointer;
	opacity: 1;
}

#deleteImage:active {
	background: var(--accent);
}

.deleteIcon {
	font-variation-settings: 'wght' 600;
	font-size: 32px !important;
}

.drop-area {
	position: absolute;
	inset: 0;
	border: 4px dashed var(--secondary);
}

.file-elem {
	opacity: 0;
	position: absolute;
	pointer-events: none;
}

.outputSection {
	margin: 32px 0 0 calc(((100vw - 1000px) / 2) + 385px);
	width: 380px;
	padding: 16px 32px;
	display: flex;
	gap: 8px;
	flex-direction: column;
	align-items: center;
	background-color: var(--accentLight);
	font-size: 20px;
}

#uploadInfo {
	text-align: center;
}

#generateText {
	font-family: 'Salsa';
	font-weight: 600;
	font-size: 24px;
	padding: 8px;
	color: var(--text);
	background: var(--accent);
	border: none;
	transition: all 0.3s;
}

#generateText:disabled {
	cursor: not-allowed !important;
	background: lightgray !important;
	color: gray;
}

#generateText:hover {
	cursor: pointer;
	background: var(--secondary);
}

#generateText:active {
	background: var(--accentLight);
}

#reset {
	font-family: 'Salsa';
	font-weight: 600;
	font-size: 24px;
	padding: 8px;
	color: var(--text);
	background: var(--accent);
	border: none;
	transition: all 0.3s;
}

#reset:hover {
	cursor: pointer;
	background: var(--secondary);
}

#reset:active {
	background: var(--accentLight);
}

#modelResponse {
	background-color: var(--accent07);
	padding: 8px;
	max-height: 240px;
	overflow-y: scroll;
}

.loadingStep {
	display: flex;
	align-items: center;
	gap: 8px;
}

.step1Icon {
	animation: step1Movement 4s linear infinite;
}

@keyframes step1Movement {
  0% {
    transform: translate(-6px, -6px);
  }
  25% {
    transform: translate(6px, 6px);
  }
  50% {
    transform: translate(6px, -6px);
  }
  75% {
    transform: translate(-6px, 6px);
  }
  100% {
    transform: translate(-6px, -6px);
  }
}

.step2Icon {
	animation: step2Movement 2s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes step2Movement {
	0%, 100% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

.step3Icon {
	animation: step3Movement 4s linear infinite;
}

@keyframes step3Movement {
  0% {
    transform: translate(-6px, -6px);
  }
  17% {
    transform: translate(6px, -6px);
  }
  33% {
    transform: translate(-6px, -3px);
  }
  50% {
    transform: translate(6px, -3px);
  }
  67% {
    transform: translate(-6px, 0);
  }
  83% {
    transform: translate(6px, 0);
  }
  100% {
    transform: translate(-6px, -6px);
  }
}


.loader-container {
	display: flex;
	width: 46px;
	height: 46px;
	flex-wrap: wrap;
	gap: 2px;
	padding: 2px;
	background-color: var(--accent);
}

.square {
	width: 20px;
	height: 20px;
	background-color: var(--accent); /* White squares */
	animation: changeColor 2s infinite linear;
}

/* Animation Keyframes */
@keyframes changeColor {
	0%,
	100% {
		background-color: var(--accentLight);
	}
	25% {
		background-color: var(--accent);
	}
	50% {
		background-color: var(--accentLight);
	}
	75% {
		background-color: var(--accentLight);
	}
}

/* Apply different animation delays to each square */
.loader-container .square:nth-child(2) {
	animation-delay: 0.5s;
}

.loader-container .square:nth-child(4) {
	animation-delay: 1s;
}

.loader-container .square:nth-child(3) {
	animation-delay: 1.5s;
}

#broccoliBob {
	position: absolute;
	top: 420px;
	transform-origin: center center;
	transform: rotate(30deg) translateX(-120px);
	display: flex;
	transition: opacity 3s ease-out;
	/* Removed the transition property because we will use animations */
}

.byeBob {
	opacity: 0;
}

#bobThinking {
    position: absolute;
    width: 40px;
    left: 80px;
    top: 32px;
}

/* Define a keyframe for moving Bob horizontally */
@keyframes moveBob {
	from {
		transform: translateX(-120px) rotate(30deg);
	}
	to {
		transform: translateX(0) rotate(30deg);
	}
}

@keyframes rotateBob {
	from {
		transform: rotate(30deg);
	}
	to {
		transform: rotate(0);
	}
}

.showBob {
	animation: moveBob 1.5s forwards, rotateBob 1.5s 1.5s forwards; /* Start after moveBob finishes */
}

#interactionBob {
	display: flex;
	flex-direction: column;
	gap: 4px;
	align-items: center;
}

.chatBob {
	width: 240px;
	padding: 4px;
	max-height: 400px;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.messageBob {
	background-color: var(--primary03);
	padding: 4px;
}

.messageUser {
	background-color: var(--accentLight);
	padding: 4px;
}

.btnBob {
	font-family: 'Salsa';
	font-size: 18px;
	border: 2px solid var(--text);
	display: flex;
	gap: 4px;
	align-items: center;
	padding: 4px;
	color: var(--text);
	background-color: transparent;
}

.btnBob:hover {
	cursor: pointer;
	box-shadow: 0px 4px 12px 4px var(--text02);
}

.imgBroccoliBob {
	width: 200px;
	height: 200px;
}

.imgBroccoliBob:hover {
	cursor: pointer;
}

::-webkit-scrollbar {
	width: 12px;
}

::-webkit-scrollbar-track {
	background: transparent;
}
::-webkit-scrollbar-thumb {
	background-color: var(--accentLight);
	border: 3px solid transparent;
	background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
	background-color: var(--primary03);
}

.sr-only {
	position: absolute;
	left: -9999px;
	opacity: 0;
}

.toggle {
	font-size: 1rem;
	border: 0.125em solid currentColor;
	cursor: pointer;
	display: block;
	height: 2em;
	position: relative;
	width: 3.75em;
	box-sizing: unset;
}
.toggle span {
	background-color: currentColor;
	display: block;
	height: 1.5em;
	left: 0.25em;
	overflow: hidden;
	position: absolute;
	top: 0.25em;
	text-indent: -9999px;
	transition: left 0.25s;
	width: 1.5em;
	z-index: 2;
}

.toggle::before,
.toggle::after {
	content: '';
	display: block;
	border-radius: 1em;
	position: absolute;
	z-index: 1;
}

.toggle::after {
	box-shadow: 0.25em 0.25em #5901d8;
	height: 1.125em;
	right: 0.9em;
	top: 0.125em;
	width: 1.125em;
}

.toggle::before {
	background-color: #ffc409;
	height: 0.625em;
	outline: 0.25em dotted #ffc409;
	outline-offset: 0.125em;
	left: 0.7em;
	top: 0.7em;
	width: 0.625em;
}

input:checked ~ .toggle span {
	left: 2em;
}

</style>


	</head>
	<body>
		<header>
			<div id="emojis"></div>
			<h1>Welcome to ImageHarmony</h1>
			<input onclick="toggleDarkMode()" type="checkbox" class="sr-only" id="darkmode-toggle" />
			<label for="darkmode-toggle" class="toggle">
				<span>Toggle dark mode</span>
			</label>
		</header>
		<section class="inputSection">
			<div class="buttonContainer">
				<button id="rock" class="genreButton" onclick="setGenre('rock')">Rock</button>
				<button id="classic" class="genreButton" onclick="setGenre('classic')">Classic</button>
				<button id="love" class="genreButton" onclick="setGenre('love')">Love</button>
				<button id="kpop" class="genreButton" onclick="setGenre('kpop')">K-pop</button>
				<button id="kids" class="genreButton" onclick="setGenre('kids')">Kids</button>
				<button id="hiphop" class="genreButton" onclick="setGenre('hiphop')">Hip Hop</button>
				<button id="country" class="genreButton" onclick="setGenre('country')">Country</button>
				<button id="pop" class="genreButton" onclick="setGenre('pop')">Pop</button>
				<button id="banana" class="genreButton d-none" onclick="setGenre('banana')">Banana</button>
			</div>
			<div class="imgContainer">
				<div id="uploadImageText">
					<span class="material-symbols-outlined uploadIcon"> upload </span>
					<span
						>Drag & Drop to Upload Image <br />
						or</span
					>
				</div>
				<input type="file" id="imageInput" class="d-none" accept="image/*" />
				<div id="dropArea" class="drop-area">
					<input type="file" id="fileElem" multiple accept="image/*" class="file-elem" />
				</div>

				<img id="uploadedImage" class="d-none" />
				<button id="uploadImageBtn" onclick="imageInput.click()" class="imgButton">Upload Image</button>
				<button id="deleteImage" onclick="deleteImage()" class="d-none">
					<span class="material-symbols-outlined deleteIcon"> delete </span>
				</button>
			</div>
		</section>

		<section class="outputSection">
			<span id="uploadInfo">In order to generate lyrics, please select and genre and provide an image.</span>
			<button id="generateText" onclick="generateLyrics()">Generate Lyrics</button>
			<button id="reset" onclick="restart()" class="d-none">Restart</button>
			<div id="step1" class="loadingStep d-none">analyzing image 
				<span class="material-symbols-outlined step1Icon">search</span>
			</div>
			<div id="step2" class="loadingStep d-none" >calling songwriter
			<span class="material-symbols-outlined step2Icon">phone_iphone</span>
			</div>
			<div id="step3" class="loadingStep d-none" >creating lyrics
			<span class="material-symbols-outlined step3Icon">edit</span>
			</div>
			<div id="loader" class="loader-container d-none">
				<div class="square"></div>
				<div class="square"></div>
				<div class="square"></div>
				<div class="square"></div>
			</div>

			<div id="modelResponse" class="d-none">
			</div>
		</section>

		<div id="broccoliBob" onclick="showBob()" class="d-none">
			<img
				class="imgBroccoliBob"
				src="https://github.com/flos-code/DA-Bubble/assets/148456982/b03d5b7a-d0e4-4f8c-88d8-01a531407f27"
				alt="broccoli bob"
			/>
			<img id="bobThinking" class="d-none" src="https://github.com/flos-code/flos-code/assets/148456982/5d2f908b-94f4-4d19-9a30-76bd48087831" alt="Bob is thinking">
			<div id="interactionBob" class="d-none">
				<div class="chatBob">
					<div class="messageBob">
						Hey, Broccoli Bob here, it's clear that I'm the king of vegetables, but one question is bothering me for a long time. Tell me
						which fruit is the superior one?
					</div>

					<div id="messageUser1" class="messageUser d-none">
					
					</div>
					<div id="wrongCode" class="d-none messageBob">
					You better think about it again and you will realize that there can only be one right answer.
					</div>
					<div id="bananaCode" class="d-none messageBob">
					I knew it, I can feel it when I have a banana connoisseur in front of me.

					</div>
					<div id="appleCode" class="d-none messageBob">
					Congratulations, it was a test and you failed with flying colors! What makes you think that apples are the superior fruit...
					</div>

					<div id="messageUser2" class="messageUser d-none"> </div>

					<div id="wrongCode2" class="d-none messageBob">
					wrong2
					</div>
					<div id="bananaCode2" class="d-none messageBob">
					banan2

					</div>
		
				</div>

				<button class="btnBob" id="startRecord">Talk to Bob <span class="material-symbols-outlined"> mic </span></button>
				<button class="btnBob d-none" id="stopRecord" disabled>Nuff said <span class="material-symbols-outlined"> mic_off </span></button>
			</div>
		</div>

		<script>
			let imgDescription = '';
			let lyricsTemplate = '';
			let genre = '';
			let isDarkMode = false;
			let imgUpload;

			let mediaRecorder;
			let audioChunks = [];
			let isRecording = false;

			let emojis = ['🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵', '🎵'];
			let speed = 2; // Adjust for faster or slower movement

			let attemptCount = 1;

			document.getElementById('startRecord').addEventListener('click', startRecording);
			document.getElementById('stopRecord').addEventListener('click', stopRecording);

			function setGenre(selectedGenre) {
				if (genre !== '') {
					document.getElementById(genre).classList.remove('selectedGenre');
				}
				document.getElementById(selectedGenre).classList.add('selectedGenre');
				genre = selectedGenre;

				document.getElementById('emojis').innerHTML = '';

				if (selectedGenre === 'rock') {
					emojis = ['🤘', '🤘', '🤘', '🤘', '🤘', '🤘', '🤘', '🤘', '🤘', '🤘'];
				} else if (selectedGenre === 'classic') {
					emojis = ['🎻', '🎻', '🎻', '🎻', '🎻', '🎻', '🎻', '🎻', '🎻', '🎻'];
				} else if (selectedGenre === 'love') {
					emojis = ['💖', '💖', '💖', '💖', '💖', '💖', '💖', '💖', '💖', '💖'];
				} else if (selectedGenre === 'kpop') {
					emojis = ['🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸', '🌸'];
				} else if (selectedGenre === 'kids') {
					emojis = ['🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸', '🧸'];
				} else if (selectedGenre === 'hiphop') {
					emojis = ['🎧', '🎧', '🎧', '🎧', '🎧', '🎧', '🎧', '🎧', '🎧', '🎧'];
				} else if (selectedGenre === 'country') {
					emojis = ['🪕', '🪕', '🪕', '🪕', '🪕', '🪕', '🪕', '🪕', '🪕', '🪕'];
				} else if (selectedGenre === 'pop') {
					emojis = ['🎤', '🎤', '🎤', '🎤', '🎤', '🎤', '🎤', '🎤', '🎤', '🎤'];
				} else if (selectedGenre === 'banana') {
					emojis = ['🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌', '🍌'];
				}

				emojis.forEach((emojiChar) => {
					const emoji = createEmoji(emojiChar);
					moveEmoji(emoji, speed);
				});
				updateGenerateButtonState();
			}

			document.addEventListener('DOMContentLoaded', (event) => {
				const dropArea = document.getElementById('dropArea');
				const fileInput = document.getElementById('fileElem');
				const imageInput = document.getElementById('imageInput');

				// Function to handle files from both drag-and-drop and file input
				function handleFiles(files) {
					// Check if any files were uploaded
					if (files.length > 0) {
						// Process the first file (if multiple, you would need to loop through)
						const file = files[0];
						imgUpload = file;
						document.getElementById('deleteImage').classList.remove('d-none');
						document.getElementById('dropArea').classList.add('d-none');
						document.getElementById('uploadImageText').classList.add('d-none');
						document.getElementById('uploadImageBtn').classList.add('d-none');
						const reader = new FileReader();

						reader.onload = function (e) {
							// Update the display with the image
							document.getElementById('uploadedImage').src = e.target.result;
							document.getElementById('uploadedImage').classList.remove('d-none');
							updateGenerateButtonState(); // Update button states accordingly
						};

						reader.readAsDataURL(file); // Read the file to display it
					}
				}

				// Drag-and-drop events
				dropArea.addEventListener('dragover', (e) => {
					e.preventDefault();
					dropArea.classList.add('active');
				});

				dropArea.addEventListener('dragleave', (e) => {
					dropArea.classList.remove('active');
				});

				dropArea.addEventListener('drop', (e) => {
					e.preventDefault();
					dropArea.classList.remove('active');
					handleFiles(e.dataTransfer.files);
				});

				// Change event for the hidden file input
				fileInput.addEventListener('change', (e) => {
					handleFiles(e.target.files);
				});

				// Change event for the visible file input
				imageInput.addEventListener('change', (e) => {
					handleFiles(e.target.files);
				});
			});

			function toggleDarkMode() {
				const theme = document.documentElement.getAttribute('data-theme');
				if (theme === 'light') {
					document.documentElement.setAttribute('data-theme', 'dark');
					document.getElementById('broccoliBob').classList.remove('d-none');
					attemptCount = 1;
				} else {
					document.documentElement.setAttribute('data-theme', 'light');
					document.getElementById('broccoliBob').classList.add('d-none');
					document.getElementById('broccoliBob').classList.remove('showBob');
					document.getElementById('interactionBob').classList.add('d-none');
			
				}
			}

			function updateGenerateButtonState() {
				const uploadedImageSrc = document.getElementById('uploadedImage').getAttribute('src');
				const isImageUploaded = uploadedImageSrc !== null && uploadedImageSrc !== '';
				const isGenreSelected = genre !== '' && genre !== undefined;
				document.getElementById('generateText').disabled = !(isImageUploaded && isGenreSelected);

				if (isImageUploaded && isGenreSelected) {
					document.getElementById('uploadInfo').classList.add('d-none');
				}
			}

			async function generateLyrics() {
				document.getElementById('loader').classList.remove('d-none'); // Show loader
				document.getElementById('deleteImage').classList.add('d-none'); // Show loader

				document.getElementById('generateText').disabled = true;
				document.getElementById('rock').disabled = true;
				document.getElementById('classic').disabled = true;
				document.getElementById('love').disabled = true;
				document.getElementById('kpop').disabled = true;
				document.getElementById('kids').disabled = true;
				document.getElementById('hiphop').disabled = true;
				document.getElementById('country').disabled = true;
				document.getElementById('pop').disabled = true;
				document.getElementById('banana').disabled = true;

				const image = imgUpload;
				const formData = new FormData();
				formData.append('image', image);

				try {
					document.getElementById('step1').classList.remove('d-none');
					const descriptionResponse = await fetch('/generate-text', {
						method: 'POST',
						body: formData,
					});
					const descriptionResult = await descriptionResponse.json();
					imgDescription = descriptionResult.description;
					document.getElementById('step1').classList.add('d-none');
					document.getElementById('step2').classList.remove('d-none');

					// Step 2: Rephrase the image description (simulate with /query)
					const rephraseResponse = await fetch('/query', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ content: imgDescription, mode: genre }),
					});
					const rephraseResult = await rephraseResponse.json();
					const rephrasedDescription = rephraseResult.output; // Assuming output contains rephrased description
					document.getElementById('step2').classList.add('d-none');
					document.getElementById('step3').classList.remove('d-none');

					// Step 3: Generate lyrics based on the rephrased description
					const lyricsResponse = await fetch('/lyrics', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ content: rephrasedDescription, mode: genre }),
					});
					const lyricsResult = await lyricsResponse.json();
					const lyrics = lyricsResult.output; // Assuming output contains the final lyrics
					document.getElementById('step3').classList.add('d-none');

					// Display the final lyrics
					document.getElementById('modelResponse').textContent = lyrics;
				} catch (error) {
					console.error('Error:', error);
					document.getElementById('modelResponse').textContent = 'Error processing request.';
				} finally {
					document.getElementById('loader').classList.add('d-none'); // Hide loader
					document.getElementById('generateText').classList.add('d-none');
					document.getElementById('reset').classList.remove('d-none');
					document.getElementById('modelResponse').classList.remove('d-none')
	
				}
			}

			function restart() {
				document.getElementById('generateText').disabled = true;
				document.getElementById('rock').disabled = false;
				document.getElementById('classic').disabled = false;
				document.getElementById('love').disabled = false;
				document.getElementById('kpop').disabled = false;
				document.getElementById('kids').disabled = false;
				document.getElementById('hiphop').disabled = false;
				document.getElementById('country').disabled = false;
				document.getElementById('pop').disabled = false;
				document.getElementById('banana').disabled = false;
				document.getElementById('uploadedImage').src = '';
				document.getElementById('imageInput').src = '';
				document.getElementById('uploadInfo').classList.remove('d-none');
				document.getElementById('dropArea').classList.remove('d-none');
				document.getElementById('uploadImageBtn').classList.remove('d-none');
				document.getElementById('uploadImageText').classList.remove('d-none');
				document.getElementById('generateText').classList.remove('d-none');
				
				document.getElementById('reset').classList.add('d-none');
				document.getElementById('uploadedImage').classList.add('d-none');
				document.getElementById('deleteImage').classList.add('d-none');
				document.getElementById('modelResponse').innerHTML = '';
				document.getElementById('modelResponse').classList.add('d-none');


				document.getElementById(genre).classList.remove('selectedGenre');
				setGenre('');
			}

			function startRecording() {
				document.getElementById('startRecord').classList.add('d-none');
				document.getElementById('stopRecord').classList.remove('d-none');
				navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
					mediaRecorder = new MediaRecorder(stream);
					mediaRecorder.start();
					audioChunks = [];
					isRecording = true;
					document.getElementById('stopRecord').disabled = false;

					mediaRecorder.addEventListener('dataavailable', (event) => {
						audioChunks.push(event.data);
					});

					mediaRecorder.addEventListener('stop', () => {
						const audioBlob = new Blob(audioChunks);
						sendAudioToServer(audioBlob);
					});
				});
			}

			// Function to stop recording
			function stopRecording() {
				if (!isRecording) return;
				mediaRecorder.stop();
				isRecording = false;
				document.getElementById('stopRecord').classList.add('d-none');
				mediaRecorder.stream.getTracks().forEach(track => track.stop());
			}

			function sendAudioToServer(audioBlob) {
				document.getElementById('bobThinking').classList.remove('d-none');

				const formData = new FormData();
				formData.append('audio', audioBlob);

				fetch('/analyze-audio', { method: 'POST', body: formData })
					.then((response) => response.json())
					.then((data) => {


						if (attemptCount === 1) {
							document.getElementById('bobThinking').classList.add('d-none');
						document.getElementById('messageUser1').classList.remove('d-none');
						document.getElementById('messageUser1').textContent = data.transcription;
						if (data.transcription.toLowerCase().includes('banana')) {
							document.getElementById('banana').classList.remove('d-none');
							document.getElementById('bananaCode').classList.remove('d-none');
							setGenre('banana');
						} else if (data.transcription.toLowerCase().includes('apple')){
							document.getElementById('appleCode').classList.remove('d-none');
							chatFailed();
						} else {
							document.getElementById('wrongCode').classList.remove('d-none')
							chatRetry();
						}}
						else {

							document.getElementById('bobThinking').classList.add('d-none');
						document.getElementById('messageUser2').classList.remove('d-none');
						document.getElementById('messageUser2').textContent = data.transcription;
                // Second attempt logic
                if (data.transcription.toLowerCase().includes('banana')) {
					document.getElementById('banana').classList.remove('d-none');
							document.getElementById('bananaCode2').classList.remove('d-none');
							setGenre('banana');
                } else {

					document.getElementById('wrongCode2').classList.remove('d-none');
					chatFailed();
                }
            }

					})
					.catch((error) => console.error('Error:', error));
			}

			function deleteImage() {
				document.getElementById('imageInput').value = '';
				document.getElementById('fileElem').value = '';
				document.getElementById('uploadedImage').classList.add('d-none');
				document.getElementById('uploadedImage').src = '';
				document.getElementById('deleteImage').classList.add('d-none');
				document.getElementById('dropArea').classList.remove('d-none');
				document.getElementById('uploadImageText').classList.remove('d-none');
				document.getElementById('uploadImageBtn').classList.remove('d-none');
				updateGenerateButtonState();
			}

			function showBob() {
				document.getElementById('broccoliBob').classList.add('showBob');

				setTimeout(function () {
					document.getElementById('interactionBob').classList.remove('d-none');
				}, 3000); // 2000 milliseconds = 2 seconds
			}

			function createEmoji(emojiChar) {
				const emoji = document.createElement('div');
				emoji.textContent = emojiChar;
				emoji.className = 'emoji';
				document.getElementById('emojis').appendChild(emoji);
				return emoji;
			}

			function moveEmoji(emoji, speed) {
				let x = Math.random() * document.getElementById('emojis').offsetWidth;
				let y = Math.random() * document.getElementById('emojis').offsetHeight;
				let dx = (Math.random() - 0.5) * speed;
				let dy = (Math.random() - 0.5) * speed;

				function animate() {
					const emojisDiv = document.getElementById('emojis');
					const maxX = emojisDiv.offsetWidth - emoji.offsetWidth;
					const maxY = emojisDiv.offsetHeight - emoji.offsetHeight;

					x += dx;
					y += dy;

					if (x <= 0 || x >= maxX) dx *= -1;
					if (y <= 0 || y >= maxY) dy *= -1;

					emoji.style.left = x + 'px';
					emoji.style.top = y + 'px';

					requestAnimationFrame(animate);
				}

				animate();
			}

			emojis.forEach((emojiChar) => {
				const emoji = createEmoji(emojiChar);
				moveEmoji(emoji, speed);
			});

			function chatFailed() {
				setTimeout(() => {
					document.getElementById('broccoliBob').classList.add('byeBob');
				}, 5000);
				setTimeout(() => {
					document.getElementById('broccoliBob').classList.add('d-none');
					document.getElementById('broccoliBob').classList.remove('byeBob');

					document.getElementById('messageUser1').classList.add('d-none');
					document.getElementById('messageUser2').classList.add('d-none');
					document.getElementById('wrongCode').classList.add('d-none');
					document.getElementById('bananaCode').classList.add('d-none');
					document.getElementById('appleCode').classList.add('d-none');
					document.getElementById('wrongCode2').classList.add('d-none');
					document.getElementById('bananaCode2').classList.add('d-none');
					document.getElementById('startRecord').classList.remove('d-none');
					
				}, 8000);
			}

			function chatRetry() {
    // Reset for a second attempt
    document.getElementById('startRecord').classList.remove('d-none'); // Show the record button again
    attemptCount++; // Increment attempt count for next interaction
}

			updateGenerateButtonState();
		</script>
	</body>
</html>


	`;
	return c.html(html);
});

app.post('/query', async (c) => {
	const body = await c.req.json();
	const content = body.content || 'Hello, World!';

	const ai = new Ai(c.env.AI);

	const messages = [
		{
			role: 'system',
			content:
				'You are a helpful assistant who takes the following picture description and rephrases it so that you can write song lyrics from it. Your task is not to write lyrics directly. Just rewrite the image description so that it is easier to write a song with it.',
		},
		{ role: 'user', content },
	];

	const inputs = { messages };
	const res = await ai.run('@cf/meta/llama-2-7b-chat-fp16', inputs);
	// console.log('AI response:', JSON.stringify(res, null, 2));
	const outputText = res.response ?? "Sorry, I couldn't process that.";

	return c.json({ output: outputText });
});

app.post('/generate-text', async (c) => {
	const formData = await c.req.formData();
	const imageFile = formData.get('image');

	if (imageFile && imageFile instanceof File) {
		const fileBuffer = await imageFile.arrayBuffer();
		const ai = new Ai(c.env.AI);
		const inputs = {
			image: [...new Uint8Array(fileBuffer)],
		};

		try {
			const response = await ai.run('@cf/unum/uform-gen2-qwen-500m', inputs);
			const description = response.description || 'Description not available.';

			return c.json({ description });
		} catch (error) {
			console.error('Error calling @cf/unum/uform-gen2-qwen-500m model:', error);
			return c.json({ error: 'Failed to generate description from image.' }, 500);
		}
	} else {
		return c.json({ error: 'No image file provided.' }, 400);
	}
});

app.post('/lyrics', async (c) => {
	const body = await c.req.json();
	const content = body.content || 'Hello, World!';
	const mode = body.mode || 'no';

	const ai = new Ai(c.env.AI);

	let systemMessage = 'You are a helpful assistant.';
	if (mode === 'rock') {
		systemMessage =
			'Immerse yourself in the spirit of rock. Using the provided template, forge one verse and a chorus that scream rebellion and freedom. Let the raw energy of rock infuse the template’s narrative, morphing it into a powerful anthem of defiance or a celebration of independence, all while keeping the essence of the story intact.';
	} else if (mode === 'classic') {
		systemMessage =
			'Adopt the persona of a classical composer. Transform the given template into a verse and a chorus that could grace the halls of a grand concert. Employ elegance and a profound depth of emotion, ensuring that the classical rendition of the template’s story carries a timeless beauty and a narrative weight.';
	} else if (mode === 'love') {
		systemMessage =
			'Channel your essence into the heart of Amor, and with poetic brevity, craft a love song that sings directly from the provided scenario. Your canvas is clear: one verse and one chorus only. No explanations, no embellishments beyond the song itself. Begin with a verse that paints the initial encounter with love, drawing vividly from the scene set before you. Then, weave a chorus that echoes the eternal nature of this newfound love. Let each word pulse with the rhythm of affection, every line a stroke of emotion, capturing the essence of love in its purest form. Create this as a standalone piece of art, a testament to love, with no need for further commentary.';
	} else if (mode === 'kpop') {
		systemMessage =
			'Channel K-pop’s dynamic flair. Take the template and create one verse and a chorus that blend relatable stories with the genre’s signature energetic beats and catchy melodies. Ensure the transformation reflects K-pop’s vibrant culture and visual aesthetics, making the template’s narrative pop.';
	} else if (mode === 'kids') {
		systemMessage =
			'Step into a world of childlike wonder. Use the template to compose a verse and a chorus for a kids’ song thats engaging, educational, or simply fun. The lyrics should be easy to understand and sing along to, sparking joy and curiosity while faithfully telling the template’s story.';
	} else if (mode === 'hiphop') {
		systemMessage =
			'Assume the role of a hip-hop storyteller. With the template as your foundation, lay down a verse and a chorus that convey authentic stories or messages with a compelling rhythm. Let the lyrics reflect hip-hop’s powerful voice, turning the template’s essence into a narrative of resilience or celebration.';
	} else if (mode === 'country') {
		systemMessage =
			'Embrace the soul of country music. Transform the template into a verse and a chorus that narrate tales of love, loss, or daily life, with a backdrop of country landscapes or themes. Your lyrics should carry the heartfelt sincerity and narrative depth characteristic of country music, staying true to the original story.';
	} else if (mode === 'pop') {
		systemMessage =
			'Become a pop lyricist. Craft from the template a catchy pop song with one verse and a chorus. The lyrics should tap into universal themes, using the template’s story to create a relatable and memorable tune that has the potential to captivate a wide audience.';
	} else if (mode === 'banana') {
		systemMessage =
			'Dive into the whimsical world of bananas. Take the given template and transform it into a fun, upbeat song centered around bananas. Your verse and chorus should highlight the joy and humor that bananas bring, using playful language and imagery to turn the template’s narrative into a celebration of this beloved fruit.';
	} else {
		systemMessage =
			'You are a composer tasked with creating lyrics for a song that includes one verse and a chorus, drawing inspiration from a given template. Focus on encapsulating the theme and emotions of the template, ensuring your lyrics resonate with the selected genre’s unique qualities.';
	}

	const messages = [
		{ role: 'system', content: systemMessage },
		{ role: 'user', content },
	];

	const inputs = { messages };
	const res = await ai.run('@cf/meta/llama-2-7b-chat-fp16', inputs);
	// console.log('AI response:', JSON.stringify(res, null, 2));
	const outputText = res.response ?? "Sorry, I couldn't process that.";

	return c.json({ output: outputText });
});

app.post('/analyze-audio', async (c) => {
	const formData = await c.req.formData();
	const audioFile = formData.get('audio');

	if (audioFile && audioFile instanceof File) {
		const fileBuffer = await audioFile.arrayBuffer();
		const ai = new Ai(c.env.AI);

		// Adjust this part to call the Whisper model correctly
		const input = { audio: [...new Uint8Array(fileBuffer)] };
		const response = await ai.run('@cf/openai/whisper', input);

		// Assuming `response` contains the transcription
		return c.json({ transcription: response.text });
	} else {
		return c.json({ error: 'No audio file provided.' }, 400);
	}
});

export default {
	fetch: app.fetch,
};
