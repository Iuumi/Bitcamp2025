const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");

let userMessage = null;

//API confguration
fetch('/getGeminiData')
  .then(response => response.json())
  .then(data => {
    console.log('Gemini data:', data);
  })
  .catch(error => console.error('Error fetching data:', error));
const API_URL = `http://127.0.0.1:5000/chat`; //I'm going to wait for josh becuase i think he has been doing this

const handleOutgoingChat = async () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if (!userMessage) return;

    const html = `<div class="message-content">
                <img src="user.png" alt="User Image" class="avatar">
                <p class="text"></p>
            </div>`;
    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset();
    chatList.scrollTo(0, chatList.scrollHeight);
    document.body.classList.add("hide-header");
    showLoadingAnimation();

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });
        const data = await res.json();

        const botHtml = `<div class="message-content">
                            <img src="bot.png" alt="Gemini Image" class="avatar">
                            <p class="text">${data.response}</p>
                         </div>`;
        const incomingMessageDiv = createMessageElement(botHtml, "incoming");
        chatList.appendChild(incomingMessageDiv);
        chatList.scrollTo(0, chatList.scrollHeight);
    } catch (error) {
        console.error("Error communicating with the API:", error);
    }
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
const createMessageElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
}

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
    const html = `<div class="message-content">
                    <img src="user.png" alt="Gemini" Image" class="avatar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <span class="icon material-symbols-rounded">content_copy</span>`;

    const incomingMessageDiv = createMessageElement(html, "incoming","loading");
    chatList.appendChild(incomingMessageDiv);

    //generateAPIResponse();
    }
    
/*Handle sending outgoing chat messages
const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return; //Exit if no message

    const html = `<div class="message-content">
                <img src="user.png" alt="User Image" class="avatar">
                <p class="text"></p>
            </div>`;
    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerText=userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset() //clear input field
    chatList.scrollTo(0,chatList.scrollHeight); //Scroll to the bottom
    document.body.classList.add("hide-header"); //Hide the heading one chat starts
    setTimeout(showLoadingAnimation, 500); //show loading animation after a delay
} */

//toggleThemeButton.addEventListener("click", () => {
    //document.body.classList.toggle("light_mode");
//})

//Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit",(e) => {
    e.preventDefault();

    handleOutgoingChat();
});
