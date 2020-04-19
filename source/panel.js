import optionsStorage from './options-storage';

const LOG_TAG = "PanelController |";

class SnapshotPanel {

    constructor() {

        // Store form options
        optionsStorage.syncForm('#snapshotForm');

        // HTML elements
        this.screenshotEl = document.querySelector("#screenshot");
        this.saveButtonEl = document.querySelector("#saveButton");

        this.saveButtonEl.addEventListener("click", this.onSave.bind(this));

        console.log(`${LOG_TAG} Initialized.`);
    }

    onSave(evt) {
        console.log(`${LOG_TAG} Saving snapshot...`, evt);

        const screenshot = this.screenshotEl.checked;

        SnapshotPanel.snapshot({screenshot});

        evt.preventDefault();
    }

    /**
     * 
     * @param {Object} options The options select to take the screenshot:
     *  @param {Boolean} [options.screenshot]
     */
    static async snapshot(options) {
        
        let screenshot;

        if (options.screenshot) {
            screenshot = await SnapshotPanel.captureScreenshot();
        }

    }


    static async captureScreenshot() {
        console.log(`${LOG_TAG} Capturing screenshot...`);

        // Save as PNG
        const options = { format: "png" };

        try {

            const dataUrl = await browser.tabs.captureVisibleTab(null, options);
            console.log(`${LOG_TAG} Successfully captured screenshot.`, dataUrl);
            return dataUrl;

        } catch (err) {

            console.error(`${LOG_TAG} Error occurred on screenshot.`, err);
            throw err;
        }

    }
}

export default new SnapshotPanel();