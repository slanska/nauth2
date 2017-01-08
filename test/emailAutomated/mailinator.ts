/**
 * Created by slanska on 2017-01-07.
 */

///<reference path="../testing.d.ts"/>

import _ = require('lodash');
import ZombieBrowser = require('zombie');
import Promise = require( 'bluebird');
ZombieBrowser.waitDuration = '60s';

/*
 Helper class to deal with mailinator.com via zombie browser.
 Used for processing emails in API tests
 */
export class MailinatorHelper
{
    browser: ZombieBrowser;

    /*

     */
    constructor()
    {
        this.browser = new ZombieBrowser({
            debug: true,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
        });
    }

    processConfirmEmail(email: string)
    {
        let self = this;
        return new Promise(
            (resolve, reject) =>
            {
                this.browser.visit('https://www.mailinator.com')
                    .then(() => self.browser.wait())
                    .then(() =>
                    {
                        if (!self.browser.document || self.browser.document.readyState !== 'complete')
                            return reject(new Error('Loading Error'));

                        return resolve(self.browser);
                    })
                    .catch(err =>
                    {
                        if (err.message.indexOf('Server returned status code 404 from https://player.vimeo.com') !== 0)
                            return reject(err);

                        return resolve(self.browser);
                    });
            })
            .then(() => self.navigateToInbox(email))
            .then(() => self.navigateToEmail('Confirm your email'))
            .then(() => self.clickActionButton('Confirm Email Address'));
    }

    /*

     */
    navigateToInbox(email: string)
    {
        this.browser.fill('#inboxfield', email);
        return this.browser.pressButton('Go!');
    }

    /*

     */
    navigateToEmail(value: string, partialMatch = true)
    {
        let self = this;
        // Retrieve all inbox items
        let nodes = this.browser.querySelectorAll('div[onclick^=showTheMessage] div.innermail');

        // Since CSS selectors cannot be used to filter node value, we need to iterate over found list
        let nn = _.find(nodes, (nn) =>
        {
            if (_.isEmpty(nn.textContent))
                return false;

            if (partialMatch)
                return nn.textContent.indexOf(value) >= 0;

            return nn.textContent === value;
        }) as Node;

        // Not found? Error!
        if (!nn)
            throw new Error(`Node with value ${value} not found`);

        return this.browser
            .clickLink(nn.parentElement.parentElement)
            .then(() => self.browser.wait());
    }

    clickActionButton(buttonText: string)
    {
        let btn = this.browser.querySelector('a.btn-primary[itemprop=url][rel=nofollow]');
        if (btn && btn.textContent.indexOf(buttonText) >= 0)
            return this.browser.pressButton(btn);

        throw new Error(`Action button "${buttonText}" not found`);
    }
}
