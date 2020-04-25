import Constants from './app/constants';
import Snapshot from './app/snapshot';
import FileUtils from './app/file-utils';
import Messaging from './app/messaging';

const LOG_TAG = 'Background |';

async function handleScreenshotRequest() {
	console.log(`${LOG_TAG} Handling screenshot request...`);
	return Snapshot.captureScreenshot();
}

async function handleSaveDataUrl(fileData) {
	console.log(`${LOG_TAG} Handling save file request...`, fileData);
	const {dataUrl, filename} = fileData;
	const file = FileUtils.toBlob(dataUrl);
	return FileUtils.saveFile(file, filename);
}

Messaging.registerMessageHandler(Constants.Messages.SCREENSHOT, handleScreenshotRequest);
Messaging.registerMessageHandler(Constants.Messages.SAVE_DATA_URL, handleSaveDataUrl);
