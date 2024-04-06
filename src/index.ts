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
    <input type="text" id="userInput" placeholder="Ask me anything..." required>
    <button type="submit">Submit</button>
  </form>
  <button id="bananBtn" onclick="setFruit('banan')">Banan</button>
<button id="apfelBtn" onclick="setFruit('apfel')">Apfel</button>

<input type="file" id="imageInput" accept="image/*">
  <!-- Display Uploaded Image -->
  <img id="uploadedImage" style="max-width: 100%; display: none;" />
  <!-- Display Model Response -->
  <div id="modelResponse"></div>
  <!-- Loader Animation -->
  <div id="loader" class="hidden">
    <div class="loader"></div>
  </div>
  <!-- Button to Generate Text from Image -->
  <button id="generateText" disabled>Generate Lyrics</button>

  <script>

function setFruit(fruit) {
  sessionStorage.setItem('fruitMode', fruit);
}


  document.getElementById('aiForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const userInputField = document.getElementById('userInput');
    const submitButton = document.querySelector('button[type="submit"]');
    const chatContainer = document.getElementById('chat');
    const fruitMode = sessionStorage.getItem('fruitMode') || 'no'; // Default to 'banan'

    
    // Disable the input and button
    userInputField.disabled = true;
    submitButton.disabled = true;

    

    // Create and show loader
    const loader = document.createElement('div');
    loader.className = 'loader';
    chatContainer.appendChild(loader);

    const userInput = userInputField.value;
    
    // Append user's question
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user');
    userMessage.textContent = userInput;
    chatContainer.appendChild(userMessage);

    // Fetch AI response
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userInput, mode: fruitMode })
      });

      const result = await response.json();
      
      // Append AI's response
      const aiMessage = document.createElement('div');
      aiMessage.classList.add('message', 'ai');
      aiMessage.textContent = 'AI Response: ' + result.output;
      chatContainer.appendChild(aiMessage);
    } catch (error) {
      console.error('Fetching AI response failed:', error);
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('message', 'ai');
      errorMessage.textContent = 'AI Response: Sorry, something went wrong.';
      chatContainer.appendChild(errorMessage);
    } finally {
      // Re-enable the input and button, remove loader
      userInputField.disabled = false;
      submitButton.disabled = false;
      chatContainer.removeChild(loader);

      // Clear the input field
      userInputField.value = '';
    }
  });

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

    document.getElementById('generateText').addEventListener('click', async function() {
      const image = document.getElementById('imageInput').files[0];
      const formData = new FormData();
      formData.append('image', image);

      // Show loader
      document.getElementById('loader').classList.remove('hidden');

      try {
        const response = await fetch('/generate-text', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        document.getElementById('modelResponse').textContent = 'Generated Lyrics: ' + result.description;
      } catch (error) {
        console.error('Error generating text:', error);
        document.getElementById('modelResponse').textContent = 'Error generating text.';
      } finally {
        // Hide loader
        document.getElementById('loader').classList.add('hidden');
      }
    });

</script>


</body>
</html>
	`;
	return c.html(html);
});

app.post('/query', async (c) => {
	const body = await c.req.json();
	const content = body.content || 'Hello, World!';
	const mode = body.mode || 'no';

	const ai = new Ai(c.env.AI);

	let systemMessage = 'You are a helpful assistant.';
	if (mode === 'banan') {
		systemMessage = 'You are a helpful assistant and with every response you also say how much you like banans';
	} else if (mode === 'apfel') {
		systemMessage = 'You are a helpful assistant and with every response you also say how much you like apple';
	} else {
		systemMessage = 'You are a helpful assistant and with every response you also say how much you like cats';
	}

	const messages = [
		{ role: 'system', content: systemMessage },
		{ role: 'user', content },
	];

	const inputs = { messages };
	const res = await ai.run('@cf/meta/llama-2-7b-chat-fp16', inputs);

	// Log the AI response to the console
	console.log('AI response:', JSON.stringify(res, null, 2));

	// Adjusted to match the actual structure of the AI response
	const outputText = res.response ?? "Sorry, I couldn't process that.";

	return c.json({ output: outputText });
});

app.post('/generate-text', async (c) => {
	const formData = await c.req.formData();
	const imageFile = formData.get('image');

	if (imageFile && imageFile instanceof File) {
		// Convert the File to a format suitable for the AI model API
		const fileBuffer = await imageFile.arrayBuffer();
		const ai = new Ai(c.env.AI);

		// Prepare the input according to `@cf/unum/uform-gen2-qwen-500m` input requirements
		const inputs = {
			image: [...new Uint8Array(fileBuffer)],
			// Include additional properties if needed, such as `prompt` or `max_tokens`
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

export default {
	fetch: app.fetch,
};
