export default function handler(req, res) {
    const { method } = req;
  
    if (method === 'POST') {
      const { id } = req.query; // from URL: /event-requests/:id
      const { voteType, member_id } = req.body; // send voteType = 'upvote' or 'downvote'
  
      if (!id || !voteType || !member_id) {
        return res.status(400).json({ error: "Missing vote parameters" });
      }
  
      console.log(`${voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} event ID: ${id} by member ${member_id}`);
      return res.status(200).json({ message: "Vote registered (mocked)" });
    }
  
    return res.status(405).json({ error: "Method not allowed" });
  }
  