const LOG_TAG = 'Messaging |';

class Messaging {
	/**
	 * Creates a Messaging instance with handlers mapped by message name.
	 */
	constructor() {
		this.handlers = {};
		this.listening = false;
		console.log(`${LOG_TAG} Initialized.`);
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
		console.log(`${LOG_TAG} Sending message:`, message);
		return browser.runtime.sendMessage(null, message, null);
	}

	/**
	 * Registers a message handler.
	 * @param {String} name A message name
	 * @param {Function} handler A function to handle the message (argument is the message-data).
	 */
	registerMessageHandler(name, handler) {
		console.log(`${LOG_TAG} Registering message listener: ${name}`);
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
		console.log(`${LOG_TAG} On message:`, message);

		const {name, data} = message;
		const handlers = this.handlers[name];
		if (handlers) {
			const results = [];
			for (const handler of handlers) {
				const result = await handler(data);
				results.push(result);
			}

			return (results.length === 1 ? results[0] : results);
		}

		console.log(`${LOG_TAG} Unknown message.`, name);
	}
}

export default new Messaging();