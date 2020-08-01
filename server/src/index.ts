import express from 'express';
import bodyParser from 'body-parser';
import { listings } from './listings';

const app = express();
const port = 9000;

app.use(bodyParser.json());

app.get('/listings', (_req, res) => res.send(listings));

app.post('/delete', (req, res) => {
  const id: string = req.body.id;

  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return res.send(listings.splice(i, 1));
    }
  }

  return res.status(404).send('Listing not found');
});

app.listen(port);

console.log(`App listening on port: ${port}`);
