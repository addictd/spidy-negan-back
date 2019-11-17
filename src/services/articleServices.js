import { promisify } from 'util';
import mysqlConnection from '../db';
import * as errMsg from "../utils/errorMsg";

const ArticleModelServices = {
    add: promisify(_add),
    get: promisify(_get)
}


async function _get({ id }, cb) {

    try {
        if (!id) { throw errMsg.INCOMPLETE_ARGUMENTS; };

        mysqlConnection.query(`
                SELECT * from articles 
                WHERE identifier='${id}'
        `, (err, rows, fields) => {
            if (err) return cb(errMsg._ERR(err));
            // console.log('[rows] get article------', rows);
            return cb(null, rows);
        });

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}


async function _add(article, cb) {
    const { image,
        url,
        dateCreated,
        datePublished,
        headline,
        name,
        description,
        identifier,
        keywords,
        author,
        publisher,
        blog,
        fetch_time,
        crawl_status
    } = article;
    // console.log('article========', article.blog_html.length );


    try {
        if (!image,
            !url,
            !dateCreated,
            !datePublished,
            !headline,
            !name,
            !description,
            !identifier,
            !keywords,
            !author,
            !publisher,
            !blog,
            !fetch_time,
            !crawl_status) {
            throw errMsg.INCOMPLETE_ARGUMENTS;
        }


        mysqlConnection.query(`
                INSERT INTO articles (image, url, dateCreated, datePublished, headline, name, description, identifier, keywords, author, publisher, blog, fetch_time, crawl_status) 
                VALUES ('${image}', '${url}', '${dateCreated}', '${datePublished}', '${headline}', '${name}', '${description}', '${identifier}', '${keywords}', '${author}', '${publisher}', '${blog}',  ${fetch_time}, '${crawl_status}' );
        `, (err, rows, fields) => {
            if (err) return cb(errMsg._ERR(err));
            console.log('rows: ', rows);
            return cb(null, rows);
        });

    } catch (err) {
        return cb(errMsg._ERR(err));
    }
}



export default ArticleModelServices;