document.addEventListener("DOMContentLoaded", () => {
    const eventsList = document.getElementById("events-list");
    const requestedEventsList = document.getElementById("requested-events-list");

    // Fetch both upcoming events and requested events from the backend
    function loadEvents() {
        fetch("http://localhost:3000/events")
            .then(response => response.json())
            .then(data => {
                const events = data.events;
                const requestedEvents = data.requestedEvents;

                // Clear the existing lists before adding new events
                eventsList.innerHTML = '';
                requestedEventsList.innerHTML = '';

                // Display upcoming events
                if (!events || events.length === 0) {
                    eventsList.innerHTML = "<p>No upcoming events available at the moment.</p>";
                } else {
                    events.forEach(event => {
                        const eventCard = document.createElement("div");
                        eventCard.classList.add("event-card");

                        const eventDate = new Date(event.date);
                        const formattedDate = eventDate instanceof Date && !isNaN(eventDate) ? eventDate.toLocaleDateString() : 'No date available';

                        eventCard.innerHTML = `
                            <h2>${event.name || 'No event name'}</h2>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                            <p><strong>Location:</strong> ${event.location || 'No location'}</p>
                            <p><strong>Description:</strong> ${event.description || 'No description available'}</p>
                        `;
                        eventsList.appendChild(eventCard);
                    });
                }

                // Display requested events
                if (!requestedEvents || requestedEvents.length === 0) {
                    requestedEventsList.innerHTML = "<p>No requested events available at the moment.</p>";
                } else {
                    requestedEvents.forEach(event => {
                        const eventCard = document.createElement("div");
                        eventCard.classList.add("event-card");

                        const eventDate = new Date(event.date);
                        const formattedDate = eventDate instanceof Date && !isNaN(eventDate) ? eventDate.toLocaleDateString() : 'No date available';

                        eventCard.innerHTML = `
                            <h2>${event.event_name || 'No event name'}</h2>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                            <p><strong>Location:</strong> ${event.location || 'No location'}</p>
                            <p><strong>Description:</strong> ${event.event_description || 'No description available'}</p>
                            <p>Upvotes: <span class="upvotes">${event.upvotes || 0}</span> | Downvotes: <span class="downvotes">${event.downvotes || 0}</span></p>
                            <button class="upvote" data-id="${event.id}">Upvote</button>
                            <button class="downvote" data-id="${event.id}">Downvote</button>
                        `;

                        // Add event listeners for upvote/downvote buttons
                        eventCard.querySelector(".upvote").addEventListener("click", function() {
                            const eventId = event.id;
                            const memberId = 1; // You should get the logged-in member's ID here

                            fetch(`http://localhost:3000/event-requests/${eventId}/upvote`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ member_id: memberId })
                            })
                            .then(response => response.text())
                            .then(data => {
                                alert(data);
                                loadEvents(); // Reload the event list dynamically
                            })
                            .catch((error) => console.error("Error:", error));
                        });

                        eventCard.querySelector(".downvote").addEventListener("click", function() {
                            const eventId = event.id;
                            const memberId = 1; // You should get the logged-in member's ID here

                            fetch(`http://localhost:3000/event-requests/${eventId}/downvote`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ member_id: memberId })
                            })
                            .then(response => response.text())
                            .then(data => {
                                alert(data);
                                loadEvents(); // Reload the event list dynamically
                            })
                            .catch((error) => console.error("Error:", error));
                        });

                        // Append the requested event card to the requested events list
                        requestedEventsList.appendChild(eventCard);
                    });
                }
            })
            .catch(err => {
                eventsList.innerHTML = "<p>Failed to load events.</p>";
                requestedEventsList.innerHTML = "<p>Failed to load requested events.</p>";
                console.error("Error fetching events:", err);
            });
    }

    // Load events initially
    loadEvents();

    // Event form handling for adding a new event request
    const eventForm = document.getElementById("add-event-form");
    if (eventForm) {
        eventForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Gather form data
            const eventName = document.getElementById("event-name").value;
            const eventDate = document.getElementById("event-date").value;
            const eventLocation = document.getElementById("event-location").value;
            const eventDescription = document.getElementById("event-description").value;

            // Prepare data for submission
            const newEvent = {
                name: eventName,
                date: eventDate,
                location: eventLocation,
                description: eventDescription
            };

            // Send the event data to the backend via a POST request
            fetch("http://localhost:3000/event_requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent),
            })
            .then(response => response.text())
            .then(data => {
                alert(data); // Notify user that the event was successfully added
                eventForm.reset();  // Clear the form fields
                loadEvents();  // Reload the event list dynamically
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Failed to add event");
            });
        });
    }
});
