require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true,
});

const poll = [
  {
    name: 'Chelsea',
    votes: 100,
  },
  {
    name: 'Arsenal',
    votes: 70,
  },
  {
    name: 'Liverpool',
    votes: 250,
  },
  {
    name: 'Manchester City',
    votes: 689,
  },
  {
    name: 'Manchester United',
    votes: 150,
  },
];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function increment() {
  const num = getRandomArbitrary(0, poll.length);
  poll[num].votes += 20;
}

function updatePoll() {
  setInterval(() => {
    increment();
    pusher.trigger('poll-channel', 'update-poll', {
      poll,
    });
  }, 1000);
}

const app = express();
app.use(cors());

app.get('/poll', (req, res) => {
  res.json(poll);
  updatePoll();
});

app.set('port', process.env.PORT || 4000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
