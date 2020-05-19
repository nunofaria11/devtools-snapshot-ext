import Constants from './app/constants';
import FileUtils from './app/file-utils';
import Messaging from './app/messaging';
import Logger from './app/logger';

const LOG_TAG = 'Background';

async function handleScreenshotRequest() {
	Logger.log(LOG_TAG, 'Handling screenshot request...');

	const options = {format: 'png'};

	try {
		const dataUrl = await browser.tabs.captureVisibleTab(null, options);

		Logger.log(LOG_TAG, 'Successfully captured screenshot.', {dataUrl});
		return dataUrl;
	} catch (error) {
		Logger.error(LOG_TAG, 'Error occurred on screenshot.', error);
		throw error;
	}
}

async function handleStorageDataRequest(tabId) {
	Logger.log(LOG_TAG, 'Handling storage data request...');

	try {
		const storageData = await Messaging.sendContentScriptMessage(tabId, Constants.Messages.STORAGE_DATA);

		Logger.log(LOG_TAG, 'Successfully retrieved storage data.', {storageData});
		return storageData;
	} catch (error) {
		Logger.error(LOG_TAG, 'Error occurred on storage data.', error);
		throw error;
	}
}

async function handleConsoleEntriesRequest(tabId) {
	Logger.log(LOG_TAG, 'Handling console entries request...', tabId);

	try {
		const consoleEntries = await Messaging.sendContentScriptMessage(tabId, Constants.Messages.CONSOLE_ENTRIES);

		Logger.log(LOG_TAG, 'Successfully retrieved console entries.', {consoleEntries});
		return consoleEntries;
	} catch (error) {
		Logger.error(LOG_TAG, 'Error occurred on console entries.', error);
		throw error;
	}
}

function convertLogEntryToText(logEntry) {
	const date = new Date(logEntry.timestamp).toISOString();
	const parts = [`${date}|${logEntry.method}|`];
	if (logEntry.args) {
		for (const arg of logEntry.args) {
			if (typeof arg === 'string') {
				parts.push(arg);
			} else {
				parts.push(JSON.stringify(arg));
			}
		}
	}

	return parts.join('');
}

function convertLogEntriesToText(logEntries) {
	return logEntries.map(convertLogEntryToText).join('\r\n');
}

async function handleSaveFiles(fileData) {
	Logger.log(LOG_TAG, 'Handling save files request...', fileData);

	const timestamp = Date.now();
	const files = [];
	const {screenshotDataUrl, consoleLogEntries, networkHARLog, storageData} = fileData;

	if (screenshotDataUrl) {
		const screenshotBlob = FileUtils.toBlob(screenshotDataUrl);
		const screenshotFile = new File([screenshotBlob], `screenshot-${timestamp}.png`);
		files.push(screenshotFile);
	}

	if (consoleLogEntries) {
		const textData = convertLogEntriesToText(consoleLogEntries);
		const consoleBlob = new Blob([textData], {type: 'text/plain'});
		const consoleFile = new File([consoleBlob], `console-${timestamp}.txt`);
		files.push(consoleFile);
	}

	if (networkHARLog) {
		const textData = JSON.stringify({log: networkHARLog});
		const networkBlob = new Blob([textData], {type: 'text/plain'});
		const networkFile = new File([networkBlob], `network-${timestamp}.har`);
		files.push(networkFile);
	}

	if (storageData) {
		const textData = JSON.stringify(storageData);
		const storageBlob = new Blob([textData], {type: 'text/plain'});
		const storageFile = new File([storageBlob], `storage-${timestamp}.json`);
		files.push(storageFile);
	}

	const zipFile = await FileUtils.zip(files);

	return FileUtils.saveFile(zipFile, `snapshot-${timestamp}.zip`);
}

Messaging.registerMessageHandler(Constants.Messages.SCREENSHOT, handleScreenshotRequest);
Messaging.registerMessageHandler(Constants.Messages.STORAGE_DATA, handleStorageDataRequest);
Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);

Messaging.registerMessageHandler(Constants.Messages.SAVE_FILES, handleSaveFiles);
