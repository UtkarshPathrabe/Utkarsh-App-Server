import express from 'express';
import * as dotenv from 'dotenv';

import Product from '../mongodb/models/product.model.js';
import connectToDB from '../../../lib/mongoose.js';
import { getLowestPrice, getHighestPrice, getAveragePrice, getEmailNotifType } from "../utilities/index.js";
import { scrapeAmazonProduct } from "../utilities/amazonScraper.js";
import { generateEmailBody, sendEmail } from "../../../lib/nodemailer.js";

dotenv.config();

const mongoDbUrl = process.env.PRICEWISE_MONGODB_URL;

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    await connectToDB(mongoDbUrl, 'Pricewise');
    const products = await Product.find({});
    if (!products) throw new Error("No product fetched");

    // ======================== 1 SCRAPE LATEST PRODUCT DETAILS & UPDATE DB
    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        // Scrape product
        const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProduct) return;

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          {
            price: scrapedProduct.currentPrice,
          },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        // Update Products in DB
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: product.url,
          },
          product
        );

        // ======================== 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          // Construct emailContent
          const emailContent = await generateEmailBody(productInfo, emailNotifType);
          // Get array of user emails
          const userEmails = updatedProduct.users.map((user) => user.email);
          // Send email notification
          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );

    res.status(200).json({ success: true, data: updatedProducts });
  } catch (err) {
    res.status(500).json({ success: false, message: `Failed to get all products: ${err.message}` });
  }
});

export default router;
