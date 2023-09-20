import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import applicationRoutes from './routes/application.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger-config';

// Load environment variables
dotenv.config();

// Create an Express application
const app: Application = express();

// Middleware to parse JSON requests
app.use(express.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use application routes
app.use('/', applicationRoutes);

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app
