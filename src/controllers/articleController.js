import * as errMsg from "../utils/errorMsg";
import crawlerServices from '../services/crawlerServices';

class ArticleController {

  async get(req, res, next) {

    const articles = await crawlerServices.crawl_articles_from_home();
    console.log('articles===========', articles);
    return res.json({status : false, data : {}, msg : 'Api under construction.'});
  }

}
export default ArticleController;