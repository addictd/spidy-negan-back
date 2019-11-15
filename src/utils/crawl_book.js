//medium 

//tags


//stories
export const story_list_url = 'https://medium.com/search?q=';
export const story_list_selector = '.js-postListHandle > div .postArticle .postArticle-content a';
export const story_related_tag_selector = '.js-searchResults ul> ul>li>a';

//crawl articles
export const article_selector = 'head script[type="application/ld+json"]';
export const article_body_selector = 'article';

//response link
export const response_link = (id) => `https://medium.com/p/${id}/responses/show`;


//related functions
export const scrollToLastElem = async ({page, lastelemid, selector}) => {

    await page.evaluate(({ lastelemid, selector }) => {
        const elem = document.querySelector(`${selector}[data-post-id="${lastelemid}"]`);
        elem.scrollIntoView();
        
    }, { lastelemid, selector });
}


export const fetchmorelinks = async ({page, fetched_links, selector }) => {
    const _count = fetched_links.length;

    const lastelemid = fetched_links[_count - 1].id;
    
    scrollToLastElem({page, lastelemid, selector});
    await page.waitForFunction( ({selector, fetched_links}) => (
        document.querySelectorAll(selector).length > fetched_links.length) , {}, {selector, fetched_links} );

    console.log('loaded');

}

export const generateLinks = async ({page, selector}) => {
    const links = await page.$$eval(selector, elems => elems.map((item, i) => ({
        link: item.getAttribute('href'),
        id: item.getAttribute("data-post-id"),
        index : i
    })));
    return links;
}