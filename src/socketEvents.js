import * as aTS from './utils/actionTypesSocket';
import config from '../config';
import ArticleController from './controllers/articleController';
const articleController = new ArticleController();

const socketevents = (socket) => {

    socket.on( aTS.FETCH_MORE_LINKS , (data) => {
        // console.log(aTS.FETCH_MORE_LINKS , data);
        const {tag, count} = data;
        const token = data[config.TOKEN];
        articleController.get_more_stories(socket, {tag, count, token});
    });


    socket.on( aTS.CRAWL_STORY , (data) => {
        // console.log(aTS.CRAWL_STORY , data);
        const {url, tag, id} = data;
        articleController.crawl_story(socket, { url, tag , id});
    });


    socket.on( aTS.BLOG_HTML , (data) => {
        // console.log(aTS.GET_RESPONSES , data);
        const {url} = data;
        articleController.getBlogHtml(socket, { url });
    });

    socket.on( aTS.GET_RESPONSES , (data) => {
        // console.log(aTS.GET_RESPONSES , data);
        const {id} = data;
        articleController.getResponse(socket, { id });
    });
}

export default socketevents;