
    document.getElementById('sendButton').style.display = 'none';
    document.getElementById('questionInput').style.display = 'none';
  document.getElementById('copyButton').addEventListener('click', () => {
    const outputElement = document.getElementById('output');
    const textToCopy = outputElement.innerText;
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    const copyButton = document.getElementById('copyButton');
    copyButton.textContent = 'Copied';
    setTimeout(() => {
        copyButton.textContent = 'Copy';
    }, 2000); 
});


  const apiKeyInput = document.getElementById('apiKeyInput');
  const togglePasswordVisibility = document.getElementById('togglePasswordVisibility');

  togglePasswordVisibility.addEventListener('click', () => {
    const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    apiKeyInput.setAttribute('type', type);

    togglePasswordVisibility.classList.toggle('fa-eye');
    togglePasswordVisibility.classList.toggle('fa-eye-slash');
  });
  import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

  let API_KEY = localStorage.getItem('API_KEY');
  document.getElementById('apiKeyInput').value = API_KEY;

  let genAI;
  let model;

  async function createModel(modelType = "gemini-pro") {
    API_KEY = document.getElementById('apiKeyInput').value;
    localStorage.setItem('API_KEY', API_KEY);
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ 
      model: modelType,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
      ]
    });
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKeyInput');
    apiKeyInput.placeholder = "Enter API key here";
    toggleRecording(); 
  });
  
  await createModel();

const charCountElement = document.createElement('p');
charCountElement.textContent = 'Character Count: 0'; 
const outputDiv = document.getElementById('output');
outputDiv.parentNode.insertBefore(charCountElement, outputDiv);


const liveTranscriptionElement = document.getElementById('liveTranscription');


async function handleResponse(text) {
  const outputElement = document.getElementById('output');
  if (text.trim() === '') {
    outputElement.innerText = 'No response found';
  } else {
    const converter = new showdown.Converter();
    const html = converter.makeHtml(text);
    outputElement.innerHTML = html;
    playAudio(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.addEventListener('end', () => {
      document.getElementById('questionInput').value = ''; 
    });
    window.speechSynthesis.speak(utterance);
    document.getElementById('questionInput').value = ''; 
  }
}

function playAudio(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = 0.8;
  utterance.rate = 0.9;
  utterance.volume = 1;
  utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Microsoft Liam Online (Natural) - English (Canada)');

  window.speechSynthesis.speak(utterance);
}
  

document.getElementById('sendButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const prompt = document.getElementById('questionInput').value;
    const outputElement = document.getElementById('output');
    outputElement.innerHTML = '<p>Please wait...</p>';
  
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = async function(evt) {
        const arrayBuffer = evt.target.result;
        let textContent = '';
  
        if (file.type === 'application/pdf') {
          const pdfData = new Uint8Array(arrayBuffer);
          const pdfDoc = await pdfjsLib.getDocument({data: pdfData}).promise;
          for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const text = await page.getTextContent();
            textContent += text.items.map(item => item.str).join(' ');
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const textContentResult = await mammoth.extractRawText({arrayBuffer: arrayBuffer});
          textContent = textContentResult.value;
        } else {
          const imageParts = await Promise.all(
            [...fileInput.files].map(fileToGenerativePart)
          );
          const result = await model.generateContent([prompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();
          outputElement.innerText = text;
          playAudio(text); 
          return;
        }
  
        console.log(textContent);
  
       
        const extractedTextCharCount = textContent.length;
        const questionCharCount = prompt.length;
        charCountElement.textContent = `Character count: ${extractedTextCharCount + questionCharCount} `;
        const result = await model.generateContent(prompt + ' ' + textContent);
        const response = await result.response;
        const text = response.text();
  
        if (text.trim() === '') {
          outputElement.innerText = 'No input or image selected';
        } else {
          const converter = new showdown.Converter();
          const html = converter.makeHtml(text);
          outputElement.innerHTML = html;
          playAudio(text); 
        }
        document.getElementById('questionInput').value = '';
      };
      reader.readAsArrayBuffer(file);
    } else {
      if (prompt.trim() === '') {
        outputElement.innerText = 'Please ask a question or upload a file and ask.';
      } else {
        const questionCharCount = prompt.length;
        charCountElement.textContent = `Character count: ${questionCharCount}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        if (text.trim() === '') {
          outputElement.innerText = 'No response found for the given question.';
        } else {
          const converter = new showdown.Converter();
          const html = converter.makeHtml(text);
          outputElement.innerHTML = html;
          playAudio(text); 
        }
      }
    }
    document.getElementById('questionInput').value = '';
  });
  

document.getElementById('questionInput').addEventListener('input', () => {
  const questionCharCount = document.getElementById('questionInput').value.length;
  charCountElement.textContent = `Character count: ${questionCharCount}`; 
});

  
  document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file.type.startsWith('image/')) {
      await createModel("gemini-1.5-flash"); 
    } else {
      await createModel("gemini-pro"); 
    }
  });

  document.getElementById('apiKeyInput').addEventListener('input', () => {
    createModel(model.model);
  });

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true;
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      recognition.start(); 
    };
  } else {
    console.error('Speech recognition not supported');
  }
  
  recognition.onresult = function(event) {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const transcript = event.results[i][0].transcript;
        if (transcript.toLowerCase().includes('stop talking')) {
          window.speechSynthesis.cancel(); 
          document.getElementById('fileInput').value = ''; 
        } else if (transcript.toLowerCase().includes('delete file') || transcript.toLowerCase().includes('remove file') || transcript.toLowerCase().includes('remove the file') || transcript.toLowerCase().includes('remove the file')) {
          document.getElementById('fileInput').value = '';
          window.speechSynthesis.cancel();
          createModel("gemini-pro");
        } else {
          document.getElementById('questionInput').value += transcript; 
          updateLiveTranscription(transcript);
        }
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
  
    updateLiveTranscription(interimTranscript);
  
    if (interimTranscript.trim() === '') {
      document.getElementById('sendButton').click();
    }
  };
  

function startRecognition() {
  recognition.start();
  recognition.onend = function() {
    recognition.start(); 
  }
}

startRecognition();

function updateLiveTranscription(text) {
  liveTranscriptionElement.textContent = text;
  setTimeout(() => {
    liveTranscriptionElement.textContent = '';
  }, 9000); 
}

  function toggleRecording() {
    if (recognition) {
      if (recognition.state === 'listening') {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  }

