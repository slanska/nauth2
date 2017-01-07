/**
 * Created by slanska on 2017-01-07.
 */

///<reference path="testing.d.ts"/>

import ZombieBrowser    = require('zombie');

export type QuerySelector = string | Node;

/*
 Extends zombie test browser with synchronous methods (using Syncho)
 Declares typings for zombie.js
 */
export class ZombieBrowserExt extends ZombieBrowser
{

    visitSync(url: string, options?: ZombieBrowser.BrowserOptions)
    {
        return this.visit.sync(this, url, options);
    }

    pressButtonSync(selector: QuerySelector)
    {
        return this.pressButton.sync(this, selector);
    }

    clickLinkSync(selector: ZombieBrowser.Selector)
    {
        return this.clickLink.sync(this, selector);
    }

    fireSync(name: string, target: Element | string)
    {
        return this.fire.sync(this, name, target);
    }

    waitSync(terminator?: Function | number)
    {
        return this.wait.sync(this, terminator);
    }
}



