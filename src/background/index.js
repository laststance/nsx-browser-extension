chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'setIcon') {
    chrome.action.setIcon({ path: request.path })
  }
})
