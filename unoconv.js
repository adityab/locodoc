// Derived from the MIT-licensed https://github.com/gfloyd/node-unoconv

var _ = require('underscore'),
    childProcess = require('child_process'),
    unoconv;

exports = unoconv = module.exports = {};

/**
* Convert a document.
*
* @param {String} file
* @param {String} outputFormat
* @param {Object|Function} options
* @param {Function} callback
* @api public
*/
unoconv.convert = function(file, outputFormat, options, callback) {
    'use strict';

    var self = this,
        args,
        bin = 'unoconv',
        child,
        stderr = [],
        resultFile = file + '.' + outputFormat;

    if (_.isFunction(options)) {
        callback = options;
        options = null;
    }

    args = [
        '-f' + outputFormat,
        '-o' + resultFile
    ];

    if (options && options.port) {
        args.push('-p' + options.port);
    }

    args.push(file);

    if (options && options.bin) {
        bin = options.bin;
    }

    child = childProcess.spawn(bin, args);

    child.stderr.on('data', function (data) {
        stderr.push(data);
    });

    child.on('exit', function () {
        if (stderr.length) {
            return callback(new Error(Buffer.concat(stderr).toString()));
        }

        callback(null, resultFile);
    });
};

/**
* Start a listener.
*
* @param {Object} options
* @return {ChildProcess}
* @api public
*/
unoconv.listen = function (options) {
    'use strict';

    var self = this,
        args,
        bin = 'unoconv';

    args = [ '--listener' ];

    if (options && options.port) {
        args.push('-p' + options.port);
    }

    if (options && options.bin) {
        bin = options.bin;
    }

    return childProcess.spawn(bin, args);
};
