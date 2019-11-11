import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";

class ArticleController {



  async get_more_stories(socket, data) {
    const { tag, count } = data;
    let { fetched_ids } = data;

    if (!tag || !fetched_ids || !count) return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
      status: false,
      msg: "Invalid params"
    });
    if (!fetched_ids.length) fetched_ids = [];

    try {

      const result = await crawlerServices.fetch_more_stories_list({ tag, count });
      const {links, related_tags} = result;
      
      socket.emit(aTS.GET_RELATED_TAGS_SUCCESS, {related_tags});

      const filtered_links = links.filter(item => fetched_ids.indexOf(item.id) < 0);
      
      for (let i = 0; i < filtered_links.length; i++) {
        const article = await crawlerServices.crawl_article({ url: filtered_links[i].link });
        socket.emit(aTS.FETCH_MORE_LINKS_SUCCESS, { article });

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