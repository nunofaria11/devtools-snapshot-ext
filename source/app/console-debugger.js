import Logger from './logger';

const LOG_TAG = 'ConsoleDebugger';

export default class ConsoleDebugger {
	/**
	 * Instantiates a new console debugger
	 * @param {String} tabId The tab ID to capture logs.
	 */
	constructor(tabId) {
		this._tabId = tabId;
		this._logEntries = [];
		this._referenceTimestamp = null;
		this._inactivityTimeout = null;
	}

	async getLogEntries() {
		Logger.log(LOG_TAG, 'Starting console debugger...');

		this._logEntries = [];
		this._referenceTimestamp = Date.now();

		const debugTargets = await this._getDebugTargets();
		Logger.log(LOG_TAG, 'Debug targets.', debugTargets);

		const targetInfo = debugTargets.find(target => target.tabId === this._tabId);
		const {tabId, extensionId, targetId} = targetInfo;

		const debuggee = {tabId, extensionId, targetId};
		Logger.log(LOG_TAG, 'Debuggee:', debuggee);

		await browser.debugger.attach(debuggee, '1.2');
		browser.debugger.sendCommand(debuggee, 'Log.enable');

		const logEntries = await this._startCollecting();

		// Browser.debugger.sendCommand(debuggee, 'Log.disable');
		browser.debugger.detach(debuggee);

		return logEntries;
	}

	async _getDebugTargets() {
		return new Promise((resolve, reject) => {
			try {
				browser.debugger.getTargets(targetInfos => resolve(targetInfos));
			} catch (error) {
				Logger.error(LOG_TAG, 'Error getting debug targets.', error);
				reject(error);
			}
		});
	}

	async _startCollecting() {
		return new Promise((resolve, reject) => {
			const deferred = {resolve, reject};
			browser.debugger.onEvent.addListener(this._handleEntryAdded.bind(this, deferred));
		});
	}

	_handleEntryAdded(deferred, debuggee, method, params) {
		Logger.log(LOG_TAG, 'Handling entry added', {debuggee, method, params});

		if (browser.runtime.lastError) {
			Logger.log(LOG_TAG, 'Runtime error', browser.runtime.lastError);
			return;
		}

		if (debuggee.tabId === this._tabId && method === 'Log.entryAdded') {
			const {entry} = params;

			if (entry.timestamp <= this._referenceTimestamp) {
				this._logEntries.push(entry);
				this._setInactivityTimeout(deferred);
			} else {
				this._clearInactivityTimeout();
				deferred.resolve(this._logEntries);
			}
		}
	}

	_setInactivityTimeout(deferred) {
		this._clearInactivityTimeout();
		this._inactivityTimeout = setTimeout(deferred.resolve, 1000);
	}

	_clearInactivityTimeout() {
		if (this._inactivityTimeout) {
			this._inactivityTimeout = null;
			clearTimeout(this._inactivityTimeout);
		}
	}
}
