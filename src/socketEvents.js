import * as aTS from './utils/actionTypesSocket';

import ArticleController from './controllers/articleController';
const articleController = new ArticleController();

const socketevents = (socket) => {
    socket.on( aTS.SEARCH_TAG, (data) => {
        console.log(aTS.SEARCH_TAG , data);
        const {tag} = data;
        articleController.query_tag(socket, {tag});
    });


    socket.on( aTS.GET_ARTICLES , (data) => {
        console.log(aTS.GET_ARTICLES , data);
        const {tag} = data;
        articleController.open_by_tag(socket, {tag});
    });
}

export default socketevents;