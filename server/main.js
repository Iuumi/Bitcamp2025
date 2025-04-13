const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const messageInput = typingForm.querySelector(".typing-input"); // Get the input field
const sendButton = typingForm.querySelector(".icon.material-symbols-rounded"); // Get the send button
const suggestionList = document.querySelector('.suggestion-list'); // Get the suggestion list

let userMessage = null;

//API confguration
/*fetch('/getGeminiData')
    .then(response => response.json())
    .then(data => {
        console.log('Gemini data:', data);
    })
    .catch(error => console.error('Error fetching data:', error));
*/
const API_URL = `/chat`;

const createMessageElement = (content, className, ...additionalClasses) => {
    const div = document.createElement("div");
    div.classList.add("message", className, ...additionalClasses);
    div.innerHTML = content;
    return div;
}

const formatApiResponse = (responseText) => {
    let formattedText = responseText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Bold text
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<i>$1</i>');   // Italic text
    formattedText = formattedText.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>'); // Code blocks
    formattedText = formattedText.replace(/^- (.*)$/gm, '<li>$1</li>'); // Unordered lists
    const ulRegex = /^(<br>)?(<li>.*?<\/li>(<br>)?)+$/gm;
    formattedText = formattedText.replace(ulRegex, '<ul>$&</ul>');
    formattedText = formattedText.replace(/^\d+\. (.*)$/gm, '<li>$1</li>'); // Ordered lists
    const olRegex = /^(<br>)?(<li>.*?<\/li>(<br>)?)+$/gm;
    formattedText = formattedText.replace(olRegex, '<ol>$&</ol>');
    formattedText = formattedText.replace(/^# (.*)$/gm, '<h1>$1</h1>');     // Heading 1
    formattedText = formattedText.replace(/^## (.*)$/gm, '<h2>$1</h2>');    // Heading 2
    formattedText = formattedText.replace(/^### (.*)$/gm, '<h3>$1</h3>');   // Heading 3
    formattedText = formattedText.replace(/\n/g, '<br>');                 // Line breaks

    return formattedText;
};

//const loadLocalStorageData = () => {
    //const savedchats = localStorage.getItem("savedChats");
    //const isLightMode = (localStorage.getItem("themeColor") ==="light_mode");

    //Apply the stored theme
    //document.body.classList.toggle("lightmore", isLightMode);
    //toggleThemeButton.innerText = isLightmore ? "dark_mode" : "light_mode";

    //Restore saved chats
    //chatList.innerHTML = savedChats || "";

    //document.body.classList.toggle("hide-header", savedChats);
    //chatList.scrollTo(0,chatList.scrollHeight); //Scroll to the bottom}
//create a new message element and return it

//loadLocalStorageData();

// AI WIP Show typing effect by displaying words one by one
//const showTypingEffect = (text, textElement) => {
    //const words = text.split(' ');
    //let currentWordIndex = 0;

    //const typingInterval = setInterval(() => {
        //Append each word to the text element with a space
        //textElement.innerText +=(currentWordIndex === 0 ? '' : ' ')+ words[currentWordIndex++]

        // If all words are displayed
        //if(currentWordIndex === words.length){
        //clearInterval(typingInterval);
        //}
    //}, 75);
//}
//const generateAPIResponse = () => {}

//AI WIP Get the API Response Text //WIP, need 2 get ai stuff in, this is to create the 'typing effect'
//const apiResponse = data?.candidates[0].content.parts[0].text;
//showTypingEffect(apiResponse,textElement);

// Show a loading animation while waiting for API response
const showLoadingAnimation= () => {
    const html = `<div class="message incoming loading">
                        <div class="message-content">
                            <img src="gemini.png" alt="Gemini Image" class="avatar">
                            <p class="text"></p>
                            <div class="loading-indicator">
                                <div class="loading-bar"></div>
                                <div class="loading-bar"></div>
                                <div class="loading-bar"></div>
                            </div>
                        </div>
                    </div>`;
    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);
    chatList.scrollTo(0, chatList.scrollHeight);

    //generateAPIResponse();
    }

/*Handle sending outgoing chat messages*/
const handleOutgoingChat = async () => {
    userMessage = messageInput.value.trim();
    if (!userMessage) return; //Exit if no message

    const userHtml = `<div class="message outgoing">
                        <div class="message-content">
                            <img src="user.png" alt="User Image" class="avatar">
                            <p class="text">${userMessage}</p>
                        </div>
                    </div>`;
    const outgoingMessageDiv = createMessageElement(userHtml, "outgoing");
    chatList.appendChild(outgoingMessageDiv);

    messageInput.value = ''; //clear input field
    chatList.scrollTo(0, chatList.scrollHeight); //Scroll to the bottom
    document.body.classList.add("hide-header"); //Hide the heading one chat starts
    showLoadingAnimation(); //show loading animation after sending message

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await res.json();

        const loadingDiv = chatList.querySelector(".message.incoming.loading");
        if (loadingDiv) {
            chatList.removeChild(loadingDiv);
        }

        // Format the API response before displaying
        const formattedResponse = formatApiResponse(data.response);

        const botHtml = `<div class="message incoming">
                            <div class="message-content">
                                <img src="gemini.png" alt="Gemini Image" class="avatar">
                                <p class="text">${formattedResponse}</p>
                            </div>
                            <span class="icon material-symbols-rounded copy-button">content_copy</span>
                        </div>`;
        const incomingMessageDiv = createMessageElement(botHtml, "incoming");
        chatList.appendChild(incomingMessageDiv);
        chatList.scrollTo(0, chatList.scrollHeight);

        const copyButton = incomingMessageDiv.querySelector(".copy-button");
        if (copyButton) {
            copyButton.addEventListener("click", () => {
                navigator.clipboard.writeText(data.response); // Copy the raw response
                // Optionally provide visual feedback
            });
        }

    } catch (error) {
        console.error("Error communicating with the API:", error);
        const loadingDiv = chatList.querySelector(".message.incoming.loading");
        if (loadingDiv) {
            chatList.removeChild(loadingDiv);
        }
        const errorHtml = `<div class="message incoming error">
                            <div class="message-content">
                                <img src="gemini.png" alt="Gemini Image" class="avatar">
                                <p class="text">Error: Failed to get response.</p>
                            </div>
                        </div>`;
        const errorDiv = createMessageElement(errorHtml, "incoming", "error");
        chatList.appendChild(errorDiv);
        chatList.scrollTo(0, chatList.scrollHeight);
    }
};

//toggleThemeButton.addEventListener("click", () => {
    //document.body.classList.toggle("light_mode");
//})

//Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit",(e) => {
    e.preventDefault();
    handleOutgoingChat();
});

// Optional: You can also trigger the send on button click
sendButton.addEventListener("click", handleOutgoingChat);

// Make suggestions clickable
suggestionList.addEventListener('click', (event) => {
    if (event.target.classList.contains('text')) {
        const suggestionText = event.target.textContent;
        messageInput.value = suggestionText;
        handleOutgoingChat(); // Send the suggestion as a message
    } else if (event.target.parentNode.classList.contains('suggestion')) {
        const suggestionText = event.target.parentNode.querySelector('.text').textContent;
        messageInput.value = suggestionText;
        handleOutgoingChat(); // Send the suggestion as a message
    }
});
