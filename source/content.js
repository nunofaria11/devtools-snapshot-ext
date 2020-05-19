import Logger from './app/logger';
import Constants from './app/constants';
import Messaging from './app/messaging';
import PageMessaging from './app/page-messaging';

Logger.enabled = false;

Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);
Messaging.registerMessageHandler(Constants.Messages.STORAGE_DATA, handleStorageDataRequest);

async function handleConsoleEntriesRequest() {
	// Request the page context for logEntries
	const logEntries = await PageMessaging.postMessage(Constants.PageMessages.CONSOLE_ENTRIES);

	return Promise.resolve(logEntries);
}

async function handleStorageDataRequest() {
	// Request the page context for storage data
	const storageData = await PageMessaging.postMessage(Constants.PageMessages.STORAGE_DATA);

	return Promise.resolve(storageData);
}

/*
* Adapted from:
* https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
*/
function scriptFromFile(file) {
	const script = document.createElement('script');
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

	if (script.src) {
		script.addEventListener('load', onload);
		parentNode.append(script);
	} else {
		parentNode.append(script);
		onload();
	}
}

function onDocumentHeadReady() {
	const scriptFiles = [
		'contentInject.js'
	];
	const scripts = scriptFiles.map(scriptFromFile);
	inject(document.head || document.documentElement, scripts);
}

onDocumentHeadReady();
