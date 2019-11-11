import * as aTS from './utils/actionTypesSocket';

import ArticleController from './controllers/articleController';
const articleController = new ArticleController();

const socketevents = (socket) => {

    socket.on( aTS.FETCH_MORE_LINKS , (data) => {
        console.log(aTS.FETCH_MORE_LINKS , data);
        const {tag, fetched_ids, count} = data;
        articleController.get_more_stories(socket, {tag, fetched_ids, count});
    });
}

export default socketevents;