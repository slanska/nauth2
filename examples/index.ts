/**
 * Created by slanska on 2016-10-10.
 */

import app = require('./feathers-app');

var port = process.env.PORT || 8800;
app.listen(port, ()=>
{
    console.log(`Listening on ${port}`);
});
