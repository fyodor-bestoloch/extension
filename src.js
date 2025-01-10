import axios from 'axios'
import cheerio from 'cheerio-browser'

let matches = [];
let t = 0;

async function fetchWebsiteSourceCode(url) {
    try {
        const response = await axios.get(url);
        return response.data;  // The raw HTML source of the page
    } catch (error) {
        console.error('Error fetching website source code:', error);
    }
}

// Function to extract all inner HTML elements (tags like div, p, a, img, etc.)
function extractInnerElements(html) {
    const $ = cheerio.load(html);
    const elements = [];

    // Select all inner elements (you can refine this selector as needed)
    $('body *').each(function () {
        const elementHtml = $.html(this); // Get the HTML content of each element
        if (elementHtml.trim()) { // Ignore empty elements
            elements.push(elementHtml);  // Push the element's HTML
        }
    });

    return elements;
}


async function sendHtmlElementToApi(element, elementIndex, totalElements) {
    const apiUrl = 'https://salesops.adsterratech.com/chrome_extension/api/regs/chunk';

    const payload = {
        "chunk": element  // The actual HTML element as a string
    };

    try {
        // Send the element to the API
        const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' },

        });
        if(response.data.matches[0]) {
            matches += response.data.matches[0].match_name;
        }

        chrome.runtime.sendMessage({ type: "CONTENT_COUNT", message: `  ${elementIndex}/${totalElements}` });
        console.log(`Element ${elementIndex}/${totalElements} sent successfully. Response: ${response.data.matches[0].match_name}`);
    } catch (error) {
        console.error(`Error sending element ${elementIndex}:`, error);
    }
}

// Main function to process the website and send each inner element
async function processAndSendWebsiteElements(url) {
    // Step 1: Fetch the website HTML
    const htmlSource = await fetchWebsiteSourceCode(url);

    // Step 2: Extract HTML inner elements (tags like div, p, a, img, etc.)
    const elements = extractInnerElements(htmlSource);

    // Step 3: Send each element to the API
    const totalElements = elements.length;
    for (let i = 0; i < totalElements; i++) {
        await sendHtmlElementToApi(elements[i], i + 1, totalElements);


    }
    if (matches.length === 0) {
        matches += "no matches found";
    }
    console.log(matches[0]);
    chrome.runtime.sendMessage({ type: "CONTENT_DATA", message: `Here are the results: ${matches}` });

    console.log('All elements have been sent successfully!');
}
// Example usage
const websiteUrl = window.location.href;  // Replace with the URL of the website you want to process
processAndSendWebsiteElements(websiteUrl);
if (t>0){
    chrome.runtime.sendMessage({ type: "CONTENT_DATA", message: `No matches found` });
    console.log(`no matches`);
}





