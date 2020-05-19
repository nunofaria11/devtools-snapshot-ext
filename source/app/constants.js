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
		CONSOLE_ENTRIES: 'm_consoleentries'
	},

	/**
	 * Message names to exchange between content-script and page context.
	 */
	PageMessages: {

		// Message to request console entries from page-context
		CONSOLE_ENTRIES: 'pm_consoleentries'
	}
};

export default Constants;
