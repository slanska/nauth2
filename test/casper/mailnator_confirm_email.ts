/**
 * Created by slanska on 2016-11-12.
 */

///<reference path="../../typings/casperjs/casperjs.d.ts"/>

// declare var casper;

// casper.start();


/*==============================================================================*/
/* Casper generated Sat Nov 12 2016 10:54:16 GMT-0500 (EST) */
/*==============================================================================*/

var casper = require('casper').create();
var x = require('casper').selectXPath;
casper.options = {viewportSize: {width: 1024, height: 720}};

// console.log(casper.on);
casper.on('page.error', function (msg, trace)
{
    this.echo('Error: ' + msg, 'ERROR');
    for (var i = 0; i < trace.length; i++)
    {
        var step = trace[i];
        this.echo('   ' + step.file + ' (line ' + step.line + ')', 'ERROR');
    }
});

// casper.test.begin('Resurrectio test', function (test)
// {
    casper.start('https://www.mailinator.com');

casper.waitForSelector("input#inboxfield",
    function success() {
        this.sendKeys("input#inboxfield", "dora19");
    },
    function fail() {
        test.assertExists("input#inboxfield");
    });
casper.waitForSelector(".input-group-btn .btn.btn-dark",
    function success() {
        test.assertExists(".input-group-btn .btn.btn-dark");
        this.click(".input-group-btn .btn.btn-dark");
    },
    function fail() {
        test.assertExists(".input-group-btn .btn.btn-dark");
    });

    // casper.waitForSelector(".input-group-btn .btn.btn-dark",
    //     function success()
    //     {
    //         console.log('success');
    //         // test.assertExists(".input-group-btn .btn.btn-dark");
    //         this.click(".input-group-btn .btn.btn-dark");
    //     },
    //     function fail()
    //     {
    //         console.log('fail');
    //
    //         // test.assertExists(".input-group-btn .btn.btn-dark");
    //     });
    // casper.waitForSelector(".col-lg-6.col-md-6.col-sm-6.col-xs-11.outermail .innermail.ng-binding",
    //     function success()
    //     {
    //         console.log('success 2');
    //
    //         // test.assertExists(".col-lg-6.col-md-6.col-sm-6.col-xs-11.outermail .innermail.ng-binding");
    //         this.click(".col-lg-6.col-md-6.col-sm-6.col-xs-11.outermail .innermail.ng-binding");
    //     },
    //     function fail()
    //     {
    //         console.log('fail 2');
    //
    //         // test.assertExists(".col-lg-6.col-md-6.col-sm-6.col-xs-11.outermail .innermail.ng-binding");
    //     });

    casper.run(function ()
    {
        console.log('done!!');
        casper.done();
        // test.done();
    });
// });
