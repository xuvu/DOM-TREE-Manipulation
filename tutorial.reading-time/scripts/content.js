var htmlTree;
let sequenceCount = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // Check if the received message is to log the user's DOM
  if (request.action === 'logUserDOM') {
    // Access the body element of the user's DOM
    var userBody = document.body;
    htmlTree = buildTree(userBody);    
    // Log information about the user's DOM
    console.log(JSON.stringify(htmlTree, null, 2));

    // Create a Blob from the htmlTree
    var blob = new Blob([JSON.stringify(htmlTree, null, 2)], {type: "application/json"});
    // Create a URL representing the Blob
    var url = URL.createObjectURL(blob);

    // Create a link for the user to download the htmlTree
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'htmlTree.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  if(request.action === 'jsonUpload') {
    // Log the file content
    console.log('File content:', request.fileContent);
    visualizeTree(request.fileContent);
  }
});

function buildTree(element, current_level = 0, sequence = '') {
  if (element.tagName.toLowerCase() === 'script') {
    return null; // Skip script elements
  }
  sequence = sequence ? sequence + ' ' + element.tagName.toLowerCase() : element.tagName.toLowerCase();
  
  // If the sequence is already in sequenceCount, increment its count. Otherwise, initialize it to 0.
  sequenceCount[sequence] = sequenceCount[sequence] !== undefined ? sequenceCount[sequence] + 1 : 0;
  
  var node = {
    id: element.id,
    tag: element.tagName.toLowerCase(),
    type: element.type,
    checked: element.checked,
    node_identifier: sequence, // Include the sequence count
    sequenceCount: sequenceCount[sequence],
    text: element.innerText.trim(),
    value: element.value, // Include the value property
    tree_level: current_level,
    children: []
  };

  for (var i = 0; i < element.children.length; i++) {
    var childNode = buildTree(element.children[i], current_level + 1, sequence);
    if (childNode !== null) {
      node.children.push(childNode);
    }
  }

  return node;
}

function visualizeTree(element) {
  var node = {
    text: element.text,
    tag: element.tag,
    type: element.type,
    checked: element.checked,
    node_identifier: element.node_identifier,
    sequenceCount: element.sequenceCount,
    value: element.value,
    tree_level: element.tree_level,
    children:[]
  };
  fillNode(node)

  if (element.children.length > 0) {
    var childList = document.createElement('ul');
    element.children.forEach(function(child) {
      var childNode = visualizeTree(child, childList);
      node.children.push(childNode);
    });
  }
  return node;
}

function fillNode(node) {
  switch(node.type) {
    case 'text':
      // Handle text input
      console.log('This is a text input with value: ' + node.value);
      document.querySelectorAll(node.node_identifier)[node.sequenceCount].value = node.value;
      break;
    case 'checkbox':
      // Handle checkbox input
      console.log('This is a checkbox input and it is ' + (node.checked ? 'checked' : 'not checked'));
      document.querySelectorAll(node.node_identifier)[node.sequenceCount].checked = node.checked;
      break;
    case 'radio':
      // Handle radio input
      console.log('This is a radio input and it is ' + (node.checked ? 'selected' : 'not selected'));
      document.querySelectorAll(node.node_identifier)[node.sequenceCount].checked = node.checked;
      break;
    case 'select-one':
      // Handle select input
      console.log('This is a radio input and it is ' + (node.value ? 'selected' : 'not selected'));
      document.querySelectorAll(node.node_identifier)[node.sequenceCount].value = node.value;
      break;
    case 'date':
      // date
      console.log('This is a date input and it is ' + (node.value ? 'selected' : 'not selected'));
      document.querySelectorAll(node.node_identifier)[node.sequenceCount].value = node.value;
      break;
    default:
      console.log('This is a ' + node.type + ' input');
    }
  }
