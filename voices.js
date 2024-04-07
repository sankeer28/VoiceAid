if ('speechSynthesis' in window) {
    var synth = window.speechSynthesis;
    var voices = [];
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
                voiceSelect.appendChild(option);
            }
        });

        // Automatically select voice based on user agent
        var isChromium = !!window.chrome && !(navigator.userAgent.match('CriOS') || navigator.userAgent.match('FxiOS'));
        if (isChromium) {
            var liamOption = Array.from(voiceSelect.options).find(option => option.textContent === 'Microsoft Liam');
            if (liamOption) {
                liamOption.selected = true;
            }
        } else {
            var fredOption = Array.from(voiceSelect.options).find(option => option.textContent === 'Fred');
            if (fredOption) {
                fredOption.selected = true;
            }
        }
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
        voices.forEach(function(voice) {
            if (voice.name === selectedVoice) {
                utterance.voice = voice;
            }
        });

        synth.speak(utterance);
    });
} else {
    alert('Your browser does not support speech synthesis. Please use a modern browser.');
}
