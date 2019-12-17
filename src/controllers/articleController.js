import crawlerServices from '../services/crawlerServices';
import * as aTS from "../utils/actionTypesSocket";
import userActivityServices from '../services/userActivityServices';
import articleServices from '../services/articleServices';
import config from '../../config';
import { identifyUserFunc } from '../middlewares/identifyUser';


class ArticleController {

  async get_more_stories(socket, data) {
    const { tag, count, token } = data;
    // console.log('data: ', data);

    if (!tag || !count) return socket.emit(aTS.FETCH_MORE_LINKS_FAIL, {
      status: false,
      msg: "Invalid params"
    });

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
    const { url, tag, id } = data;

    if (!url || !tag || !id) return socket.emit(aTS.CRAWL_STORY_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    try {

      try {
        const article = await articleServices.get({ id });
        if (!article.length) throw "Article not in db.";
        return socket.emit(aTS.CRAWL_STORY_SUCCESS, { article: article[0], tag });
      } catch (err) {
        // console.log(err);
      }

      var article = await crawlerServices.crawl_article({ url });

      if (article.image[0]) { article.image = article.image[0]; };

      article.keywords = article.keywords
        .filter(item => {
          if (item.split(":")[0] === 'Tag') return true;
          return false;
        })
        .map(tag => tag.split(':')[1]).join(',');

      article.author = article.author.name;
      article.publisher = article.publisher.name;

      socket.emit(aTS.CRAWL_STORY_SUCCESS, { article, tag });


    } catch (err) {
      return socket.emit(aTS.CRAWL_STORY_FAIL, {
        status: false,
        msg: err.toString()
      });
    }

    if (article.crawl_status === 'success') {  //save to db
      this.saveToDb(article);
    }
  }


  async getBlogHtml(socket, data) {
    const { url } = data;

    if (!url) return socket.emit(aTS.BLOG_HTML_FAIL, {
      status: false,
      msg: "Invalid params"
    });

    try {

      const { blog_html, blog_style } = await crawlerServices.fetch_blog_html({ url });
      if (!blog_html) {
        throw "Unable to fetch html.";
      }

      return socket.emit(aTS.BLOG_HTML_SUCCESS, { blog_html, blog_style });

    } catch (err) {
      return socket.emit(aTS.BLOG_HTML_FAIL, {
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


  async saveToDb(article) {
    try {
      if (!article) {
        throw "Unable to save to db. Argument error."
      }
      await articleServices.add(article);

    } catch (err) {
      console.log('Failed to save story.');
    }
  }

}
export default ArticleController;