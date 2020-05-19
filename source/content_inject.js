
import Logger from './app/logger';
import consoleHook from 'console-hook';

Logger.enabled = false;

const snapshotConsoleModel = {
	logEntries: []
};
const attachedConsoleHook = consoleHook().attach((method, consoleArgs) => {
	let args;
	if (consoleArgs) {
		args = [];
		for (let a of consoleArgs) {
			args.push(a);
		}
	}
	const logEntry = { method, args, t: Date.now() };
	snapshotConsoleModel.logEntries.push(logEntry);
});


window.addEventListener('message', (evt) => {
	if (evt.source !== window || !evt.data) {
		return;
	}
	const request = evt.data;
	if (request.name !== 'req:devtools-snapshot_log-entries') {
		return;
	}

	const response = {
		name: 'res:devtools-snapshot_log-entries',
		logEntries: snapshotConsoleModel.logEntries
	};
	evt.source.postMessage(response);
});

window.addEventListener('beforeunload', () => {
	attachedConsoleHook.detach()
});