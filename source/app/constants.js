const Constants = {

	/**
     * Message names to exchange in extension run-time context (background, devtools and content-scripts)
     */
	Messages: {

		// Message to request screenshot
		SCREENSHOT: 'm_screenshot',

		// Message to request a save-file;
		// { screenshotDataUrl }
		SAVE_FILES: 'm_savefiles',

		// Message to request console entries
		CONSOLE_ENTRIES: 'm_consoleentries',

		// Message to request page storage data
		STORAGE_DATA: 'm_storagedata'
	},

	/**
	 * Message names to exchange between content-script and page context.
	 */
	PageMessages: {

		// Message to request console entries from page-context
		CONSOLE_ENTRIES: 'pm_consoleentries',

		// Message to request page storage data from page-context
		STORAGE_DATA: 'pm_storagedata'
	}
};

export default Constants;
