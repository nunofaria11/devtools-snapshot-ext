import JSZip from 'jszip';
import Logger from './logger';

const LOG_TAG = 'FileUtils';

export default class FileUtils {
	/**
	 * Creates a Blob instance from a data URL string.
	 * @param {String} dataUrl The image in data URL base64 format.
	 * @returns {Blob} Blob instance created from the data URL argument.
	 */
	static toBlob(dataUrl) {
		// Convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
		const byteString = atob(dataUrl.split(',')[1]);

		// Separate out the mime component
		const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

		// Write the bytes of the string to an ArrayBuffer
		const ab = new ArrayBuffer(byteString.length);

		// Create a view into the buffer
		const ia = new Uint8Array(ab);

		// Set the bytes of the buffer to the correct values
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		// Write the ArrayBuffer to a blob, and you're done
		return new Blob([ab], {type: mimeString});
	}

	static async downloadFile(file, name) {
		Logger.log(LOG_TAG, 'Downloading file...', {file, name});

		const url = URL.createObjectURL(file);

		const options = {
			url,
			saveAs: false,
			filename: name
		};

		try {
			const downloadId = await browser.downloads.download(options);

			// Wait for download to finish to revoke URL
			browser.downloads.onChanged.addListener(downloadItem => {
				if (downloadId === downloadItem.id) {
					Logger.log(LOG_TAG, 'File downloaded successfully.', downloadItem);
					URL.revokeObjectURL(url);
				}
			});

			return true;
		} catch (error) {
			Logger.error(LOG_TAG, 'Error on file download.', error);
			throw error;
		}
	}

	static async saveFile(blob, name) {
		// Saving a file calls the download logic, since there is no better alternative
		return FileUtils.downloadFile(blob, name);
	}

	static zip(files) {
		Logger.log(LOG_TAG, 'Zipping files.', {files});

		const jszip = new JSZip();

		let file;
		for (file of files) {
			jszip.file(file.name, file);
		}

		return jszip.generateAsync({
			type: 'blob',
			compression: 'DEFLATE',
			compressionOptions: {
				level: 9
			}
		});
	}
}
