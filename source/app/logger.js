class Logger {
	/**
	 * Creates a new Logger instance.
	 */
	constructor() {
		this._enabled = true;
	}

	/**
	 * @param {Boolean} enabled Enables or disables logging.
	 */
	set enabled(enabled) {
		this._enabled = enabled;
	}

	/**
	 * Logs a message to console.
	 * @param {String} tag The logging tag.
	 * @param {String} message The logging message.
	 * @param {any} [args] The arguments to log at the end of the message.
	 */
	log(tag, message, args) {
		if (this._enabled) {
			console.log.apply(null, buildLoggingParams(tag, message, args));
		}
	}

	/**
	 * Logs an info message to console.
	 * @param {String} tag The logging tag.
	 * @param {String} message The logging message.
	 * @param {any} [args] The arguments to log at the end of the message.
	 */
	info(tag, message, args) {
		if (this._enabled) {
			console.info.apply(null, buildLoggingParams(tag, message, args));
		}
	}

	/**
	 * Logs an error message to console.
	 * @param {String} tag The logging tag.
	 * @param {String} message The logging message.
	 * @param {any} [args] The arguments to log at the end of the message.
	 */
	error(tag, message, args) {
		if (this._enabled) {
			console.error.apply(null, buildLoggingParams(tag, message, args));
		}
	}

	/**
	 * Logs a debug message to console.
	 * @param {String} tag The logging tag.
	 * @param {String} message The logging message.
	 * @param {any} [args] The arguments to log at the end of the message.
	 */
	debug(tag, message, args) {
		if (this._enabled) {
			console.debug.apply(null, buildLoggingParams(tag, message, args));
		}
	}

	/**
	 * Logs a warning message to console.
	 * @param {String} tag The logging tag.
	 * @param {String} message The logging message.
	 * @param {any} [args] The arguments to log at the end of the message.
	 */
	warn(tag, message, args) {
		if (this._enabled) {
			console.warn.apply(null, buildLoggingParams(tag, message, args));
		}
	}
}

function buildLoggingParams(tag, message, args) {
	const loggingParams = [];

	// Message with log tag
	const logMessage = `${formatLogTag(tag, 20)}| ${message}`;
	loggingParams.push(logMessage);

	// Optional log arguments
	if (args) {
		loggingParams.push(args);
	}

	return loggingParams;
}

function formatLogTag(value, size) {
	if (value.length < size) {
		return value + ' '.repeat(size - value.length);
	}

	return value.slice(0, size);
}

export default new Logger();
