# VoiceAid
An Audio-Interactive Document Assistant for the Visually Impaired powered by Google's Gemini
## Need to do
- User Interface: Create a simple HTML form where users can upload their document. A large button with mic button to record voice. live interface to show the speech-to-text input. send button to send to Gemini API. large play button to play audio from text to speech, and the response gemini made alongside the text Gemini displayed.
- Text Extraction: When a user uploads a document, use a library like PDF.js to extract the text from the PDF document. 
- Text Understanding and Question Answering: Use the Gemini API to understand the content and answer any questions the user might have about the document using the speech-to-text from the user.
- Text-to-Speech (TTS): Use the speechSynthesis interface of the Web Speech API to convert the text into audio. This will involve creating a new SpeechSynthesisUtterance instance with the text you want to speak, and passing it to the speechSynthesis.speak() method.
- Speech-to-Text (STT): Use the webkitSpeechRecognition interface of the Web Speech API to convert spoken input into text. This will involve creating a new webkitSpeechRecognition instance, setting up event handlers for the onresult event to handle the recognized text, and calling the start() method to start the speech recognition.


### index1.html  uplaoded file is deleted after ai finishes talking, fix that error.
### microphone stops working after a while, fix that.
