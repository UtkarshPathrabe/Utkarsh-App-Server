import { Notification, THRESHOLD_PERCENTAGE } from "../../../lib/nodemailer.js";

export function extractPrice(...elements) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if(priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, '');

      let firstPrice; 

      if (cleanPrice) {
        firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
      } 

      return firstPrice || cleanPrice;
    }
  }

  return '';
}

// Extracts and returns the currency symbol from an element.
export function extractCurrency(element) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from amazon
export function extractDescription($) {
  // these are possible elements holding description of the product
  const selectors = [
    "div#productOverview_feature_div div#poExpander div.a-expander-content div.a-row",
    "div#productOverview_feature_div div.a-section div.a-row",
    "div#featurebullets_feature_div div#feature-bullets ul.a-unordered-list span.a-list-item",
    // Add more selectors here if needed
  ];
  let textContent = '';
  for (const selector of selectors) {
    const elements = $(selector);
    if (elements.length > 0) {
      const tempContent = elements
        .map((_, element) => $(element).text().trim())
        .get()
        .join("\n");
      textContent = textContent.concat('\n', tempContent);
    }
  }
  return textContent;
}

export function extractRecommendation($) {
  const selector = '#brandSnapshot_feature_div div.a-cardui-deck div.a-section p';
  const parts = $(selector)?.map((_, element) => $(element)?.text()?.trim())?.get();
  if (parts && parts.length >= 2) {
    return parts[1];
  }
  return '';
}

export function getHighestPrice(priceList) {
  let highestPrice = priceList[0];
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price > highestPrice.price) {
      highestPrice = priceList[i];
    }
  }
  return highestPrice.price;
}

export function getLowestPrice(priceList) {
  let lowestPrice = priceList[0];
  for (let i = 0; i < priceList.length; i++) {
    if (priceList[i].price < lowestPrice.price) {
      lowestPrice = priceList[i];
    }
  }
  return lowestPrice.price;
}

export function getAveragePrice(priceList) {
  const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
  const averagePrice = sumOfPrices / priceList.length || 0;
  return averagePrice;
}

export const getEmailNotifType = (scrapedProduct, currentProduct) => {
  const lowestPrice = getLowestPrice(currentProduct.priceHistory);
  if (scrapedProduct.currentPrice < lowestPrice) {
    return Notification.LOWEST_PRICE;
  }
  if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
    return Notification.CHANGE_OF_STOCK;
  }
  if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
    return Notification.THRESHOLD_MET;
  }
  return null;
};

export const formatNumber = (num = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
