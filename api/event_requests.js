export default function handler(req, res) {
    if (req.method === 'POST') {
      const { name, date, location, description } = req.body;
  
      if (!name || !date || !location || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      console.log("Mock event added:", req.body);
      res.status(201).json({ message: "Event request received (mocked)" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  }
  