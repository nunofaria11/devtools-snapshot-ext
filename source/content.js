/*
 * Adapted from:
 * https://stackoverflow.com/questions/9515704/insert-code-into-the-page-context-using-a-content-script
 */
function scriptFromFile(file) {
    const script = document.createElement("script");
    script.src = browser.extension.getURL(file);
    return script;
}

function inject(parentNode, scripts) {
    if (scripts.length === 0) {
        return;
    }
    const otherScripts = scripts.slice(1);
    const script = scripts[0];
    const onload = function () {
        script.parentNode.removeChild(script);
        inject(parentNode, otherScripts);
    };
    if (script.src !== "") {
        script.onload = onload;
        parentNode.appendChild(script);
    } else {
        parentNode.appendChild(script);
        onload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const documentHead = document.querySelector('head');
    const scriptFiles = [
        'content_inject.js'
    ];
    const scripts = scriptFiles.map(scriptFromFile);
    inject(documentHead, scripts);
});