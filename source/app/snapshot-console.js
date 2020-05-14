
const OVERRIDE_CONSOLE_FUNCTION = [
	'assert',
	'count',
	'countReset',
	'debug',
	'dir',
	'dirxml',
	'error',
	'group',
	'groupCollapsed',
	'groupEnd',
	'info',
	'log',
	'profile',
	'profileEnd',
	'table',
	'time',
	'timeEnd',
	'timeLog',
	'timeStamp',
	'trace',
	'warn'
];

export default class SnapshotConsole {
	constructor(windowConsole) {
		this._entries = [];
		this._originalFunctions = {};

		this._originalFunctions.clear = windowConsole.clear;
		windowConsole.clear = this._clear.bind(this);

		let fnName;
		for (fnName of OVERRIDE_CONSOLE_FUNCTION) {
			this._originalFunctions[fnName] = windowConsole[fnName];
			windowConsole[fnName] = this._callConsoleFn.bind(this, fnName);
		}
	}

	get entries() {
		return this._entries;
	}

	_clear() {
		this._entries = [];
	}

	_callConsoleFn(...consoleArgs) {
		const fnName = consoleArgs[0];
		const consoleFn = this._originalFunctions[fnName];
		if (consoleFn) {
			const timestamp = Date.now();
			const args = [];
			for (let i = 1; i < consoleArgs.length; i++) {
				args.push(consoleArgs[i]);
			}

			this._entries.push({type: fnName, timestamp, args});
			consoleFn(...args);
		}
	}
}
