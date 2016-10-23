## Templates and phrases

### Templates for email generation

NAuth2 uses files in the _templates_ folder 

[ECT](https://github.com/baryshev/ect) is used as a template engine to render emails.
Templates are organized based on culture(language). 
Currently, NAuth2 provides templates for English (/en) and Russian (/ru) languages.
Language is determined (in priority sequence) by: 1) user's preference (stored in the database),
2) global default language, 3) browser language (using _req.headers["accept-language"]_ )

Inspired by [Mailgun Transactional Templates](http://blog.mailgun.com/transactional-html-email-templates/), 
all NAuth2 templates fall into one of three categories:
* action
* alert
* notification (_billing_ in Mailgun's terms)

Every category has a corresponding layout (or master) HTML file, which embeds styling and provies template structure.
Layout files are placed in _templates_ root.
There is also separate footer.html, which gets injected into all layouts.
This is a centralized place for specifying common company information 
(address, phones, social media links etc.) that will be rendered at bottom of all emails.

All layouts define set of placeholders and expected data attributes. Individual email templates
must provide blocks for placeholders. Expected data attributes are supplied
at runtime, based on configuration and running context.

#### Attributes for all layouts

Coming from configuration:
* Company Name (_companyName_)
* Public Host URL (_publicHostUrl_)
* Terms of Service URL (_eulaUrl_)

Provided at runtime:
* **title**

#### Action Template
Defines the following placeholders:
* **top** 
* **body**
* **bottom**

Expects the following data attributes:
* **actionUrl**
* **actionTitle**

#### Alert Template

The same as Action, plus:
* **warning** placeholder
