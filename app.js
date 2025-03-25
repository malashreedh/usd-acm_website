//WORKING VERSION OF BACKEND APP.JS
//WORKING VERSION OF BACKEND APP.JS
//WORKING VERSION OF BACKEND APP.JS
//WORKING VERSION OF BACKEND APP.JS
//WORKING VERSION OF BACKEND APP.JS
//WORKING VERSION OF BACKEND APP.JS

require('dotenv').config();
const express = require('express');
const { Client } = require('pg');
const app = express();
const PORT = 3000;

// Use middleware to parse JSON bodies
app.use(express.json());

// Serve static files (front-end assets in the public folder)
app.use(express.static('public'));

// Create a new instance of the PostgreSQL client
const client = new Client({
    user: process.env.DB_USER,  // Use DB_USER from .env
    host: process.env.DB_HOST,  // Use DB_HOST from .env
    database: process.env.DB_NAME,  // Use DB_NAME from .env
    password: process.env.DB_PASSWORD,  // Use DB_PASSWORD from .env
    port: process.env.DB_PORT,  // Use DB_PORT from .env
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Home route (now serving home.html)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');  // Serve home.html from the public folder
});

// Route to get both upcoming events and requested events
app.get('/events', (req, res) => {
  // Fetch both upcoming events and requested events
  const eventsQuery = 'SELECT * FROM events';
  const requestedEventsQuery = 'SELECT * FROM event_requests';

  // Execute both queries
  client.query(eventsQuery, (err, eventsResult) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).send('Error fetching upcoming events');
    }

    client.query(requestedEventsQuery, (err, requestedEventsResult) => {
      if (err) {
        console.error('Error fetching requested events:', err);
        return res.status(500).send('Error fetching requested events');
      }

      // Combine the results and send back as JSON
      const events = eventsResult.rows;
      const requestedEvents = requestedEventsResult.rows;

      res.json({ events, requestedEvents });
    });
  });
});

// Route to add a new event request
app.post('/event_requests', (req, res) => {
  const { name, date, location, description } = req.body;

  // Ensure all necessary fields are present
  if (!name || !date || !location || !description) {
    return res.status(400).send('Missing required event fields');
  }

  const query = 'INSERT INTO event_requests (event_name, created_at, event_location, event_description) VALUES ($1, $2, $3, $4)';
  const values = [name, date, location, description];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database query error: ' + err.message);
    }
    res.status(201).send('Event requested successfully');
  });
});

// Route to handle upvoting an event request
app.post('/event-requests/:id/upvote', (req, res) => {
  const eventId = req.params.id;
  const memberId = req.body.member_id;  // Assuming member_id is sent in the request body
  handleVote(eventId, memberId, 'upvote', res);
});

// Route to handle downvoting an event request
app.post('/event-requests/:id/downvote', (req, res) => {
  const eventId = req.params.id;
  const memberId = req.body.member_id;  // Assuming member_id is sent in the request body
  handleVote(eventId, memberId, 'downvote', res);
});

// Function to handle vote logic (upvote or downvote) for requested events
function handleVote(eventId, memberId, voteType, res) {
  const checkVoteQuery = 'SELECT * FROM event_votes WHERE member_id = $1 AND event_request_id = $2';
  client.query(checkVoteQuery, [memberId, eventId], (err, result) => {
    if (err) {
      console.error('Error checking vote:', err);
      return res.status(500).send('Error checking vote');
    }

    if (result.rows.length > 0) {
      // Member has already voted, so update the vote type to 'upvote' or 'downvote'
      const updateVoteQuery = 'UPDATE event_votes SET vote_type = $1 WHERE member_id = $2 AND event_request_id = $3';
      client.query(updateVoteQuery, [voteType, memberId, eventId], (err) => {
        if (err) {
          console.error('Error updating vote:', err);
          return res.status(500).send('Error updating vote');
        }
        updateEventVoteCount(eventId, res);
      });
    } else {
      // Insert new vote record
      const insertVoteQuery = 'INSERT INTO event_votes (member_id, event_request_id, vote_type) VALUES ($1, $2, $3)';
      client.query(insertVoteQuery, [memberId, eventId, voteType], (err) => {
        if (err) {
          console.error('Error inserting vote:', err);
          return res.status(500).send('Error inserting vote');
        }
        updateEventVoteCount(eventId, res);
      });
    }
  });
}

// Function to update the event vote counts for event_requests table
function updateEventVoteCount(eventId, res) {
  const updateVoteCountQuery = `
    UPDATE event_requests
    SET upvotes = (SELECT COUNT(*) FROM event_votes WHERE event_request_id = $1 AND vote_type = 'upvote'),
        downvotes = (SELECT COUNT(*) FROM event_votes WHERE event_request_id = $1 AND vote_type = 'downvote')
    WHERE id = $1
  `;
  client.query(updateVoteCountQuery, [eventId], (err) => {
    if (err) {
      console.error('Error updating event vote counts:', err);
      return res.status(500).send('Error updating event vote counts');
    }
    res.send('Vote updated and event vote counts updated');
  });
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
