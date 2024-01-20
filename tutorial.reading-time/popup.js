// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // Function to send a message to content script when the button is clicked
  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabs[0].id, { action: 'logUserDOM' });
    });
  }

  // Attach click event listener to the button
  document.getElementById('logUserDOM').addEventListener('click', sendMessageToContentScript);
});
