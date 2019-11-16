//stories
export const story_list_url = 'https://medium.com/search?q=';
export const story_list_selector = '.js-postListHandle > div .postArticle .postArticle-content a';
export const story_list_meta_selector = '.js-postListHandle > div .postArticle .postMetaInline';
export const story_related_tag_selector = '.js-searchResults ul> ul>li>a';

//crawl articles
export const article_selector = 'head script[type="application/ld+json"]';
export const article_body_selector = 'article';

//response link
export const response_link = (id) => `https://medium.com/p/${id}/responses/show`;

// response selector
export const response_selector_parent = '.js-responsesStreamOther';
export const response_selector_item = '.js-responsesStreamOther .js-streamItem';


//related functions
export const scrollToLastElem = async ({ page, lastelemid, selector }) => {
    await page.evaluate(({ lastelemid, selector }) => {
        const elem = document.querySelector(`${selector}[data-post-id="${lastelemid}"]`);
        elem.scrollIntoView();
    }, { lastelemid, selector });
}

export const fetchmorelinks = async ({ page, fetched_links, selector }) => {
    const _count = fetched_links.length;
    const lastelemid = fetched_links[_count - 1].id;
    scrollToLastElem({ page, lastelemid, selector });
    await page.waitForFunction(({ selector, fetched_links }) => (
        document.querySelectorAll(selector).length > fetched_links.length), {}, { selector, fetched_links });
}

export const generateLinks = async ({ page, post_content_selector , post_meta_selector }) => {

    try {
        const links = await page.evaluate(({post_content_selector, post_meta_selector}) => {
            let obj = [];

            const hrefs = document.querySelectorAll(post_content_selector);
            const details = document.querySelectorAll(post_meta_selector);

            for (let i = 0; i < hrefs.length; i++) {
                let headline = '';

                if (hrefs[i].querySelector('h2') && hrefs[i].querySelector('h2').textContent) {
                    headline += hrefs[i].querySelector('h2').textContent;
                }
                if (hrefs[i].querySelector('h3') && hrefs[i].querySelector('h3').textContent) {
                    headline += hrefs[i].querySelector('h3').textContent;
                }

                obj[i] = {
                    url: hrefs[i].getAttribute("href"),
                    id: hrefs[i].getAttribute("data-post-id"),
                    index: i,
                    headline,
                    details: details[i].textContent
                }
            }

            return obj;
        }, {post_content_selector, post_meta_selector})
        return links;
    } catch (err) {
        console.log('err: ', err);
        return [];
    }
}