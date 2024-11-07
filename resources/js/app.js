import './bootstrap';
import postRequest from './gptmessage';
import getVoices from './gptvoice';
import speech from './speaker';
 
const modal = document.querySelector('.modal-content');
let container = document.querySelector('.chat-container');
let messages = document.querySelector('.messages');
let messageInput = document.querySelector('.message-input');
let sendButton = document.querySelector('.send-button');
let voiceButton = document.querySelector('.voice-button');
let messageResponse = document.querySelector('.received');
let micButton = document.querySelector('.mic-button');
 let stopIcon = document.querySelector('.stop-icon');
 let up = document.querySelector('.up');
 let historyContainer = document.querySelector('.history-container');
 let blink = document.querySelector('.blink');
 let historyHeader = document.querySelector('.history-header');
 let historyContent = document.querySelector('.history-content');
 let historyItem = document.querySelector('.history-item');
 let historyItemHeader = document.querySelector('.history-item-header');
 let historyItemContent = document.querySelector('.history-item-content');
 let historyContainerContent = document.querySelector('.history-container-content');
 let session_id;
 let gptmessagearray;
 let userMessagearray;
 if(!window.isloaded){
    window.isloaded = true;
     session_id =  new Date().getTime();
     gptmessagearray = [];
    userMessagearray = [];
 }
sendButton.addEventListener('click', async () => {
    let message = messageInput.value;
    if (message === '') {
        alert('Please enter a message');
        return;
    }
    messages.innerHTML += `<div class="message sent">${message}</div>`;
    messageInput.value = '';
    userMessagearray.push(message);
    // Create and show the thinking indicator
    const thinkingDiv = document.createElement('div');
    thinkingDiv.style.cssText = `
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.9);
        padding: 8px 12px;
        border-radius: 8px;
        color: #333;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: blink 1s infinite;
    `;
    thinkingDiv.textContent = "Chat-bot is thinking...";
    container.appendChild(thinkingDiv);

    // Add the blinking animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    try {
        const response = await postRequest(message);

        console.log('Response:', response); // Check the response structure
        let completeMessage = '';

        // Check if response.data exists and is a string
        if (response && typeof response === 'string') {
            response.split('\n').forEach(line => {
                if (line.trim() && line.trim() !== "done") { // Skip if the line is "done"
                    try {
                        const parsedLine = JSON.parse(line.replace('data: ', ''));
                        if (parsedLine.choices && parsedLine.choices[0].delta.content) {
                            // Append content from each chunk to construct the full message
                            completeMessage += parsedLine.choices[0].delta.content;
                        }
                    } catch (parseError) {
                        console.error('Error parsing line:', parseError);
                    }
                }
            });

            // After constructing the full message, display it
            messages.innerHTML += `<div class="message received">${completeMessage}</div>`;

            // Store the final message in local storage
            gptmessagearray.push(completeMessage);
            let obj = {
                session_id: session_id,
                gptmessagearray: gptmessagearray,
                userMessagearray: userMessagearray
            };
            localStorage.setItem('history', JSON.stringify(obj));
        } else {
            console.error('Unexpected response format:', response);
        }
    } catch (error) {
        console.error('Error logging response:', error);
    } finally {
        // Remove the thinking indicator once the API call is complete
        container.removeChild(thinkingDiv);
    }
});




voiceButton.addEventListener('click', async () => {
     modal.style.display === 'none' ? modal.style.display = 'grid' : modal.style.display = 'none';
    const voices = await getVoices();
    console.log(voices.voices);
    let arrOfVoices = voices.voices;

   
 
    // Create a module for each voice option
    arrOfVoices.forEach(voice => {
        const voiceModule = document.createElement('div');
        voice = voice.slice(3);
        voiceModule.textContent = voice;
      
        voiceModule.className = 'voice-module';
        voiceModule.addEventListener('click', () => {
            console.log(`Selected voice: ${voice}`);
            localStorage.setItem('voice',voice);


        });
    
      
       
       modal.appendChild(voiceModule);
    });

    // Display the modal
    
});

 
 
// Close modal when clicking outside of the modal content
modal.addEventListener('click', async (event) => {
    console.log(event.target);
    let voice = localStorage.getItem('voice');
    localStorage.removeItem('voice');
    if (event.target.className === 'voice-module') {
        modal.style.display = 'none';
            let demotext="hello how are you";
        try {
            // Await the promise returned by the speech function
            let sound = await speech(demotext, voice);
            console.log(sound);
            if (sound && typeof sound.play === 'function') {
                sound.play();
            } else {
                console.error('The sound object does not have a play method:', sound);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
});

micButton.addEventListener('click', async () => {
    // Check if SpeechRecognition is supported
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
        return;
    }

    // Toggle visibility for feedback
    micButton.style.display = 'none';
    stopIcon.style.display = 'flex';

    // Create a new instance of SpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.interimResults = true; // Enable partial results
    recognition.lang = 'en-US'; // Language set to English (US)
    recognition.continuous = false; // Single phrase capture

    // Button and input elements
    const messageInput = document.querySelector('.message-input');
    const statusIndicator = document.querySelector('.status-indicator');

    // Start listening
    recognition.start();
    statusIndicator.textContent = "Listening..."; // Show listening status

    // Capture the voice input
    recognition.addEventListener('result', (event) => {
        let transcript = '';
        for (const result of event.results) {
            transcript += result[0].transcript; // Append each recognized phrase
        }

        // Update input with recognized text
        messageInput.value = transcript;
    });

    // Handle end of recognition
    recognition.addEventListener('end', () => {
        statusIndicator.textContent = ""; // Clear indicator on end
        micButton.style.display = 'flex';
        stopIcon.style.display = 'none';
    });

    // Handle errors
    recognition.addEventListener('error', (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Speech recognition error: " + event.error);
        statusIndicator.textContent = ""; // Clear indicator on error
        micButton.style.display = 'flex';
        stopIcon.style.display = 'none';
    });
});

blink.addEventListener('click', () => {
    blink.style.display = 'none'; 
    up.style.display = 'flex';
    let history = localStorage.getItem('history');
    let obj = JSON.parse(history);
    if(obj===null){
        alert('No history found');
        return;
    }
    let id = obj.session_id;
 historyContainer.style.top = '0';
    historyContainer.style.display = 'flex';
    historyHeader = document.createElement('div');
    historyHeader.className = 'history-header';
    historyHeader.innerHTML = '<h2>Conversation History</h2>';
    
    historyContent = document.createElement('div');
    historyContent.className = 'history-content';

    historyItem = document.createElement('div');
    historyItem.className = 'history-item';

    historyItemHeader = document.createElement('div');
    historyItemHeader.className = 'history-item-header';
    historyItemHeader.innerHTML = `<span class="history-item-date">${id}</span> `;
    historyItemContent = document.createElement('div');
    historyItemContent.className = 'history-item-content';
    historyItemContent.innerHTML = '<p>This is a sample conversation history item.</p>';

    historyItem.appendChild(historyItemHeader);
    historyItem.appendChild(historyItemContent);

    historyContent.appendChild(historyItem);

    historyContainer.appendChild(historyHeader);
    
    historyContainer.appendChild(historyContent);
});
up.addEventListener('click', () => {
    historyContainerContent.style.display = 'none';
    up.style.display = 'none';
    blink.style.display = 'flex';
    historyContainer.removeChild(historyHeader);
    historyContainer.removeChild(historyContent);
    historyContainer.style.top = '20em';
});
historyContainer.addEventListener('click',(event)=>{
    let chatcontainer = document.querySelector('.chat-container');
    let messages = document.querySelector('.messages');
    console.log(event.target);
    if (event.target.className === 'history-item-date'){
        let id = event.target.textContent;
        let history = localStorage.getItem('history');
        let obj = JSON.parse(history);
     
      messages.innerHTML = '';
      if(id==obj.session_id){
        let gptmessagearray = obj.gptmessagearray;
        let userMessagearray = obj.userMessagearray;
      userMessagearray.forEach((message, index) => {
        messages.innerHTML += `<div class="message sent">${message}</div>`;
        if (gptmessagearray[index]) {
            messages.innerHTML += `<div class="message received">${gptmessagearray[index]}</div>`;
        }
      });
      }
    }
});

