const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const taskRouter = require('./modules/routes');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

app.use('/list', taskRouter);

app.listen(PORT, () => {
    console.log(`Server is up on ${PORT}`);
})