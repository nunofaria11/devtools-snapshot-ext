import FileUtils from './file-utils';
import Constants from './constants';
import Messaging from './messaging';

const LOG_TAG = 'Snapshot |';

export default class Snapshot {
	/**
     * Captures a DevTools snapshot
     * @param {Object} options The options select to take the screenshot:
     *  @param {Boolean} [options.screenshot] A boolean flag indicating if screenshot dump is active.
     *  @param {Boolean} [options.network] A boolean flag indicating if network dump is active.
     *  @param {Boolean} [options.console] A boolean flag indicating if console dump is active.
     *  @param {Boolean} [options.storage] A boolean flag indicating if storage dump is active.
     */
	static async capture(options) {
		let screenshot;

		if (options.screenshot) {
			// Request screenshot from background script
			screenshot = await Messaging.sendMessage(Constants.Messages.SCREENSHOT);

			FileUtils.saveFile(screenshot, `snapshot-${Date.now()}.png`);
			// Await Messaging.sendMessage(Constants.Messages.SAVE_FILE, {
			//     file: screenshot,
			//     filename: `snapshot-${Date.now()}.png`
			// });
		}
	}

	/**
     * Captures a page screenshot.
     * Note: in Firefox, can only be executed via background script.
     * @param {String} [tabId] The tab to capture (current tab if undefined or null).
     * @returns {Blob} The Blob instance with image data.
     */
	static async captureScreenshot(tabId) {
		console.log(`${LOG_TAG} Capturing screenshot...`);

		const options = {format: 'png'};
		const captureTabId = tabId || null;

		try {
			const dataUrl = await browser.tabs.captureVisibleTab(captureTabId, options);
			const file = FileUtils.toBlob(dataUrl);

			console.log(`${LOG_TAG} Successfully captured screenshot.`, {file});
			return file;
		} catch (error) {
			console.error(`${LOG_TAG} Error occurred on screenshot.`, error);
			throw error;
		}
	}
}
