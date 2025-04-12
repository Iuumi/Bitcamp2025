const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;

const API_URL = ``; //I'm going to wait for josh becuase i think he has been doing this

//create a new message element and return it
const createMessageElement = (content, className) => {
    const div = document.createElement("div");
    div.classList.add("message", className);
    div.innerHTML = content;
    return div;
}

const generateAPIResponse = () => {

}

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

    generateAPIResponse();
    }
    
//Handle sending outgoing chat messages
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
    setTimeout(showLoadingAnimation, 500); //show loading animation after a delay
}



//Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit",(e) => {
    e.preventDefault();

    handleOutgoingChat();
});
