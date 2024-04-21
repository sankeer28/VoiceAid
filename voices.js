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

    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    document.getElementById('speakButton').addEventListener('click', function() {
        populateVoiceList();
        var textInput = document.getElementById('textInput').value;
        var voiceSelect = document.getElementById('voiceSelect');
        var selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

        var utterance = new SpeechSynthesisUtterance(textInput);

        if (microsoftLiamOnlineAvailable) {
            utterance.voice = voices.find(function(voice) {
                return voice.name === selectedVoice;
            });
        } else {
            utterance.voice = synth.getVoices().find(function(voice) {
                return voice.default;
            });
        }

        synth.speak(utterance);
    });
} else {
    alert('Your browser does not support speech synthesis. Please use a modern browser.');
}
