const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const app = require("./src/app");
const { connectDatabase } = require("./src/config/database");

const port = Number.parseInt(process.env.PORT, 10) || 5204;

async function startServer() {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error);
  process.exit(1);
});
