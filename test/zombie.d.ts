/**
 * Created by slanska on 2017-01-07.
 */

declare module "zombie"
{
    namespace ZombieBrowser
    {
        export interface BrowserOptions
        {
            /*
             True to have Zombie report what it's doing. Defaults to false
             */
            debug?: boolean;

            /*
             Run scripts included in or loaded from the page. Defaults to true.
             */
            userAgent?: string;

            /*
             The User-Agent string to send to the server.
             */
            runScripts?: boolean;
        }

        export interface Cookies
        {
            clear();
            get(name: string);
            set(name: string, value);
            remove(name: string);
            dump();
        }

        /*
         Selector	Example	Example description	CSS
         .class	.intro	Selects all elements with class="intro"	1
         #id	#firstname	Selects the element with id="firstname"	1
         *	*	Selects all elements	2
         element	p	Selects all <p> elements	1
         element,element	div, p	Selects all <div> elements and all <p> elements	1
         element element	div p	Selects all <p> elements inside <div> elements	1
         element>element	div > p	Selects all <p> elements where the parent is a <div> element	2
         element+element	div + p	Selects all <p> elements that are placed immediately after <div> elements	2
         element1~element2	p ~ ul	Selects every <ul> element that are preceded by a <p> element	3
         [attribute]	[target]	Selects all elements with a target attribute	2
         [attribute=value]	[target=_blank]	Selects all elements with target="_blank"	2
         [attribute~=value]	[title~=flower]	Selects all elements with a title attribute containing the word "flower"	2
         [attribute|=value]	[lang|=en]	Selects all elements with a lang attribute value starting with "en"	2
         [attribute^=value]	a[href^="https"]	Selects every <a> element whose href attribute value begins with "https"	3
         [attribute$=value]	a[href$=".pdf"]	Selects every <a> element whose href attribute value ends with ".pdf"	3
         [attribute*=value]	a[href*="w3schools"]	Selects every <a> element whose href attribute value contains the substring "w3schools"	3
         :active	a:active	Selects the active link	1
         ::after	p::after	Insert something after the content of each <p> element	2
         ::before	p::before	Insert something before the content of each <p> element	2
         :checked	input:checked	Selects every checked <input> element	3
         :disabled	input:disabled	Selects every disabled <input> element	3
         :empty	p:empty	Selects every <p> element that has no children (including text nodes)	3
         :enabled	input:enabled	Selects every enabled <input> element	3
         :first-child	p:first-child	Selects every <p> element that is the first child of its parent	2
         ::first-letter	p::first-letter	Selects the first letter of every <p> element	1
         ::first-line	p::first-line	Selects the first line of every <p> element	1
         :first-of-type	p:first-of-type	Selects every <p> element that is the first <p> element of its parent	3
         :focus	input:focus	Selects the input element which has focus	2
         :hover	a:hover	Selects links on mouse over	1
         :in-range	input:in-range	Selects input elements with a value within a specified range	3
         :invalid	input:invalid	Selects all input elements with an invalid value	3
         :lang(language)	p:lang(it)	Selects every <p> element with a lang attribute equal to "it" (Italian)	2
         :last-child	p:last-child	Selects every <p> element that is the last child of its parent	3
         :last-of-type	p:last-of-type	Selects every <p> element that is the last <p> element of its parent	3
         :link	a:link	Selects all unvisited links	1
         :not(selector)	:not(p)	Selects every element that is not a <p> element	3
         :nth-child(n)	p:nth-child(2)	Selects every <p> element that is the second child of its parent	3
         :nth-last-child(n)	p:nth-last-child(2)	Selects every <p> element that is the second child of its parent, counting from the last child	3
         :nth-last-of-type(n)	p:nth-last-of-type(2)	Selects every <p> element that is the second <p> element of its parent, counting from the last child	3
         :nth-of-type(n)	p:nth-of-type(2)	Selects every <p> element that is the second <p> element of its parent	3
         :only-of-type	p:only-of-type	Selects every <p> element that is the only <p> element of its parent	3
         :only-child	p:only-child	Selects every <p> element that is the only child of its parent	3
         :optional	input:optional	Selects input elements with no "required" attribute	3
         :out-of-range	input:out-of-range	Selects input elements with a value outside a specified range	3
         :read-only	input:read-only	Selects input elements with the "readonly" attribute specified	3
         :read-write	input:read-write	Selects input elements with the "readonly" attribute NOT specified	3
         :required	input:required	Selects input elements with the "required" attribute specified	3
         :root	:root	Selects the document's root element	3
         ::selection	::selection	Selects the portion of an element that is selected by a user
         :target	#news:target	Selects the current active #news element (clicked on a URL containing that anchor name)	3
         :valid	input:valid	Selects all input elements with a valid value	3
         :visited	a:visited	Selects all visited links	1
         */
        export type Selector = string | Node;
    }

    /*
     Main class.
     API and documentation is borrowed from: http://zqdevres.qiniucdn.com/data/20110811173813/index.html

     Notes

     Callbacks

     By convention the first argument to a callback function is the error. If the first argument is null,
     no error occurred, and other arguments may have meaningful data.

     For example, the second and third arguments to the callback of visit, clickLink
     and pressButton are the browser itself and the status code.

     pressButton("Create", function(error, browser, status) {
     if (error)
     throw error;
     assert.equal(status, 201, "Expected status 201 Created")
     });
     */
    class ZombieBrowser
    {
        /*
         Creates and returns a new browser. A browser maintains state across requests: history, cookies,
         HTML 5 local and session storage. A browser has a main window, and typically a document loaded into that window.

         You can pass options when initializing a new browser, or set them on an existing browser instance. For example:

         browser = new zombie.Browser({ debug: true })
         browser.runScripts = false
         */
        constructor(options?: ZombieBrowser.BrowserOptions);

        /*
        ms value for operation waiting timeout
        Example: '60s', '1min'
         */
        static waitDuration:string;

        runScripts: boolean;
        // debug: boolean;
        debug();
        userAgent: string;

        /*
         to disable console output from scripts
         */
        silent:boolean;

        /*
         Loads document from the specified URL, processes all events in the queue, and finally invokes the callback.

         In the second form, sets the options for the duration of the request, and resets before passing control to the callback. For example:

         browser.visit("http://localhost:3000", { debug: true },
         function(err, browser, status) {
         if (err)
         throw(err.message);
         console.log("The page:", browser.html());
         }
         );
         */
        visit(url: string, callback?: Function);
        visit(url: string, options: ZombieBrowser.BrowserOptions, callback?: Function);

        /*
         Shortcut for creating new browser and calling browser.visit on it. If the second argument are options,
         initializes the browser with these options. See Navigation below for more information about the visit method.
         */
        static visit(url: string, callback?: Function);
        static visit(url: string, options: ZombieBrowser.BrowserOptions, callback?: Function);

        /*
         Opens a new browser window.
         */
        open(): Window;

        /*
         Returns the main window. A browser always has one window open.
         */
        window: Window;

        /*
         Returns the body element of the current document.
         */
        body: Element;

        /*
         Returns the main window's document. Only valid after opening a document (see browser.visit).
         */
        document: Document;

        /*
         Evaluates the CSS selector against the document (or context node) and return a node list.
         Shortcut for document.querySelectorAll.
         */
        css(selector: ZombieBrowser.Selector, context?: ZombieBrowser.Selector);

        /*
         Evaluates a JavaScript expression in the context of the current window and returns the result. For example:

         browser.evaluate("document.title");
         */
        evaluate(expr): Object;

        /*
         Returns the HTML contents of the selected elements.

         With no arguments returns the HTML contents of the document. This is one way to find out what the page looks like after executing a bunch of JavaScript.

         With one argument, the first argument is a CSS selector evaluated against the document body. With two arguments, the CSS selector is evaluated against the element given as the context.

         For example:

         console.log(browser.html("#main"));
         */
        html(selector?: ZombieBrowser.Selector, context?: ZombieBrowser.Selector): String;

        /*
         Select a single element (first match) and return it. This is a shortcut that calls querySelector on the document.
         */
        querySelector(selector: ZombieBrowser.Selector): Element;

        /*
         Select multiple elements and return a static node list. This is a shortcut that calls querySelectorAll on the document.
         */
        querySelectorAll(selector: ZombieBrowser.Selector): NodeList;

        /*
         Returns the text contents of the selected elements.

         With one argument, the first argument is a CSS selector evaluated against the document body.
         With two arguments, the CSS selector is evaluated against the element given as the context.

         For example:

         console.log(browser.text("title"));
         */
        text(selector: ZombieBrowser.Selector, context?: ZombieBrowser.Selector): String;

        /*
         Evaluates the XPath expression against the document (or context node) and return the XPath result.
         Shortcut for document.evaluate.
         */
        xpath(expression: ZombieBrowser.Selector, context?: ZombieBrowser.Selector): XPathResult;

        /*
         Zombie.js loads pages asynchronously. In addition, a page may require loading additional resources
         (such as JavaScript files) and executing various event handlers (e.g. jQuery.onready).

         For that reason, navigating to a new page doesn't land you immediately on that page: you have to
         wait for the browser to complete processing of all events. You can do that by calling browser.wait
         or passing a callback to methods like visit and clickLink.

         Clicks on a link. The first argument is the link text or CSS selector. Second argument is a callback, invoked after all events are allowed to run their course.

         Zombie.js fires a click event and has a default event handler that will to the link's href value, just like a browser would. However, event handlers may intercept the event and do other things, just like a real browser.

         For example:

         browser.clickLink("View Cart", function(err, browser, status) {
         assert.equal(browser.querySelectorAll("#cart .body"), 3);
         });
         */
        clickLink(selector: ZombieBrowser.Selector, callback?: Function);

        /*
         Finds and returns a link (A) element. You can use a CSS selector or find a link by its text contents
         (case sensitive, but ignores leading/trailing spaces).
         */
        link(selector: ZombieBrowser.Selector): Element;

        /*
         Return the location of the current document (same as window.location).

         Changes document location, loading a new document if necessary (same as setting window.location). This will also work if you just need to change the hash (Zombie.js will fire a hashchange event), for example:

         browser.location = "#bang";
         browser.wait(function(err, browser) {
         // Fired hashchange event and did something cool.
         ...
         });
         */
        location: Location;

        /*
         Current url
         */
        url: string;

        /*
         Returns the status code returned for this page request (200, 303, etc).
         */
        statusCode: number;

        /*
         Returns true if the page request followed a redirect.
         */
        redirected: boolean;

        /*
         Forms

         Methods for interacting with form controls (e.g. fill, check) take a first argument that tries
         to identify the form control using a variety of approaches. You can always select the form control
         using an appropriate CSS selector, or pass the element itself.

         Zombie.js can also identify form controls using their name (the value of the name attribute)
         or using the text of the label associated with that control. In both case, the comparison is case sensitive,
         but to work flawlessly, ignores leading/trailing whitespaces when looking at labels.

         If there are no event handlers, Zombie.js will submit the form just like a browser would, process the response
         (including any redirects) and transfer control to the callback function when done.

         If there are event handlers, they will all be run before transferring control to the callback function.
         Zombie.js can even support jQuery live event handlers.
         */

        /*
         Attaches a file to the specified input field. The second argument is the file name (you cannot attach streams).
         */
        attach(selector: ZombieBrowser.Selector, filename: string): this;

        /*
         Checks a checkbox. The argument can be the field name, label text or a CSS selector.

         Returns itself.
         */
        check(field): this;

        /*
         Selects a radio box option. The argument can be the field name, label text or a CSS selector.

         Returns itself.
         */
        choose(field): this;

        /*
         Find and return an input field (INPUT, TEXTAREA or SELECT) based on a CSS selector,
         field name (its name attribute) or the text value of a label associated with that field (case sensitive,
         but ignores leading/trailing spaces).
         */
        field(selector: string): Element;

        /*
         Fill in a field: input field or text area. The first argument can be the field name, label text or a CSS selector. The second argument is the field value.

         For example:

         browser.fill("Name", "ArmBiter").fill("Password", "Brains...")
         Returns itself.
         */
        fill(field: string, value: string): this;

        /*
         Finds a button using CSS selector, button name or button text (BUTTON or INPUT element).
         */
        button(selector: string): Element;

        /*
         Press a button. Typically this will submit the form, but may also reset the form or simulate a click, depending on the button type.

         The first argument is either the button name, text value or CSS selector. Second argument is a callback, invoked after the button is pressed, form submitted and all events allowed to run their course.

         For example:

         browser.fill("email", "zombie@underworld.dead").
         pressButton("Sign me Up", function(err) {
         // All signed up, now what?
         });
         Returns nothing.
         */
        pressButton(selector: ZombieBrowser.Selector, callback?: Function);

        /*
         Click on the element and returns a promise.

         selector - Element or CSS selector
         callback - Called with error or nothing

         If called without callback, returns a promise
         */
        click(selector: ZombieBrowser.Selector, callback?: Function);

        /*
         Selects an option. The first argument can be the field name, label text or a CSS selector. The second value is the option to select, by value or label.

         For example:

         browser.select("Currency", "brain$")
         See also selectOption.

         Returns itself.
         */
        select(field: string, value: string): this;

        /*
         Selects the option (an OPTION element) and returns itself.
         */
        selectOption(option: string): this;
        selectOption(option: Element): this;

        /*
         Unchecks a checkbox. The argument can be the field name, label text or a CSS selector.
         */
        uncheck(field: string): this;
        uncheck(field: Element): this;

        /*
         Unselects an option. The first argument can be the field name, label text or a CSS selector. The second value is the option to unselect, by value or label.

         You can use this (or unselectOption) when dealing with multiple selection.

         Returns itself.
         */
        unselect(field: string, value: string): this;
        unselect(field: Element, value: string): this;

        /*
         Unselects the option (an OPTION element) and returns itself.
         */
        unselectOption(option: string): this;

        /*
         State Management

         The browser maintains state as you navigate from one page to another.
         Zombie.js supports both cookies and HTML5 Web Storage.

         Note that Web storage is specific to a host/port combination. Cookie storage is specific to a domain,
         typically a host, ignoring the port.
         */

        /*
         Returns all the cookies for this domain/path. Path defaults to "/".

         For example:

         browser.cookies("localhost").set("session", "567");
         The Cookies object has the methods clear(), get(name), set(name, value), remove(name) and dump().

         The set method accepts a third argument which may include the options expires, maxAge and secure.
         */
        cookies(domain: string, path?: string): ZombieBrowser.Cookies;

        /*
         Return a new browser using a snapshot of this browser's state. This method clones the forked browser's cookies,
         history and storage. The two browsers are independent, actions you perform in one browser do not affect the other.

         Particularly useful for constructing a state (e.g. sign in, add items to a shopping cart)
         and using that as the base for multiple tests, and for running parallel tests in Vows.
         */
        fork(): this;

        /*
         Load history from a text string (e.g. previously created using browser.saveHistory.
         */
        loadCookies(cookies: string);

        /*
         Load local/session stroage from a text string (e.g. previously created using browser.saveStorage.
         */
        loadStorage(storage: string);

        /*
         Returns local Storage based on the document origin (hostname/port).

         For example:

         browser.localStorage("localhost:3000").setItem("session", "567");
         The Storage object has the methods key(index), getItem(name), setItem(name, value), removeItem(name),
         clear() and dump. It also has the read-only property length.
         */
        localStorage(host: string): Storage;

        /*
         Save cookies to a text string. You can use this to load them back later on using browser.loadCookies.
         */
        saveCookies(): string;

        /*
         Save history to a text string. You can use this to load the data later on using browser.loadHistory.
         */
        saveHistory(): string;

        /*
         Save local/session storage to a text string. You can use this to load the data later on
         using browser.loadStorage.
         */
        saveStorage(): string;

        /*
         Returns session Storage based on the document origin (hostname/port). See localStorage above.
         */
        sessionStorage(host: string): Storage;

        /*
         Interaction
         */

        /*
         Called by window.alert with the message. If you just want to know if an alert was shown,
         you can also use prompted (see below).
         */
        onalert(fn: Function);

        /*
         The first form specifies a canned response to return when window.confirm is called with that question.
         The second form will call the function with the question and use the response of the first function
         to return a value (true or false).

         The response to the question can be true or false, so all canned responses are converted to either value.
         If no response available, returns false.

         For example:

         browser.onconfirm "Are you sure?", true
         */
        onconfirm(question: string, response);
        onconfirm(fn: Function);

        /*
         The first form specifies a canned response to return when window.prompt is called with that message.
         The second form will call the function with the message and default value and use the response
         of the first function to return a value or false.

         The response to a prompt can be any value (converted to a string),
         false to indicate the user cancelled the prompt (returning null), or nothing to have the prompt return
         the default value or an empty string.

         For example:

         browser.onprompt (message)-> Math.random()
         */
        onprompt(message: string, response);
        onprompt(fn: Function);

        /*
         Returns true if user was prompted with that message by a previous call to window.alert,
         window.confirm or window.prompt.
         */
        prompted(message: string): boolean;

        /*
         Events

         Since events may execute asynchronously (e.g. XHR requests, timers), the browser maintains an event queue.
         Occasionally you will need to let the browser execute all the queued events before proceeding.
         This is done by calling wait, or one of the many methods that accept a callback.

         In addition the browser is also an EventEmitter. You can register any number of event listeners to any of the emitted events.
         */

        /*
         The current system clock according to the browser (see also browser.now).
         */
        clock: any;

        /*
         The current system time according to the browser (see also browser.clock).
         */
        now: Date;

        /*
         Fires a DOM event. You can use this to simulate a DOM event, e.g. clicking a link or clicking the mouse.
         These events will bubble up and can be cancelled.

         The first argument it the event name (e.g. click), the second argument is the target element of the event.
         With a callback, this method will transfer control to the callback after running all events.
         */
        fire(name: string, target: string, callback?: Function);
        fire(name: string, target: Element, callback?: Function);

        /*
         Process all events in the queue and calls the callback when done.

         You can use the second form to pass control before processing all events. The terminator can be a number,
         in which case that many events are processed. It can be a function, which is called after each event;
         processing stops when the function returns the value false.
         */
        wait(callback?: Function);
        wait(terminator: number, callback: Function);
        wait(terminator: Function, callback: Function);

        /*
         TODO confirm
         */
        done: (browser: ZombieBrowser) => void;
        error: (err: Object) => void;
        loaded: (browser: ZombieBrowser) => void;

        /*
         Debugging
         */

        /*
         Dump information to the console: Zombie version, current URL, history, cookies, event loop, etc.
         Useful for debugging and submitting error reports.
         */
        dump();

        /*
         Returns the last error received by this browser in lieu of response.
         */
        lastError: Object;

        /*
         Returns the last request sent by this browser.
         */
        lastRequest: Object;

        /*
         Returns the last response received by this browser.
         */
        lastResponse: Object;

        /*
         Call with multiple arguments to spit them out to the console when debugging enabled (same as console.log).
         Call with function to spit out the result of that function call when debugging enabled.
         */
        log(...args: Object[]);
        log(fn: Function);
    }

    export = ZombieBrowser;
}