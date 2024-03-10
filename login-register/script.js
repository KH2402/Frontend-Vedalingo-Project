document.addEventListener('DOMContentLoaded', function() {
    const inputType = document.getElementById('inputType');
    const fileInput = document.getElementById('fileInput');
    const textField = document.getElementById('textField');
    const targetLanguage = document.getElementById('targetLanguage');
    const translateButton = document.getElementById('translateButton');
    const translationResult = document.getElementById('translationResult');
    const audioPlayer = document.getElementById('audioPlayer');

    inputType.addEventListener('change', function() {
        if (inputType.value === 'file') {
            fileInput.style.display = 'block';
            textField.style.display = 'none';
        } else {
            fileInput.style.display = 'none';
            textField.style.display = 'block';
        }
    });

    translateButton.addEventListener('click', function() {
        let text;
        if (inputType.value === 'file') {
            text = getFileContent();
        } else {
            text = textField.value.trim();
        }

        const language = targetLanguage.value;

        if (!text) {
            alert('Please provide input text or select a file.');
            return;
        }

        // Make translation request
        axios.post('http://localhost:8080/api/translate', {
            text: text,
            targetLanguage: language
        })
        .then(function(response) {
            const translatedText = response.data.translation;
            translationResult.textContent = translatedText;

            // Generate audio for translated text
            generateAudio(translatedText, language);
        })
        .catch(function(error) {
            console.error('Translation error:', error);
            alert('Translation failed. Please try again.');
        });
    });

    function getFileContent() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a file.');
            return '';
        }

        // Use FileReader to read file content
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                resolve(event.target.result);
            };
            reader.onerror = function(error) {
                reject(error);
            };
            reader.readAsText(file);
        });
    }

    function generateAudio(text, language) {
        // Make request to TTS service to generate audio
        axios.post('http://localhost:8080/api/audio', {
            text: text,
            language: language
        })
        .then(function(response) {
            const audioUrl = response.data.audioUrl;
            audioPlayer.src = audioUrl;
            audioPlayer.play();
        })
        .catch(function(error) {
            console.error('Audio generation error:', error);
            alert('Audio generation failed. Please try again.');
        });
    }
});
