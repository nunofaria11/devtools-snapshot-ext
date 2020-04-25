import Constants from './app/constants';
import Snapshot from './app/snapshot';
import FileUtils from './app/file-utils';
import Messaging from './app/messaging';

const LOG_TAG = 'Background |';

async function handleScreenshotRequest() {
	console.log(`${LOG_TAG} Handling screenshot request...`);
	return Snapshot.captureScreenshot();
}

async function handleSaveFiles(fileData) {
	console.log(`${LOG_TAG} Handling save files request...`, fileData);

	const timestamp = Date.now();
	const files = [];
	const {screenshotDataUrl} = fileData;

	if (screenshotDataUrl) {
		const screenshotBlob = FileUtils.toBlob(screenshotDataUrl);
		const screenshotFile = new File([screenshotBlob], `screenshot-${timestamp}.png`);
		files.push(screenshotFile);
	}

	const zipFile = await FileUtils.zip(files);

	return FileUtils.saveFile(zipFile, `snapshot-${timestamp}.zip`);
}

Messaging.registerMessageHandler(Constants.Messages.SCREENSHOT, handleScreenshotRequest);
Messaging.registerMessageHandler(Constants.Messages.SAVE_FILES, handleSaveFiles);
