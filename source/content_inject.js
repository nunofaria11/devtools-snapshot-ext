import Constants from './app/constants';
import Messaging from './app/messaging';
import Logger from './app/logger';
import consoleHook from 'console-hook';

Logger.enabled = false;

const snapshotConsoleModel = {
	logEntries: []
};
const attachedConsoleHook = consoleHook().attach((method, args) => {
	const logEntry = {method, args, t: Date.now()};
	snapshotConsoleModel.logEntries.push(logEntry);
});

async function handleConsoleEntriesRequest() {
	return Promise.resolve(snapshotConsoleModel.logEntries);
}
Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);

window.addEventListener('beforeunload', () => attachedConsoleHook.detach());

