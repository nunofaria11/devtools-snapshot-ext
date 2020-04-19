export default class Messaging {

    static sendMessage(name, data) {
        const message = {name, data};
        return browser.runtime.sendMessage(null, message, null)
    }

}