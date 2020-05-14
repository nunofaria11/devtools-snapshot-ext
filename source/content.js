import Constants from './app/constants';
import SnapshotConsole from './app/snapshot-console';
import Messaging from './app/messaging';
import Logger from './app/logger';

Logger.enabled = false;

function onDocumentReady() {
	const {console} = window;
	const snapshotConsole = new SnapshotConsole(console);

	// Override pages "console"
	// window.console = snapshotConsole;

	async function handleConsoleEntriesRequest() {
		return Promise.resolve(snapshotConsole.entries);
	}

	Messaging.registerMessageHandler(Constants.Messages.CONSOLE_ENTRIES, handleConsoleEntriesRequest);
}

if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
	onDocumentReady();
} else {
	document.addEventListener('DOMContentLoaded', onDocumentReady);
}

