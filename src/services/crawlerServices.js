const puppeteer = require('puppeteer');
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import c_book from '../utils/crawl_book';

const crawlerServices = {
    crawl_articles_from_home: promisify(crawlArticlesFromHome)
}



async function crawlArticlesFromHome(cb) {
    try {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        // to be implemented later

        await browser.close();
    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


export default crawlerServices;