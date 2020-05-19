# DevTools Snapshot Extension

![Test](https://github.com/nunofaria11/devtools-snapshot-ext/workflows/Test/badge.svg)

A browser extension to save the current state of the DevTools panel.

## Behavior
Saves a zip file (eg., `snapshot-0123456789.zip`) with the following files:
- page screenshot (`screenshot-0123456789.png`)
- console logs (`console-0123456789.txt`)
- network requests/responses (`network-0123456789.har`)
- `localStorage`, `sessionStorage` and `document.cookie` (`storage-0123456789.json`)

## Dependencies
- console-hook
- jszip
- webext-options-sync
- webextension-polyfill

Icons made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com/).
