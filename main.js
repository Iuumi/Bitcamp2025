const typingForm = document.querySelector(".typing-form");

let userMessage = null;

const handleOutgoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return; //Exit if no message

    console.log(userMessage);
}

//Prevent default form submission and handle outgoing chat
typingForm.addEventListener("submit",(e) => {
    e.preventDefault();

    handleOutgoingChat();
});
