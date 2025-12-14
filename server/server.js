import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'https://dream-pixel-1.onrender.com', // Your Frontend Render Link
    credentials: true
}));
await connectDB();

// API routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

// Frontend path (correct!)
const frontendPath = path.join(__dirname, '../client/dist');
console.log("Resolved frontend path:", frontendPath);

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on port " + PORT);
});
