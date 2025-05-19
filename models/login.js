app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).send("Email and password required.");
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send("Invalid email or password.");
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send("Invalid email or password.");
  
      res.status(200).send("Login successful.");
    } catch (error) {
      res.status(500).send("Failed to login.");
    }
  });
  