import * as aTS from './utils/actionTypesSocket';
import config from '../config';
import ArticleController from './controllers/articleController';
const articleController = new ArticleController();

const socketevents = (socket) => {

    socket.on( aTS.FETCH_MORE_LINKS , (data) => {
        console.log(aTS.FETCH_MORE_LINKS , data);
        const {tag, fetched_ids, count} = data;
        const token = data[config.TOKEN];
        articleController.get_more_stories(socket, {tag, fetched_ids, count, token});
    });

    socket.on( aTS.GET_RESPONSES , (data) => {
        console.log(aTS.GET_RESPONSES , data);
        const {id} = data;
        // const token = data[config.TOKEN];
        articleController.getResponse(socket, { id });
    });
}

export default socketevents;