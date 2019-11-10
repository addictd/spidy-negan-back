const  crawlbook = [{
    website : 'https://medium.com',
    indexing : [
        {
            for : 'main-article-list',
            node_list : '.js-mainfeed article .postMetaInline--author',
            article_title : '.js-mainfeed article a h2'
        }
    ]
}]
export default crawlbook;