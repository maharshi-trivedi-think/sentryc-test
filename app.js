import express from "express";

import formRoutes from "./routes/formRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use("/api", formRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
