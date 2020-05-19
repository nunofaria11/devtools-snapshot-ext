import Logger from './app/logger';
import Constants from './app/constants';
import Messaging from './app/messaging';

Logger.enabled = false;

let windowMessageDeferred = null;

Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);

async function handleConsoleEntriesRequest() {

    // Request the page context for logEntries
    const logEntries = await requestPageLogEntries();

    return Promise.resolve(logEntries);
}

async function requestPageLogEntries() {
    return new Promise((resolve, reject) => {

        const request = { name: 'req:devtools-snapshot_log-entries' };
        window.postMessage(request, window.origin);

        windowMessageDeferred = { resolve, reject };
    });
}

window.addEventListener('message', (evt) => {
    if (evt.source !== window || !evt.data) {
        return;
    }
    const response = evt.data;
    if (response.name !== 'res:devtools-snapshot_log-entries') {
        return;
    }
    if (windowMessageDeferred) {
        windowMessageDeferred.resolve(response.logEntries || []);
        windowMessageDeferred = null;
    }
});

/*
    * Adapted from:
    * https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
    */
function scriptFromFile(file) {
    const script = document.createElement("script");
    script.src = browser.extension.getURL(file);
    return script;
}

function inject(parentNode, scripts) {
    if (scripts.length === 0) {
        return;
    }
    const otherScripts = scripts.slice(1);
    const script = scripts[0];
    const onload = function () {
        script.parentNode.removeChild(script);
        inject(parentNode, otherScripts);
    };
    if (script.src !== "") {
        script.onload = onload;
        parentNode.appendChild(script);
    } else {
        parentNode.appendChild(script);
        onload();
    }
}

function onDocumentHeadReady() {
    const scriptFiles = [
        'content_inject.js'
    ];
    const scripts = scriptFiles.map(scriptFromFile);
    inject(document.head || document.documentElement, scripts);
}

// function waitForDocumentHead(readyCallback) {
//     // Select the node that will be observed for mutations
//     const targetNode = document.all[0];

//     // Options for the observer (which mutations to observe)
//     const config = { childList: true, subtree: false };

//     // Callback function to execute when mutations are observed
//     const mutationCallback = function (mutationsList, observer) {
//         for (let mutation of mutationsList) {
//             if (mutation.type === 'childList' && mutation.addedNodes) {
//                 for (let newNode of mutation.addedNodes) {
//                     if (newNode.nodeName.toLowerCase() === 'head') {
//                         readyCallback();
//                         observer.disconnect();
//                     }
//                 }
//             }
//         }
//     };

//     // Create an observer instance linked to the callback function
//     const observer = new MutationObserver(mutationCallback);

//     // Start observing the target node for configured mutations
//     observer.observe(targetNode, config);
// }

// waitForDocumentHead(onDocumentHeadReady);
onDocumentHeadReady();