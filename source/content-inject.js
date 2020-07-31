
import consoleHook from 'console-hook';
import Logger from './app/logger';
import PageMessaging from './app/page-messaging';
import Constants from './app/constants';
import JsonDecycle from 'json-decycle';

Logger.enabled = false;

const snapshotConsoleModel = {
	logEntries: []
};
const attachedConsoleHook = consoleHook().attach((method, consoleArgs) => {
	let args;
	if (consoleArgs) {
		args = [];
		for (const a of consoleArgs) {
			args.push(a);
		}

		args = JSON.parse(JSON.stringify(args, JsonDecycle.decycle()));
	}

	const logEntry = {method, args, timestamp: Date.now()};
	snapshotConsoleModel.logEntries.push(logEntry);
});

PageMessaging.registerMessageHandler(Constants.PageMessages.CONSOLE_ENTRIES, () => {
	return snapshotConsoleModel.logEntries;
});

PageMessaging.registerMessageHandler(Constants.PageMessages.STORAGE_DATA, () => {
	return {
		localStorage: JSON.stringify(localStorage),
		sessionStorage: JSON.stringify(sessionStorage),
		cookie: document.cookie
	};
});

window.addEventListener('beforeunload', () => {
	attachedConsoleHook.detach();
});
