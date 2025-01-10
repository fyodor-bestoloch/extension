let messages = [];
let counts = [];

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CONTENT_DATA") {
        // Store the incoming message in the array
        messages.push(message.message);
        console.log("Stored message:", message.message);

        // Optionally, respond back to the sender (content script or popup)
        sendResponse({ status: "Message received" });
    }
    if (message.type === "CONTENT_COUNT") {
        // Store the incoming message in the array
        counts.push(message.message);
        console.log("Stored message:", message.message);

        // Optionally, respond back to the sender (content script or popup)
        sendResponse({ status: "Message received" });
    }
    // Handle requests from the popup to get the messages
    if (message.type === "GET_MESSAGES") {
        sendResponse({ messages: messages });
    }
    if (message.type === "GET_COUNT") {
        sendResponse({ messages: counts });
    }
});