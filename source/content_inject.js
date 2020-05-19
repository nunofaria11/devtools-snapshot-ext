
import Logger from './app/logger';
import PageMessaging from './app/page-messaging';
import Constants from './app/constants';
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
		args = JSON.parse(JSON.stringify(args));
	}
	const logEntry = { method, args, timestamp: Date.now() };
	snapshotConsoleModel.logEntries.push(logEntry);
});

PageMessaging.registerMessageHandler(Constants.PageMessages.CONSOLE_ENTRIES, () => {
	return snapshotConsoleModel.logEntries;
});

window.addEventListener('beforeunload', () => {
	attachedConsoleHook.detach()
});