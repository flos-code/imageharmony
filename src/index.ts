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
}

* {
	box-sizing: border-box;
}

@import url('https://fonts.googleapis.com/css?family=Salsa:700|Salsa:400');

body {
	font-family: 'Salsa';
	font-weight: 400;
}

body {
	background-color: var(--background);
	color: var(--text);
}

header {
	margin-bottom: 20px;
}

.d-none {
	display: none;
}

.buttonContainer {
	display: flex;
	flex-wrap: wrap;
	gap: 16px; /* Space between the buttons */
	width: calc(3 * 120px + 2 * 16px);
}

.genreButton {
	font-family: 'Salsa';
	font-weight: 600;
	font-size: 24px;
	padding: 4px;
	border-radius: 19px;
	width: 120px;
	color: var(--text);
	background: var(--primary05);
	backdrop-filter: blur(9.1px);
	-webkit-backdrop-filter: blur(9.1px);
	border: 1px solid var(--primary03);
	transition: all 0.3s;
}

.genreButton:hover {
	cursor: pointer;
	background: var(--primary03);
	box-shadow: 0 6px 30px var(--text02);
}

.drop-area {
	border: 2px dashed #ccc;
	border-radius: 20px;
	margin-top: 20px;
	padding: 50px 20px;
}

.file-elem {
	opacity: 0;
	position: absolute;
	pointer-events: none;
}

.loader {
	border: 4px solid #f3f3f3;
	border-radius: 50%;
	border-top: 4px solid #3498db;
	width: 20px;
	height: 20px;
	-webkit-animation: spin 2s linear infinite; /* Safari */
	animation: spin 2s linear infinite;
}
/* Safari */
@-webkit-keyframes spin {
	0% {
		-webkit-transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
	}
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.selectedGenre {
	background-color: #3498db; /* Blue background */
	color: white; /* White text */
	border: none; /* Remove border */
}

#broccoliBob {
	position: absolute;
	top: 50vh;
	left: 0;
}

.imgBroccoliBob {
	width: 100px;
	height: 100px;
}

</style>
	</head>
	<body>
		<header>
			<h1>Welcome to ImageHarmony</h1>
			<button onclick="toggleDarkMode()" id="themeToggle">Toggle Dark Mode</button>
		</header>
		<div>
			<button id="generateText" onclick="generateLyrics()">Generate Lyrics</button>
			<div class="buttonContainer">
				<button id="rock" class="genreButton" onclick="setGenre('rock')">Rock</button>
				<button id="classic" class="genreButton" onclick="setGenre('classic')">Classic</button>
				<button id="love" class="genreButton" onclick="setGenre('love')">Love</button>
				<button id="kpop" class="genreButton" onclick="setGenre('kpop')">K-pop</button>
				<button id="kids" class="genreButton" onclick="setGenre('kids')">Kids</button>
				<button id="hiphop" class="genreButton" onclick="setGenre('hiphop')">Hip Hop</button>
				<button id="country" class="genreButton" onclick="setGenre('country')">Country</button>
				<button id="pop" class="genreButton" onclick="setGenre('pop')">Pop</button>
				<button id="banana" class="genreButton" class="d-none" onclick="setGenre('banana')">Banana</button>
			</div>

			<button onclick="restart()">Restart</button>

			<input type="file" id="imageInput" accept="image/*" />
			<div id="dropArea" class="drop-area">
				Drop Your Files Here
				<input type="file" id="fileElem" multiple accept="image/*" class="file-elem" />
			</div>

			<img id="uploadedImage" style="max-width: 200px; display: none" />
			<div id="modelResponse"></div>
			<div id="loader" class="d-none">
				<div class="loader"></div>
			</div>

			<div id="broccoliBob" class="d-none">
				<img
					class="imgBroccoliBob"
					src="https://github.com/flos-code/DA-Bubble/assets/148456982/b03d5b7a-d0e4-4f8c-88d8-01a531407f27"
					alt="broccoli bob"
				/>
				<div>Hey broccoli bob here</div>
				<button id="startRecord">Start Recording</button>
				<button id="stopRecord" disabled>Stop Recording</button>
				<div id="wrongCode" class="d-none">sorry wrong code</div>
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

			document.getElementById('startRecord').addEventListener('click', startRecording);
			document.getElementById('stopRecord').addEventListener('click', stopRecording);

			function setGenre(selectedGenre) {
				if (genre !== '') {
					document.getElementById(genre).classList.remove('selectedGenre');
				}
				document.getElementById(selectedGenre).classList.add('selectedGenre');
				genre = selectedGenre;
				updateGenerateButtonState();
			}

			// document.getElementById('imageInput').addEventListener('change', function (e) {
			// 	if (e.target.files.length > 0) {
			// 		const reader = new FileReader();
			// 		reader.onload = function (e) {
			// 			document.getElementById('uploadedImage').src = e.target.result;
			// 			document.getElementById('uploadedImage').style.display = 'block';
			// 			updateGenerateButtonState();
			// 		};
			// 		reader.readAsDataURL(e.target.files[0]);
			// 	}
			// });

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
						const reader = new FileReader();

						reader.onload = function (e) {
							// Update the display with the image
							document.getElementById('uploadedImage').src = e.target.result;
							document.getElementById('uploadedImage').style.display = 'block';
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
				} else {
					document.documentElement.setAttribute('data-theme', 'light');
					document.getElementById('broccoliBob').classList.add('d-none');
				}
			}

      function updateGenerateButtonState() {
    const uploadedImage = document.getElementById('uploadedImage');
    const isImageUploaded = uploadedImage && uploadedImage.src;
    const isGenreSelected = genre !== '' && genre !== undefined;
    document.getElementById('generateText').disabled = !(isImageUploaded && isGenreSelected);
}


			async function generateLyrics() {
				document.getElementById('loader').classList.remove('d-none'); // Show loader

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
					// Step 1: Generate the image description
					const descriptionResponse = await fetch('/generate-text', {
						method: 'POST',
						body: formData,
					});
					const descriptionResult = await descriptionResponse.json();
					imgDescription = descriptionResult.description;

					// Step 2: Rephrase the image description (simulate with /query)
					const rephraseResponse = await fetch('/query', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ content: imgDescription, mode: genre }),
					});
					const rephraseResult = await rephraseResponse.json();
					const rephrasedDescription = rephraseResult.output; // Assuming output contains rephrased description

					// Step 3: Generate lyrics based on the rephrased description
					const lyricsResponse = await fetch('/lyrics', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ content: rephrasedDescription, mode: genre }),
					});
					const lyricsResult = await lyricsResponse.json();
					const lyrics = lyricsResult.output; // Assuming output contains the final lyrics

					// Display the final lyrics
					document.getElementById('modelResponse').textContent = lyrics;
				} catch (error) {
					console.error('Error:', error);
					document.getElementById('modelResponse').textContent = 'Error processing request.';
				} finally {
					document.getElementById('loader').classList.add('d-none'); // Hide loader
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

				document.getElementById(genre).classList.remove('selectedGenre');
				setGenre('');
			}

			function startRecording() {
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
				document.getElementById('stopRecord').disabled = true;
			}

			// Function to send audio to server and process the response
			function sendAudioToServer(audioBlob) {
				const formData = new FormData();
				formData.append('audio', audioBlob);

				fetch('/analyze-audio', { method: 'POST', body: formData })
					.then((response) => response.json())
					.then((data) => {
						// Check if the transcription contains 'banana' or 'bananas'
						if (data.transcription.toLowerCase().includes('banana')) {
							document.getElementById('banana').classList.remove('d-none');
							document.getElementById('wrongCode').classList.add('d-none');
						} else {
							document.getElementById('wrongCode').classList.remove('d-none');
							document.getElementById('banana').classList.add('d-none');
						}
					})
					.catch((error) => console.error('Error:', error));
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
