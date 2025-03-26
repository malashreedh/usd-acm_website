## USD-ACM Website
**Deployed here: https://usdacmclub.vercel.app/**

This repository contains the code for the USD-ACM website, designed to provide information about the Association for Computing Machinery (ACM) club at the University of South Dakota (USD). The website allows users to view upcoming events, submit event requests, and interact with the events by upvoting or downvoting them.

# Tech Stack
**Frontend**
HTML: The structure of the web pages is created using HTML. It provides the layout and content for the website.

CSS: The styling of the website is done using custom CSS. It includes styles for the navigation bar, event cards, and other components.

JavaScript: JavaScript is used to add interactivity to the website. It enables the dynamic loading of events, handling user interactions (like upvotes and downvotes), and submitting new events to the backend.

Fetch API: The Fetch API is used to make HTTP requests to the backend for retrieving and submitting data.

**Backend**
Node.js: The backend is built using Node.js. It provides the server-side logic for handling requests, processing data, and interacting with the database.

Express.js: Express.js is used as a web framework for handling routes and simplifying the creation of the server.

PostgreSQL: The database used to store event data, user interactions (upvotes/downvotes), and event requests. PostgreSQL is chosen for its reliability and scalability.

Supabase: Supabase is used for managing the PostgreSQL database. It provides a hosted service for PostgreSQL, simplifying database management.

**Deployment**
Vercel: The website is deployed on Vercel, which provides an easy-to-use platform for deploying Node.js applications. Vercel automatically handles deployments, scaling, and performance optimizations.

# Features
View Upcoming Events: The homepage displays upcoming events fetched from the PostgreSQL database.

Event Request Submission: Users can submit new event requests through a form. These requests are stored in the database for review.

Upvoting and Downvoting: Registered users can upvote or downvote events, influencing their visibility.

Event Display: The events are displayed dynamically with relevant information such as date, location, description, and vote counts.

**Installation**
**Prerequisites**
Before running the project locally, ensure you have the following installed:

Node.js

npm (Node Package Manager)

PostgreSQL (or a Supabase account for hosted database)

Steps to Run Locally
Clone the repository:

bash
Copy
git clone https://github.com/malashreedh/usd-acm_website.git
Install dependencies:

Navigate to the project directory and install the required dependencies using npm:

bash
Copy
cd usd-acm_website
npm install
Set up environment variables: Create a .env file in the root of the project and add the following variables:

bash
Copy
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
Start the server:

To start the server locally, run the following command:

bash
Copy
npm start
The application will be available at http://localhost:3000.

**Database Setup**
PostgreSQL: The website uses a PostgreSQL database to store event data and vote information. You can either set up your local PostgreSQL instance or use Supabase for a hosted solution.

Tables:

events: Stores details of upcoming events.

event_requests: Stores event requests submitted by users.

event_votes: Stores upvotes and downvotes for event requests.

members: Stores information about the club members (for handling upvotes and downvotes).

**Deployment**
This project is deployed using Vercel. Vercel automatically builds and deploys the project when changes are pushed to the repository. The website is live and accessible at [your-vercel-url].

To redeploy or update the project:

Push changes to the GitHub repository.

Vercel will automatically build and deploy the project with the latest changes.

**License**
This project is licensed under the MIT License.