const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const app = require("./src/app");
const { connectDatabase } = require("./src/config/database");

const port = Number.parseInt(process.env.PORT, 10) || 5204;
let prepareAppPromise = null;

async function prepareApp() {
  if (!prepareAppPromise) {
    prepareAppPromise = connectDatabase().catch((error) => {
      prepareAppPromise = null;
      throw error;
    });
  }

  await prepareAppPromise;
  return app;
}

async function startServer() {
  await prepareApp();

  app.listen(port, () => {
    console.log(`Backend is running at http://localhost:${port}`);
  });
}

module.exports = async (req, res) => {
  const preparedApp = await prepareApp();
  return preparedApp(req, res);
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("Failed to start backend:", error);
    process.exit(1);
  });
}
