chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'queryAPI') {
            fetch(request.url)
                .then(response => response.json())
                .then(content => sendResponse(content))
                .catch(error => sendResponse(''));
            return true;
        }
    }
);