import Constants from './app/constants';
import Snapshot from './app/snapshot';
import FileUtils from './app/file-utils';
import Messaging from './app/messaging';
import Logger from './app/logger';

const LOG_TAG = 'Background';

async function handleScreenshotRequest() {
	Logger.log(LOG_TAG, 'Handling screenshot request...');
	return Snapshot.captureScreenshot();
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
Messaging.registerMessageHandler(Constants.Messages.SAVE_FILES, handleSaveFiles);
