export const tag_search_url = 'https://medium.com/search/tags?q=';

export const open_url_by_tag = (tag) => {
    const base_url = 'https://medium.com/tag/';
    tag = tag.trim();
    tag = tag.replace(/\s/g, '');
    return base_url+tag;
};
