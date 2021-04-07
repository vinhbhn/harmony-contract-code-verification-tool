"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
const { execSync } = require("child_process");
exports.clone = async (githubUrl, directory) => {
    if (githubUrl.substr(githubUrl.length - 4) !== '.sol') {
        throw new Error('Link should point to specific sol contract');
    }
    if (githubUrl.indexOf('/blob') === -1) {
        throw new Error('Use blob github link');
    }
    if (githubUrl.substr(0, 18) !== "https://github.com") {
        throw new Error('Only contracts hosted on github are allowed');
    }
    const actualUrl = githubUrl.split('/blob')[0];
    execSync(`git clone ${actualUrl} ${directory}`);
};
//# sourceMappingURL=github.js.map