const EXT_TYPES = {
	REQUEST: 'devtools-snapshot-req',
	RESPONSE: 'devtools-snapshot-res'
};

class PageMessaging {
	/**
	 * Creates a Messaging instance with handlers mapped by message name.
	 */
	constructor() {
		this.handlers = {};
		this.pendingRequests = {};
		window.addEventListener('message', this._onMessageEvent.bind(this));
	}

	postMessage(name, data) {
		return new Promise((resolve, reject) => {
			const type = EXT_TYPES.REQUEST;
			const id = Math.random().toString(36).substring(7);

			const request = {name, data, type, id};
			this.pendingRequests[id] = {resolve, reject};

			window.postMessage(request, window.origin);
		});
	}

	registerMessageHandler(name, handler) {
		const handlers = this.handlers[name] || [];
		handlers.push(handler);
		this.handlers[name] = handlers;
	}

	_onMessageEvent(evt) {
		if (evt.source !== window || !evt.data) {
			return;
		}

		const response = evt.data;
		switch (response.type) {
			case EXT_TYPES.REQUEST:
				this._handleRequest(evt);
				break;

			case EXT_TYPES.RESPONSE:
				this._handleResponse(evt);
				break;

			default:
				// Unknown type
				break;
		}
	}

	_handleRequest(evt) {
		const request = evt.data || {};
		if (this.pendingRequests[request.id]) {
			return;
		}

		const handlers = this.handlers[request.name] || [];
		const results = [];
		if (handlers.length > 0) {
			for (const handler of handlers) {
				const result = handler(request.data);
				results.push(result);
			}

			const response = {
				id: request.id,
				name: request.name,
				type: EXT_TYPES.RESPONSE,
				data: (results.length === 1 ? results[0] : results)
			};
			evt.source.postMessage(response);
		}
	}

	_handleResponse(evt) {
		const response = evt.data;
		const deferred = this.pendingRequests[response.id];
		if (deferred) {
			deferred.resolve(response.data);
			delete this.pendingRequests[response.id];
		}
	}
}

export default new PageMessaging();
