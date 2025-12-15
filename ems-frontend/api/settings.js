app.get("/api/settings", (req, res) => {
  res.json({ theme: "light", language: "en" });
});
