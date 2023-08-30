
/*
// Staking route
app.post('/stake', async (req, res) => {
    try {
      const { userId, amount } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.usdtWallet >= amount) {
        user.usdtWallet -= amount;
        user.stake += amount / 1000; // Assuming 1$ = 20,000 TAJI
        await user.save();
        res.status(200).json({ message: 'Stake successful' });
      } else {
        res.status(400).json({ message: 'Insufficient balance' });
      }
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
});

  
// Route to distribute revenue
app.post('/distribute-revenue', async (req, res) => {
    try {
      const totalRevenue = req.body.amount; // Total revenue in sub-revenue wallet
  
      // Distribute 75% to main-revenue wallet
      const mainRevenue = totalRevenue * 0.75;
  
      // Distribute 25% as rewards to stakeholders
      const stakeholders = await User.find({ stake: { $gt: 0 } });
      const totalStake = stakeholders.reduce((acc, user) => acc + user.stake, 0);
      
      for (const user of stakeholders) {
        const reward = (user.stake / totalStake) * (totalRevenue * 0.25);
        user.reward += reward;
        await user.save();
      }
  
      // Move funds to main-revenue wallet and update total revenue
      // (You'll need to implement this part based on your system)
      
      res.status(200).json({ message: 'Revenue distribution successful' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred' });
    }
});
*/  