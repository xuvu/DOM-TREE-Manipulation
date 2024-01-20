// content.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Check if the received message is to log the user's DOM
  if (request.action === 'logUserDOM') {
    // Access the body element of the user's DOM
    const userBody = document.body;
    
    // Log information about the user's DOM
    console.log('User\'s body element:', userBody);
  }
});
