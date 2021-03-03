const express = require('express');
const bodyParser = require('body-parser');

const apiRouter = require('./routes/index');
const apiAuth = require('./routes/auth');

const app = express();


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', apiRouter);
app.use('/api/auth', apiAuth);


app.listen(process.env.PORT || '3000', 
    () => console.log(`Server is running on port: ${process.env.PORT || '3000'}`));