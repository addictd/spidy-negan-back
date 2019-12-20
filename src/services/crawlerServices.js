const puppeteer = require('puppeteer');
import { promisify } from 'util';
import * as errMsg from "../utils/errorMsg";
import * as c_book from '../utils/crawl_book';

const crawlerServices = {
    fetch_more_stories_list : promisify(fetchStoriesList),
    crawl_article: promisify(crawlArticle),
    fetch_response : promisify(fetchResponse),
    fetch_blog_html : promisify(fechBlogHtml)
}



async function fetchStoriesList({ tag, count }, cb) {
    try {
        if (!tag || !count ) throw errMsg.INCOMPLETE_ARGUMENTS;

        var browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
        const page = await browser.newPage();

        const _url = c_book.story_list_url + tag;
        await page.goto(_url  );

        const _tags_selector = c_book.story_related_tag_selector;
        await page.waitFor(_tags_selector);
        const related_tags = await page.$$eval(_tags_selector, elems => elems.map(elem => elem.textContent.toLowerCase() ))


        const _selector = c_book.story_list_selector;
        const _selector2 = c_book.story_list_meta_selector;
        await page.waitFor(_selector);
        const params = {
            page, 
            post_content_selector : _selector, 
            post_meta_selector : _selector2
        };
        let fetched_links = await c_book.generateLinks(params);
        
        while(fetched_links.length < count){
            const fetch_more = await c_book.fetchmorelinks({page, fetched_links, selector : _selector});
            fetched_links =  await c_book.generateLinks(params);
        }
        fetched_links = fetched_links.map(item => {
            item.tag = tag;
            return item;
        });

        await browser.close();
        cb(null, {links : fetched_links, related_tags});

    } catch (err) {
        await browser.close();
        cb(errMsg._ERR(err));
    }finally{
        await browser.close();
    }
}


async function crawlArticle({ url }, cb) {
    console.log('url------: ', url);
    try {
        if (!url) throw errMsg.INCOMPLETE_ARGUMENTS;
        const options = { timeout: 30000 };
        let article = {};

        try {
            
            var browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: false });
            const page = await browser.newPage();

            const startTime = (new Date()).getTime();
            await page.goto(url );

            const {article_selector, article_body_selector } = c_book; 

            try {
                await page.waitFor( article_selector , options);
                const elem = await page.$eval( article_selector, elem => elem.textContent);
                article = JSON.parse(elem);
            } catch (err) { }

            try {
                await page.waitFor( article_body_selector , options);
                const blog = await page.$$eval( article_body_selector, elems => elems.map(elem => elem.textContent));
                article.blog = blog.reduce((result, item, i) => (result + item), '');
            } catch (err) { article.blog = ''; };
            
            const endTime = (new Date()).getTime();
            
            await browser.close();

            article.fetch_time = endTime - startTime;
            article.crawl_status = 'success';

        } catch (err) {
            article.fetch_time = -1;
            article.identifier ="";
            article.crawl_status = 'err';
            console.log('err crawling article :============== ', err);
        }

        cb(null, article);

    } catch (err) {
        cb(errMsg._ERR(err));
        await browser.close();
    }finally{
        await browser.close();
    }
}





async function fechBlogHtml({ url }, cb) {

    try {
        if (!url ) throw errMsg.INCOMPLETE_ARGUMENTS;

        const options = { timeout: 30000 };
        let blog_html = '';
        let blog_style = '';

        var browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
        const page = await browser.newPage();
        await page.goto(url);

        const { article_body_selector, article_selector } = c_book; 
        try {
            await page.waitFor( article_selector , options);
            await page.waitFor( article_body_selector + ' img', options);

            blog_html = await page.evaluate(({article_body_selector}) => {
                return document.querySelector(article_body_selector).innerHTML;
            }, {article_body_selector});

        } catch (err) { console.log("in html error"); };


        try{
            const styles = await page.evaluate(() => {
                let str = '';
                const sty = document.styleSheets;
                for(let i=0 ; i< sty.length; i++){
                    str += sty[i].ownerNode.innerText;
                }
                return str;
            });

            blog_style = styles;
        }catch(err){ console.log("in style error"); }

        

        await browser.close();
        
        cb(null, {blog_html, blog_style} );

    } catch (err) {
        cb(errMsg._ERR(err));
        await browser.close();
    }finally{
        await browser.close();
    }
}



async function fetchResponse({ id}, cb) {

    try {
        if (!id ) throw errMsg.INCOMPLETE_ARGUMENTS;

        const options = { timeout: 30000 };
        let blog_response = '';

        var browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
        const page = await browser.newPage();

        try {
            const url = c_book.response_link(id);
            const {response_selector_parent, response_selector_item } = c_book;
            
            page.goto(url  );
            await page.waitFor( response_selector_item , options); 
            blog_response = await page.$eval( response_selector_parent, elem => elem.innerHTML );
            
        } catch (err) {  };

        await browser.close();
        
        cb(null, blog_response);

    } catch (err) {
        cb(errMsg._ERR(err));
        await browser.close();
    } finally{
        await browser.close();
    }
}


export default crawlerServices;