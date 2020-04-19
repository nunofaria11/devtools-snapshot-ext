const LOG_TAG = "FileUtils |";

export default class FileUtils {

    /**
     * Creates a Blob instance from a data URL string.
     * @param {String} dataUrl 
     * @returns {Blob}
     */
    static toBlob(dataUrl) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataUrl.split(',')[1]);

        // separate out the mime component
        const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        const ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        return new Blob([ab], { type: mimeString });
    }

    static async downloadFile(file, name) {

        console.log(`${LOG_TAG} Downloading file...`, {file, name});

        const url = URL.createObjectURL(file);

        const options = {
            url: url,
            saveAs: true,
            filename: name
        };

        try {
            
            const result = await browser.downloads.download(options);
            console.log(`${LOG_TAG} File downloaded successfully.`, result);

            return true;
        } catch (err) {
            console.error(`${LOG_TAG} Error on file download.`, err);
            throw err;
        } finally {
            URL.revokeObjectURL(url);
        }

    }

    static async saveFile(blob, name) {

        // Saving a file calls the download logic, since there is no better alternative
        return FileUtils.downloadFile(blob, name);
    }

    static zip(name, files) {
        throw "todo";
    }

}