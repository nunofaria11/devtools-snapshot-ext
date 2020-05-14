import Logger from './logger';

const LOG_TAG = 'Messaging';

class Messaging {
	/**
	 * Creates a Messaging instance with handlers mapped by message name.
	 */
	constructor() {
		this.handlers = {};
		this.listening = false;
		this.loggingEnabled = true;
	}

	/**
	 * Sends a browser "runtime" message with an object of the following format:
	 * { name, data }
	 * @param {String} name The message name (declared constant)
	 * @param {String} [data] An optional data object
	 * @returns {Promise} A promise resolved with the response of the message handler.
	 */
	sendMessage(name, data) {
		const message = {name, data};
		Logger.log(LOG_TAG, 'Sending message:', message);
		return browser.runtime.sendMessage(null, message, null);
	}

	/**
	 * Sends a browser "runtime" message with an object of the following format:
	 * { name, data }
	 * @param {Number} tabId The tab identifier to send message to.
	 * @param {String} name The message name (declared constant)
	 * @param {String} [data] An optional data object
	 * @returns {Promise} A promise resolved with the response of the message handler.
	 */
	sendContentScriptMessage(tabId, name, data) {
		const message = {name, data};
		Logger.log(LOG_TAG, 'Sending content-script message:', message);
		return browser.tabs.sendMessage(tabId, message, null);
	}

	/**
	 * Registers a message handler.
	 * @param {String} name A message name
	 * @param {Function} handler A function to handle the message (argument is the message-data).
	 */
	registerMessageHandler(name, handler) {
		Logger.log(LOG_TAG, 'Registering message listener', name);
		const handlers = this.handlers[name] || [];
		handlers.push(handler);
		this.handlers[name] = handlers;

		if (!this.listening) {
			this._initListeners();
		}
	}

	/**
	 * Private method to initialize listeners
	 */
	_initListeners() {
		browser.runtime.onMessage.addListener(this._handleMessage.bind(this));
		this.listening = true;
	}

	async _handleMessage(message) {
		Logger.log(LOG_TAG, 'On message:', message);

		const {name, data} = message;
		const handlers = this.handlers[name];
		if (handlers) {
			const promises = [];
			for (const handler of handlers) {
				promises.push(handler(data));
			}

			const results = await Promise.all(promises);
			return (results.length === 1 ? results[0] : results);
		}

		Logger.log(LOG_TAG, 'Unknown message:', message);
	}
}

export default new Messaging();
