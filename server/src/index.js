const express = require('express');

const app = express();
const port = 9000;

app.get('/', (req, res) => res.send('Ho World'));
app.listen(port);
console.log(`App listening on port: ${port}`);
