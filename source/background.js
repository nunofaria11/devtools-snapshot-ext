import Constants from './app/constants';
import Snapshot from './app/snapshot';
import FileUtils from './app/file-utils';

const LOG_TAG = 'Background |';

async function handleMessage(message) {
	console.log(`${LOG_TAG} Received message.`, message);

	const messageName = message && message.name;

	switch (messageName) {
		case Constants.Messages.SCREENSHOT:
			return handleScreenshotRequest();

		case Constants.Messages.SAVE_FILE:
			return handleSaveFile(message.data);

		default:
			console.warn(`${LOG_TAG} Unknown message received.`, message);
	}
}

async function handleScreenshotRequest() {
	return Snapshot.captureScreenshot();
}

async function handleSaveFile(fileData) {
	const {file} = fileData;
	const {filename} = fileData;

	return FileUtils.saveFile(file, filename);
}

browser.runtime.onMessage.addListener(handleMessage);
