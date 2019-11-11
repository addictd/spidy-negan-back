import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";

class ArticleController {

  // async query_tag(socket, data) {
  //   const { tag } = data;
  //   if (!tag) return socket.emit(aTS.GET_STORIES_FAIL, {
  //     status: false,
  //     msg: "Invalid params"
  //   });

  //   try {
  //     const available_tags = await crawlerServices.query_tag({ tag });
  //     // console.log('availabe tag: ', available_tags );
  //     return socket.emit(aTS.GET_STORIES_SUCCESS, { tags: available_tags });

  //   } catch (err) {
  //     return socket.emit(aTS.GET_STORIES_FAIL, {
  //       status: false,
  //       msg: err.toString()
  //     });
  //   }

  // }


  async get_more_stories(socket, data) {
    const { tag, count } = data;
    let { fetched_ids } = data;

    if (!tag || !fetched_ids || !count) return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
      status: false,
      msg: "Invalid params"
    });
    if (!fetched_ids.length) fetched_ids = [];

    try {

      const links = await crawlerServices.fetch_more_stories_list({ tag, count });
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