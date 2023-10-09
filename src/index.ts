import * as cheerio from 'cheerio';
import axios from 'axios';

const url: string = 'https://www.magazineluiza.com.br/selecao/ofertasdodia/';

type Product = {
    title: string;
    originalPrice: string;
    price: string;
};

async function getProducts() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const products: Product[] = [];
        let productCount = 0;

        const productContainers = $("li a[data-testid='product-card-container']");

        productContainers.each((_, element) => {
            if (productCount < 6) {
                const product = {
                    title: '',
                    originalPrice: '',
                    price: '',
                } satisfies Product;

                const contentElement = $(element).find("div[data-testid='product-card-content']");

                const originalPriceElement = contentElement.find("p[data-testid='price-original']");

                const priceElement = contentElement.find("p[data-testid='price-value']");

                const titleElement = contentElement.find("h2[data-testid='product-title']");

                product.originalPrice = originalPriceElement.text().trim();

                product.price = priceElement.text().trim();

                product.title = titleElement.text().trim();

                products.push(product);
                productCount++;
            } else {
                return false;
            }
        });

        console.log(products);
    } catch (error) {
        console.error('Ocorreu um erro ao buscar os produtos:', error);
    }
}

getProducts();
