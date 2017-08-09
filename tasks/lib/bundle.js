"use strict";

/* eslint no-console: "off" */
const fs = require("fs");
const rollup = require("rollup");
const CONSTANTS = require("../../package.json").constants;

/**
 * Bundles project with given formats
 * @param {Array} formats
 * @param {Array} plugins
 */
module.exports = function (formats, plugins) {
    const promises = [];

    rollup
        .rollup({
            plugins,
            entry: `${CONSTANTS.dirBase.input}/${CONSTANTS.js.input}.js`,
        })
        .catch(err => {
            console.log(err);
        })
        .then(bundle => {
            formats.forEach(format => {
                const bundleFormat = new Promise((resolve, reject) => {
                    bundle
                        .generate({
                            moduleName: CONSTANTS.js.namespace.module,
                            format: format.id
                        })
                        .catch(err => {
                            reject(err);
                        })
                        .then(result => {
                            fs.writeFile(
                                `${CONSTANTS.dirBase.output}/${CONSTANTS.js.namespace.file}${format.ext}.js`,
                                format.fn(result.code),
                                err => {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                }
                            );
                        });
                });

                promises.push(bundleFormat);
            });

            Promise
                .all(promises)
                .catch(err => {
                    console.log("One or more errors were encountered during bundling", err);
                })
                .then(() => {
                    console.log("Bundling complete");
                });
        });
};