import express from "express";
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cors from 'cors';

import aiImageGenerationDalleRoutes from './apps/ai_image_generation/routes/dalle.route.js';
import aiImageGenerationPostsRoutes from './apps/ai_image_generation/routes/posts.route.js';
import aiCodeGeneratorGptRoutes from './apps/ai_code_generator/routes/gpt.route.js';
import memoriesPostsRoutes from './apps/memories/routes/posts.route.js';
import memoriesUsersRoutes from './apps/memories/routes/users.route.js';
import portfolioHackerrankRoutes from './apps/portfolio/routes/hackerrank.route.js';
import portfolioLeetcodeRoutes from './apps/portfolio/routes/leetcode.route.js';
import pricewiseProductRoutes from './apps/pricewise/routes/product.route.js';
import shirtCustomizerRoutes from './apps/shirt_customizer/routes/dalle.route.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.set('trust proxy', true);

app.use('/api/v1/ai_image_generator', aiImageGenerationDalleRoutes);
app.use('/api/v1/ai_image_generator/posts', aiImageGenerationPostsRoutes);
app.use('/api/v1/ai_code_generator', aiCodeGeneratorGptRoutes);
app.use('/api/v1/memories/posts', memoriesPostsRoutes);
app.use('/api/v1/memories/users', memoriesUsersRoutes);
app.use('/api/v1/portfolio/hackerrank', portfolioHackerrankRoutes);
app.use('/api/v1/portfolio/leetcode', portfolioLeetcodeRoutes);
app.use('/api/v1/pricewise/products', pricewiseProductRoutes);
app.use('/api/v1/shirt_customizer', shirtCustomizerRoutes);

app.get('/', (req, res) => {
  res.status(200).send('Hello World! Node JS application for my <a href="https://utkarshpathrabe.com/">Personal Website</a> and other personal projects.');
});

app.get('*', function (req, res) {
	res.send('Invalid URL');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log('Server has started on port ' + PORT);
});
