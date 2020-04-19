import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
    defaults: {
        screenshot: true
    },
    migrations: [
        OptionsSync.migrations.removeUnused
    ],
    logging: true
});
