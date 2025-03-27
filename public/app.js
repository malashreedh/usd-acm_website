document.addEventListener("DOMContentLoaded", () => {
    const eventsList = document.getElementById("events-list");
    const requestedEventsList = document.getElementById("requested-events-list");

    function loadEvents() {
        fetch("/api/events")
            .then(response => response.json())
            .then(data => {
                const events = data.events || [];
                const requestedEvents = data.requestedEvents || [];

                eventsList.innerHTML = '';
                requestedEventsList.innerHTML = '';

                // Render upcoming events
                if (events.length === 0) {
                    eventsList.innerHTML = "<p>No upcoming events available at the moment.</p>";
                } else {
                    events.forEach(event => {
                        const eventCard = document.createElement("div");
                        eventCard.classList.add("event-card");

                        const formattedDate = formatDate(event.created_at || event.date);

                        eventCard.innerHTML = `
                            <h2>${event.event_name || event.name || 'No event name'}</h2>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                            <p><strong>Location:</strong> ${event.event_location || event.location || 'No location'}</p>
                            <p><strong>Description:</strong> ${event.event_description || event.description || 'No description available'}</p>
                        `;
                        eventsList.appendChild(eventCard);
                    });
                }

                // Render requested events
                if (requestedEvents.length === 0) {
                    requestedEventsList.innerHTML = "<p>No requested events available at the moment.</p>";
                } else {
                    requestedEvents.forEach(event => {
                        const eventCard = document.createElement("div");
                        eventCard.classList.add("event-card");

                        const formattedDate = formatDate(event.created_at || event.date);

                        eventCard.innerHTML = `
                            <h2>${event.event_name || 'No event name'}</h2>
                            <p><strong>Date:</strong> ${formattedDate}</p>
                            <p><strong>Location:</strong> ${event.event_location || 'No location'}</p>
                            <p><strong>Description:</strong> ${event.event_description || 'No description available'}</p>
                            <p>Upvotes: <span class="upvotes">${event.upvotes || 0}</span> | Downvotes: <span class="downvotes">${event.downvotes || 0}</span></p>
                            <button class="upvote" data-id="${event.id}">Upvote</button>
                            <button class="downvote" data-id="${event.id}">Downvote</button>
                        `;

                        // Add vote button listeners
                        addVoteListener(eventCard, event.id, "upvote");
                        addVoteListener(eventCard, event.id, "downvote");

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

    function addVoteListener(card, eventId, type) {
        const button = card.querySelector(`.${type}`);
        button.addEventListener("click", () => {
            const memberId = 1; // Ideally should be dynamic
            fetch(`/api/event-vote?id=${eventId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ member_id: memberId, voteType: type }),
            })
                .then(res => res.text())
                .then(alert)
                .then(loadEvents)
                .catch(err => console.error(`Error during ${type}:`, err));
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return (date instanceof Date && !isNaN(date)) ? date.toLocaleDateString() : "No date available";
    }

    // Initial load
    loadEvents();

    // Handle event submission
    const eventForm = document.getElementById("add-event-form");
    if (eventForm) {
        eventForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const newEvent = {
                name: document.getElementById("event-name").value,
                date: document.getElementById("event-date").value,
                location: document.getElementById("event-location").value,
                description: document.getElementById("event-description").value,
            };

            fetch("/api/event_requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEvent),
            })
                .then(res => res.text())
                .then(msg => {
                    alert(msg);
                    eventForm.reset();
                    loadEvents();
                })
                .catch(err => {
                    console.error("Error adding event:", err);
                    alert("Failed to add event");
                });
        });
    }
});
