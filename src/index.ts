import { Hono } from 'hono';
import { Ai } from '@cloudflare/ai';
declare global {
	interface Env {
		AI: any;
	}
}

// let imgDescription: string = 'test';

const app = new Hono<Env>();

app.get('/', async (c) => {
	const html = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ImageHarmony</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    header { margin-bottom: 20px; }
    #chat { background-color: #f9f9f9; padding: 10px; max-width: 600px; margin: auto; }
    .message { padding: 5px 10px; margin: 5px 0; border-radius: 5px; }
    .user { background-color: #007bff; color: white; }
    .ai { background-color: #e2e2e2; }

	.hidden { display: none; }
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
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
</head>
<body>
  <header>
    <h1>Welcome to ImageHarmony</h1>
  </header>
  <div id="chat"></div> <!-- Chat container -->
  <form id="aiForm">
    <!-- <input type="text" id="userInput" placeholder="Ask me anything..."> -->
    <!-- <button type="submit">Submit</button> -->
  </form>
  <button onclick="generateLyrics()">Lyric her</button>
  <button id="bananBtn" onclick="setFruit('banan')">love</button>
<button id="apfelBtn" onclick="setFruit('apfel')">Apfel</button>

<input type="file" id="imageInput" accept="image/*">
  <img id="uploadedImage" style="max-width: 200px; display: none;" />
  <div id="modelResponse"></div>
  <div id="loader" class="hidden">
    <div class="loader"></div>
  </div>

  <script>
let imgDescription = '';
let lyricsTemplate = '';
let genre = '';

function setFruit(fruit) {
  genre = fruit;
}

document.getElementById('imageInput').addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('uploadedImage').src = e.target.result;
      document.getElementById('uploadedImage').style.display = 'block';
      document.getElementById('generateText').disabled = false; // Enable button
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

async function generateLyrics() {
  document.getElementById('loader').classList.remove('hidden'); // Show loader

  const image = document.getElementById('imageInput').files[0];
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
      body: JSON.stringify({ content: imgDescription, mode: genre })
    });
    const rephraseResult = await rephraseResponse.json();
    const rephrasedDescription = rephraseResult.output; // Assuming output contains rephrased description

    // Step 3: Generate lyrics based on the rephrased description
    const lyricsResponse = await fetch('/lyrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: rephrasedDescription, mode: genre })
    });
    const lyricsResult = await lyricsResponse.json();
    const lyrics = lyricsResult.output; // Assuming output contains the final lyrics

    // Display the final lyrics
    document.getElementById('modelResponse').textContent = lyrics;

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('modelResponse').textContent = 'Error processing request.';
  } finally {
    document.getElementById('loader').classList.add('hidden'); // Hide loader
  }
}
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
			// Call the `@cf/unum/uform-gen2-qwen-500m` model
			const response = await ai.run('@cf/unum/uform-gen2-qwen-500m', inputs);

			// Process and format the AI model response
			// Assuming the response contains a property like `description` with the generated text
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
	console.log(content);
	// console.log(content);
	let systemMessage = 'You are a helpful assistant.';
	if (mode === 'banan') {
		systemMessage =
			'Channel your essence into the heart of Amor, and with poetic brevity, craft a love song that sings directly from the provided scenario. Your canvas is clear: one verse and one chorus only. No explanations, no embellishments beyond the song itself. Begin with a verse that paints the initial encounter with love, drawing vividly from the scene set before you. Then, weave a chorus that echoes the eternal nature of this newfound love. Let each word pulse with the rhythm of affection, every line a stroke of emotion, capturing the essence of love in its purest form. Create this as a standalone piece of art, a testament to love, with no need for further commentary.';
	} else if (mode === 'apfel') {
		systemMessage = 'You are a helpful assistant and with every response you also say how much you like apple';
	} else {
		systemMessage = 'you a a componist and based on the template you give yoe create  lyrics for a song with 2 song verses and a refrain.';
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

export default {
	fetch: app.fetch,
};
