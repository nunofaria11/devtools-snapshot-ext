import optionsStorage from './options-storage';
import Snapshot from './app/snapshot';

// Store form options
optionsStorage.syncForm('#snapshotForm');

// HTML elements
const screenshotEl = document.querySelector("#screenshot");
const saveButtonEl = document.querySelector("#saveButton");

saveButtonEl.addEventListener("click", (evt) => {

    // Add more options here
    const screenshot = screenshotEl.checked;
    const network = false;
    const console = false;
    const storage = false;

    Snapshot.capture({ screenshot, network, console, storage });

    evt.preventDefault();
});