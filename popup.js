document.getElementById('run-script').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['src.js'],
        }, () => {
            const container = document.getElementById('main-content');
            container.innerHTML = `
                <h1>Inspecting the elements...</h1>
            `;
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const resultsContainer = document.getElementById("results");
    function insertBody(message){
        document.getElementById("res1").innerHTML = message;
    }
    function insertRes(message){
        document.getElementById("res2").innerHTML = message;
    }
    // Function to append a new message to the popup
    function appendMessage(message) {
        const messageElement = document.createElement("p");
        messageElement.textContent = message;
        resultsContainer.appendChild(messageElement);
    }

    // Fetch the current messages from the background script
    function fetchMessages() {
        chrome.runtime.sendMessage({ type: "GET_MESSAGES" }, (response) => {
            if (response && response.messages) {
                // Display all messages received so far
                resultsContainer.innerHTML = ''; // Clear the container before adding new messages
                response.messages.forEach((message) => {
                    insertRes(message);
                });
            }
        });
    }
    function getCount(){
        chrome.runtime.sendMessage({ type: "GET_COUNT" }, (response) => {
        if (response && response.messages) {
            // Display all messages received so far
            resultsContainer.innerHTML = ''; // Clear the container before adding new messages
            response.messages.forEach((message) => {
                insertBody(message);
            });
        }
    });
}
    getCount();
    // Call fetchMessages initially to populate the popup with existing messages
    fetchMessages();

    // Optionally, periodically check for new messages (for dynamic updates)
    setInterval(() => {
        fetchMessages();
    }, 50); // Fetch new messages every 50 millisecond (adjust timing as needed)
    setInterval(() => {
        getCount();
    }, 50);
});