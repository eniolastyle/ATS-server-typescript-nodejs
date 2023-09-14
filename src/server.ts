import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import applicationRoutes from './routes/application.routes';

// Load environment variables
dotenv.config();

// Create an Express application
const app: Application = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use application routes
app.use('/', applicationRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
