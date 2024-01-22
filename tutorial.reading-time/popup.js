// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // Function to send a message to content script when the button is clicked
  function triggerDOMAccess() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(tabs)
      // Send a message to the content script in the active tab
      chrome.tabs.sendMessage(tabs[0].id, { action: 'logUserDOM' });
    });
  }
  document.getElementById('logUserDOM').addEventListener('click', triggerDOMAccess);

  // Function to send a message to content script when the second button is clicked
  function jsonFileUpload() {
    let fileInput = document.getElementById('jsonInput');
    fileInput.addEventListener('change', function() {
      let file = fileInput.files[0];
      let reader = new FileReader();
      reader.onload = function() {
        let fileContent = JSON.parse(reader.result);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.log(tabs)
          // Send a message to the content script in the active tab
          chrome.tabs.sendMessage(tabs[0].id, { action: 'jsonUpload', fileContent: fileContent });
        });
      };
      reader.readAsText(file);
    });
  }
  document.getElementById('jsonInput').addEventListener('click', jsonFileUpload);

});
