const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.querySelector("#toggle-theme-button");
const messageInput = typingForm.querySelector(".typing-input");
const sendButton = typingForm.querySelector(".icon.material-symbols-rounded");

const API_URL = `/chat`;
let userMessage = null;

const handleOutgoingChat = async () => {
    userMessage = messageInput.value.trim();
    if (!userMessage) return;

    const userHtml = `<div class="message-content">
                        <img src="user.png" alt="User Image" class="avatar">
                        <p class="text">${userMessage}</p>
                      </div>`;
    const outgoingMessageDiv = createMessageElement(userHtml, "outgoing");
    chatList.appendChild(outgoingMessageDiv);

    messageInput.value = '';
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

        // Remove loading animation
        const loadingDiv = chatList.querySelector(".message.incoming.loading");
        if (loadingDiv) chatList.removeChild(loadingDiv);

        const formattedResponse = formatApiResponse(data.response);

        const botHtml = `<div class="message-content">
                            <img src="gemini.png" alt="Gemini Image" class="avatar">
                            <p class="text">${formattedResponse}</p>
                         </div>
                         <span class="icon material-symbols-rounded copy-button">content_copy</span>`;
        const incomingMessageDiv = createMessageElement(botHtml, "incoming");
        chatList.appendChild(incomingMessageDiv);
        chatList.scrollTo(0, chatList.scrollHeight);

        // Add copy listener
        const copyButton = incomingMessageDiv.querySelector(".copy-button");
        if (copyButton) {
            copyButton.addEventListener("click", () => {
                navigator.clipboard.writeText(data.response);
            });
        }

        // Save to localStorage
        localStorage.setItem("savedChats", chatList.innerHTML);

    } catch (error) {
        console.error("Error communicating with the API:", error);

        const loadingDiv = chatList.querySelector(".message.incoming.loading");
        if (loadingDiv) chatList.removeChild(loadingDiv);

        const errorHtml = `<div class="message-content">
                                <img src="gemini.png" alt="Gemini Image" class="avatar">
                                <p class="text">Error: Failed to get response.</p>
                            </div>`;
        const errorDiv = createMessageElement(errorHtml, "incoming", "error");
        chatList.appendChild(errorDiv);
        chatList.scrollTo(0, chatList.scrollHeight);
    }
};

const formatApiResponse = (text) => {
    let formatted = text
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>')
        .replace(/\n{1,2}(<li>.*<\/li>)+/gim, (match) => {
            const isNumbered = /^\d+\./.test(match);
            return isNumbered ? `<ol>${match}</ol>` : `<ul>${match}</ul>`;
        })
        .replace(/\n/g, '<br>');

    return formatted;
};


const createMessageElement = (content, className, ...additionalClasses) => {
    const div = document.createElement("div");
    div.classList.add("message", className, ...additionalClasses);
    div.innerHTML = content;
    return div;
};

const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                    <img src="user.png" alt="Gemini Image" class="avatar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                  </div>
                  <span class="icon material-symbols-rounded">content_copy</span>`;
    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);
    chatList.scrollTo(0, chatList.scrollHeight);
};

const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
        chatList.innerHTML = savedChats;
        document.body.classList.add("hide-header");
        chatList.scrollTo(0, chatList.scrollHeight);

        // Rebind copy buttons
        document.querySelectorAll(".copy-button").forEach(button => {
            button.addEventListener("click", () => {
                const text = button.previousElementSibling?.querySelector(".text")?.textContent || '';
                navigator.clipboard.writeText(text);
            });
        });
    }
};

// Handle suggestion clicks
document.querySelectorAll(".suggestion").forEach(suggestion => {
    suggestion.addEventListener("click", () => {
        const text = suggestion.querySelector(".text").textContent;
        messageInput.value = text;
        handleOutgoingChat();
    });
});

// Form submit
typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOutgoingChat();
});

// Load previous chat
loadLocalStorageData();


// Delete button functionality
const deleteButton = document.querySelector("#clear-chat-button");
if (deleteButton) {
    deleteButton.addEventListener("click", () => {
        chatList.innerHTML = "";
        localStorage.removeItem("savedChats");
        document.body.classList.remove("hide-header");
    });
}
