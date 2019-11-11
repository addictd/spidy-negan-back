import * as errMsg from "../utils/errorMsg";
import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";
import { link } from "fs";

class ArticleController {

  async query_tag(socket, data) {
    const { tag } = data;
    if (!tag) return socket.emit(aTS.SEARCH_TAG_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    try {
      const available_tags = await crawlerServices.query_tag({ tag });
      // console.log('availabe tag: ', available_tags );
      return socket.emit(aTS.SEARCH_TAG_SUCCESS, { tags: available_tags });

    } catch (err) {
      return socket.emit(aTS.SEARCH_TAG_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }


  async open_by_tag(socket, data) {
    const { tag } = data;
    if (!tag) return socket.emit(aTS.GET_ARTICLES_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    try {
      const links = await crawlerServices.open_by_tag({tag});
      console.log('links: ', links);
      
      for(let i=0; i< links.length; i++){
        console.log('[run] ', i);
        const article = await crawlerServices.crawl_article({url : links[i]});
        socket.emit(aTS.GET_ARTICLES_SUCCESS, {article});
      }

    } catch (err) {
      return socket.emit(aTS.GET_ARTICLES_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

  }


}
export default ArticleController;