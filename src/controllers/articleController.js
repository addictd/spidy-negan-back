import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";
import userActivityServices from '../services/userActivityServices';
import config from '../../config';
import { identifyUserFunc } from '../middlewares/identifyUser';

class ArticleController {

  async get_more_stories(socket, data) {
    const { tag, count, token } = data;
    let { fetched_ids } = data;
    // console.log('data: ', data);

    if (!tag || !fetched_ids || !count) return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    if (!fetched_ids.length) fetched_ids = [];

    try {
      const user = await identifyUserFunc(token);

      await userActivityServices.set_user_activity({ email: user.email, tag });

      const result = await crawlerServices.fetch_more_stories_list({ tag, count });

      const { links, related_tags } = result;

      socket.emit(aTS.FETCH_MORE_LINKS_SUCCESS, { links, tag });
      socket.emit(aTS.GET_RELATED_TAGS_SUCCESS, { related_tags, tag });

    } catch (err) {
      return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }



  async crawl_story(socket, data) {
    const { url } = data;

    if ( !url ) return socket.emit(aTS.CRAWL_STORY_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    try {

      const article = await crawlerServices.crawl_article({ url });
      socket.emit(aTS.CRAWL_STORY_SUCCESS, { article });

    } catch (err) {
      return socket.emit(aTS.CRAWL_STORY_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }



  async getResponse(socket, data) {
    const { id } = data;
    // console.log('fetch response: ', data);
    // const token = data[config.TOKEN];

    if (!id) return socket.emit(aTS.GET_RESPONSES_FAIL, {
      status: false,
      msg: "Invalid params"
    });


    try {

      const blog_response = await crawlerServices.fetch_response({ id });
      // console.log('blog response: ', blog_response );
      if (!blog_response) {
        throw "Unable to fetch responses.";
      }

      return socket.emit(aTS.GET_RESPONSES_SUCCESS, { blog_response });

    } catch (err) {
      return socket.emit(aTS.GET_RESPONSES_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }


}
export default ArticleController;