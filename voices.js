if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
    var voices = [];
    var defaultVoice = null;

    function populateVoiceList() {
        voices = synth.getVoices();

        var voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';

        voices.forEach(function(voice, i) {
            var option = document.createElement('option');
            option.textContent = voice.name;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
            if (/Chrome/.test(navigator.userAgent)) {
                if (voice.name === 'Microsoft Liam Online (Natural) - English (Canada)') {
                    option.selected = true;
                    defaultVoice = voice;
                }
            } else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                // On iOS, set default to the first available voice
                if (i === 0) {
                    option.selected = true;
                    defaultVoice = voice;
                }
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

        if (/Chrome/.test(navigator.userAgent)) {
            utterance.voice = voices.find(function(voice) {
                return voice.name === selectedVoice;
            });
        } else {
            utterance.voice = defaultVoice;
        }

        synth.speak(utterance);
    });
} else {
    alert('Your browser does not support speech synthesis. Please use a modern browser.');
}
