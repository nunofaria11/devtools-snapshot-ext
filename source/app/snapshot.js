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
		if (options.screenshot) {
			// Request screenshot from background script
			const screenshotDataUrl = await Messaging.sendMessage(Constants.Messages.SCREENSHOT);

			// Request save-file operation from background script
			await Messaging.sendMessage(Constants.Messages.SAVE_FILES, {screenshotDataUrl});
		}
	}

	/**
     * Captures a page screenshot.
     * Note: in Firefox, can only be executed via background script.
     * @param {String} [tabId] The tab to capture (current tab if undefined or null).
     * @returns {String} The string with the image data URL.
     */
	static async captureScreenshot(tabId) {
		console.log(`${LOG_TAG} Capturing screenshot...`);

		const options = {format: 'png'};
		const captureTabId = tabId || null;

		try {
			const dataUrl = await browser.tabs.captureVisibleTab(captureTabId, options);

			console.log(`${LOG_TAG} Successfully captured screenshot.`, {dataUrl});
			return dataUrl;
		} catch (error) {
			console.error(`${LOG_TAG} Error occurred on screenshot.`, error);
			throw error;
		}
	}
}
