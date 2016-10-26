NAuth2 configuration used at runtime is the result of merging 3 individual config
 files (with identical structure). 
 
**base.config** defines various configurations for development and test environments
(development, test_sqlite, test_mariadb, test_pg)

**apiservice.config** and **website.config** define single universal configuration
which has only specific settings for the respective modes.

**private.config** has confidential portion of configuration including SendGrid API key
and others. It is not supposed to be in Github repository and generally is
optional. For your development/testing/production environment you can set all
these settings in base.config file.
    
#### For apiservice mode 

base.config + private.config + apiservice.config

#### For website mode

base.config + private.config + website.config
  
 