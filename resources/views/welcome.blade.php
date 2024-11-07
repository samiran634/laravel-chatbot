<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat App</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap" />
<body class="bg-gray-100">
    <div class="status-indicator">
    
    </div>
    <div class="container">
        <div class="chat-container">
            <div class="messages">
                <div class="message received">
                Hello! How can I help you today?
                </div>
          
            </div>
       
            <div class="voice-container">
                <div class="input-container">
            <input type="text" class="message-input" placeholder="Type your message...">
                <button class="send-button">Send</button>
                </div>
                <div class="voice-button">
           
                    <div class="speaker-icon">
                <span class="material-symbols-outlined"
                style="color: white; font-size: 32px; cursor: pointer; margin-left: 10px;">
                    volume_up
                </span>
                </div>
            </div>  
            <div class="mic-button">
                <span class="material-symbols-outlined"
                style="color: white; font-size: 32px; cursor: pointer; margin-left: 10px;">
                    mic
                </span>
                <div class="stop-icon" style="display: none;">
                        <span class="material-symbols-outlined"
                    style="color: white; font-size: 32px; cursor: pointer; margin-left: 10px;">
                        stop_circle
                    </span>
                    </div>
                    </div>
                </div>
            </div>
        </div>
      
        <div class="history-container"> 
          
            <div class="intro-text">
                <span class="intro-text-title">
                Check chat history
                </span>
                <span class="material-symbols-outlined up" style="display: none;" >
                expand_circle_down
            </span>
            <span class="material-symbols-outlined blink" style="font-size: 32px; cursor: pointer; margin-left: 10px;">
                expand_circle_up
            </span>
            </div>
            <div class="history-container-content" style="display: none;">
            <div class="history-header">

            </div>
            <div class="history-content">

            </div>  
            <div class="history-item">

            </div>
            <div class="history-item-header">

            </div>
                <div class="history-item-content">

                </div>

            </div>

    </div>
    </div>

    <div class="modal-content" style="display: none;">
   </div>

 </body>
 </html>