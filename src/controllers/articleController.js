import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";
import userActivityServices from '../services/userActivityServices';
import config from '../../config';
import {identifyUserFunc} from '../middlewares/identifyUser';

class ArticleController {

  async get_more_stories(socket, data) {
    const { tag, count, token } = data;
    let { fetched_ids } = data;
    console.log('data: ', data);
    // const token = data[config.TOKEN];

    if (!tag || !fetched_ids || !count) return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
      status: false,
      msg: "Invalid params"
    });
    if (!fetched_ids.length) fetched_ids = [];

    try {
      const user = await identifyUserFunc(token);
      console.log('user; ', user);
      await userActivityServices.set_user_activity({email : user.email, tag});


      const result = await crawlerServices.fetch_more_stories_list({ tag, count });
      // console.log('filtered links ', result );

      const {links, related_tags} = result;
      
      socket.emit(aTS.GET_RELATED_TAGS_SUCCESS, {related_tags});

      const filtered_links = links.filter(item => fetched_ids.indexOf(item.id) < 0);
      
      for (let i = 0; i < filtered_links.length; i++) {
        const article = await crawlerServices.crawl_article({ url: filtered_links[i].link, tag });
        // if(!article.err){
          socket.emit(aTS.FETCH_MORE_LINKS_SUCCESS, { article, tag });
        // }
      }

    } catch (err) {
      return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }



}
export default ArticleController;