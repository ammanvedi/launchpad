// WaitPlugin.js
const fs = require('fs');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

export class WaitPlugin extends WebpackBeforeBuildPlugin {
    constructor(file, interval = 100, timeout = 10000) {
        super((stats, callback) => {
            const start = Date.now();

            function poll() {
                if (fs.existsSync(file)) {
                    callback();
                } else if (Date.now() - start > timeout) {
                    throw new Error("Maybe it just wasn't meant to be.");
                } else {
                    setTimeout(poll, interval);
                }
            }

            poll();
        });
    }
}
