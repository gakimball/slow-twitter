const config = require('../public/config.json')

const emptyFeed = {
  version: 'https://jsonfeed.org/version/1.1',
  title: 'Twitter Digest',
  description: 'An occasional dump of Twitter posts.',
  icon: `${config.origin}/icon.png`,
  favicon: `${config.origin}/icon.png`,
  language: 'en-US',
  home_page_url: `${config.origin}/`,
  feed_url: `${config.origin}/feed.json`,
  items: [],
  _last_id: '',
}

module.exports = emptyFeed
