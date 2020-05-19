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
			screenshotDataUrl = await Messaging.sendMessage(Constants.Messages.SCREENSHOT, tabId);
		}

		let consoleLogEntries;
		if (options.console) {
			// Capture console logs
			consoleLogEntries = await Messaging.sendMessage(Constants.Messages.CONSOLE_ENTRIES, tabId);
		}

		let networkHARLog;
		if (options.network) {
			networkHARLog = await Snapshot.captureNetworkHARLogs();
		}

		let storageData;
		if (options.storage) {
			storageData = await Messaging.sendMessage(Constants.Messages.STORAGE_DATA, tabId);
		}

		if (screenshotDataUrl || consoleLogEntries || networkHARLog || storageData) {
			// Request save-file operation from background script
			await Messaging.sendMessage(Constants.Messages.SAVE_FILES, {screenshotDataUrl, consoleLogEntries, networkHARLog, storageData});
		}
	}

	static async captureNetworkHARLogs() {
		return new Promise((resolve, reject) => {
			try {
				browser.devtools.network.getHAR(harLogs => {
					Logger.log(LOG_TAG, 'Captured network logs.', harLogs);
					resolve(harLogs);
				});
			} catch (error) {
				Logger.error(LOG_TAG, 'Error occurred when capturing network HAR.', error);
				reject(error);
			}
		});
	}
}
