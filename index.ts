/**
 * Created by slanska on 2016-10-28.
 */

/*
 Starts single REST API process based on configuration

 Node.js environment:
 PORT: 8800 (default)
 ENV: 'production' | 'test_mariadb' | 'test_sqlite3' | 'test_pg' | 'development' (default)
 CLUSTER: true | false (default)
 MODE: 'apiservice' | 'website' (default)

 process.env.ENV is used by config/base.config.ts directly
 */

import Types = require('./lib/Types');
import AppFactory = require('./appFactory');
import cluster = require('cluster');

var numCPUs = require('os').cpus().length;

var port = process.env.PORT || 8800;
var useCluster = process.env.CLUSTER || false;
var config = require(`./config`);

var app = AppFactory(config);

if (useCluster)
{
    console.log('App Launching in cluster mode on port: ' + process.env.PORT);
    console.log('Workers count: ' + numCPUs);
}

/*
 Set handlers on cluster events
 */
cluster.on('fork', function (worker)
{
    console.log("Start worker: %s online", worker.process.pid || "");
});
cluster.on('exit', function (worker, code, signal)
{
    console.log('Worker: %s died', worker.process.pid || "");
});

if (cluster.isMaster)
{
    // Fork workers.
    for (var i = 0; i < numCPUs; i++)
    {
        if (i > 0)
        {
            process.env.AUTOUPDATE = true;
        }
        cluster.fork();
    }
}
else
{
    app.listen(port, function (err, resp)
    {
        console.log(`Listening on ${port}`);
    });
}
