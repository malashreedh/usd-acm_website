export default function handler(req, res) {
    if (req.method === 'GET') {
      const events = [
        { id: 1, event_name: "Hackathon", created_at: "2024-04-01", event_location: "USD Campus", event_description: "24-hr build" },
      ];
      const requestedEvents = [
        { id: 2, event_name: "Tech Talk", created_at: "2024-04-05", event_location: "Zoom", event_description: "AI & Society" }
      ];
  
      res.status(200).json({ events, requestedEvents });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  