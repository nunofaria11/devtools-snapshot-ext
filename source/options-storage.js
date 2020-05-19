import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		screenshot: true,
		console: true,
		network: true,
		storage: true
	},
	migrations: [
		OptionsSync.migrations.removeUnused
	],
	logging: true
});
