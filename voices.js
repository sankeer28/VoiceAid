if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
    var voices = [];
    var microsoftLiamOnlineAvailable = false;

    function populateVoiceList() {
        voices = synth.getVoices();

        var voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';

        voices.forEach(function(voice, i) {
            if (voice.lang.startsWith('en')) {
                var option = document.createElement('option');
                option.textContent = voice.name;
                option.setAttribute('data-lang', voice.lang);
                option.setAttribute('data-name', voice.name);
                if (voice.name === 'Microsoft Liam Online (Natural) - English (Canada)') {
                    option.selected = true; 
                    microsoftLiamOnlineAvailable = true;
                }
                voiceSelect.appendChild(option);
            }
        });
    }

    populateVoiceList();

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    document.getElementById('speakButton').addEventListener('click', function() {
        var textInput = document.getElementById('textInput').value;
        var voiceSelect = document.getElementById('voiceSelect');
        var selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        var utterance = new SpeechSynthesisUtterance(textInput);
        if (microsoftLiamOnlineAvailable) {
            voices.forEach(function(voice) {
                if (voice.name === selectedVoice) {
                    utterance.voice = voice;
                }
            });
        } else {
            utterance.voice = synth.getVoices().find(voice => voice.default);
        }

        synth.speak(utterance);
    });
} else {
    alert('Your browser does not support speech synthesis. Please use a modern browser.');
}
