import Constants from './constants';
import Messaging from './messaging';
import Logger from './logger';

const LOG_TAG = 'Snapshot';

export default class Snapshot {
	/**
     * Captures a DevTools snapshot
	 * @param {String} tabId The browser tab ID to capture.
     * @param {Object} options The options select to take the screenshot:
     *  @param {Boolean} [options.screenshot] A boolean flag indicating if screenshot dump is active.
     *  @param {Boolean} [options.network] A boolean flag indicating if network dump is active.
     *  @param {Boolean} [options.console] A boolean flag indicating if console dump is active.
     *  @param {Boolean} [options.storage] A boolean flag indicating if storage dump is active.
     */
	static async capture(tabId, options) {
		let screenshotDataUrl;
		if (options.screenshot) {
			// Request screenshot from background script
			screenshotDataUrl = await Messaging.sendMessage(Constants.Messages.SCREENSHOT);
		}

		let consoleLogEntries;
		if (options.console) {
			// Capture console logs
			consoleLogEntries = await Messaging.sendContentScriptMessage(tabId, Constants.Messages.CONSOLE_ENTRIES);
		}

		let networkHARLog;
		if (options.network) {
			networkHARLog = await Snapshot.captureNetworkHARLogs();
		}

		let storageData;
		if (options.storage) {
			storageData = await Messaging.sendContentScriptMessage(tabId, Constants.Messages.STORAGE_DATA);
		}

		if (screenshotDataUrl || consoleLogEntries || networkHARLog || storageData) {
			// Request save-file operation from background script
			await Messaging.sendMessage(Constants.Messages.SAVE_FILES, { screenshotDataUrl, consoleLogEntries, networkHARLog, storageData });
		}
	}

	/**
     * Captures a page screenshot.
     * Note: in Firefox, can only be executed via background script.
     * @param {String} [tabId] The tab to capture (current tab if undefined or null).
     * @returns {String} The string with the image data URL.
     */
	static async captureScreenshot(tabId) {
		Logger.log(LOG_TAG, 'Capturing screenshot...');

		const options = { format: 'png' };
		const captureTabId = tabId || null;

		try {
			const dataUrl = await browser.tabs.captureVisibleTab(captureTabId, options);

			Logger.log(LOG_TAG, 'Successfully captured screenshot.', { dataUrl });
			return dataUrl;
		} catch (error) {
			Logger.error(LOG_TAG, 'Error occurred on screenshot.', error);
			throw error;
		}
	}

	static async captureNetworkHARLogs() {
		return new Promise((resolve, reject) => {
			try {
				browser.devtools.network.getHAR((harLogs) => {
					Logger.log(LOG_TAG, 'Captured network logs.', harLogs);
					resolve(harLogs);
				});
			} catch (ex) {
				Logger.error(LOG_TAG, 'Error occurred when capturing network HAR.', ex);
				reject(ex);
			}
		});
	}
}
