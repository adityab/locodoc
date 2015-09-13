var cluster = require('cluster'),
    config = require('./config.json');
    os = require('os');

if (cluster.isMaster) {
    var cpuCount = os.cpus().length;

    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.id + ' is online.');
    });
    cluster.on('exit', function (worker) {
        console.log('Worker ' + worker.id + ' died.');
        cluster.fork();
    });
} else {
    var express = require('express'),
        multer = require('multer'),
        unoconv = require('./unoconv'),
        freeport = require('freeport'),
        mime = require('mime'),
        fs = require('fs'),
        app = express(),
        upload = multer({
            dest: config.tmpdir || os.tmpdir(),
            limits: {
                files: 1
            }
        }).single('document');

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', config.allowedOrigin);
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');

        next();
    };
    app.use(allowCrossDomain);

    freeport(function (err, port) {
        if (err) { return process.exit(); }

        unoconv.listen({ port: port })
        .stderr.on('data', function (data) {
            console.log(data.toString('utf8'));
        });

        app.post('/convert/:format', upload, function (req, res, next) {
            var path = req.file.path,
                format = req.params.format;

            unoconv.convert(path, format, { port: port }, function (err, result) {
                if (err) { console.log(err); res.send(500, err); return process.exit(); }

                res.header('Content-Type', mime.lookup(format));
                fs.createReadStream(result).pipe(res);
            });
        });
        app.listen(config.port);
    });
}
