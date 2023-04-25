# slow-twitter

> Read Twitter the boring way

A small service that will periodically grab your Twitter feed, and collect the most recent posts
into an entry in a [JSON Feed](https://www.jsonfeed.org/).

- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [License](#license)

## Setup

Eventually I'll put this on Docker Hub, but until then you can clone the repository and build the
Docker container.

## Configuration

Map a directory to `/usr/src/app/public` for use by the container. Inside the directory,
add `config.json`:

```json
{
  "origin": "http://localhost:8080",
  "twitter_api": {
    "consumer_key": "",
    "consumer_secret": "",
    "access_key": "",
    "access_secret": ""
  },
  "digests": [
    {
      "name": "Morning",
      "cron": "0 9 * * *"
    },
    {
      "name": "Evening",
      "cron": "0 20 * * *"
    }
  ]
}
```

Each digest has a `name` and runs on a schedule according to
[Cron](https://en.wikipedia.org/wiki/Cron) syntax. Each time a digest is created, it fetches every
tweet posted to your timeline since the last digest (up to a maximum of 200, the limit of
Twitter's API).

The config file also supports these optional settings:

- `mute`: an array of strings to filter out of each digest. Keywords starting with `@` will filter
  out retweets, quote tweets, and mentions of those users.
- `max_feed_items`: maximum number of items kept in the JSON Feed. When a new one is added over the
  limit, the oldest item is removed. The default value is 50.
- `frontend`: an alternate domain to use for Twitter links, e.g. `https://nitter.net`.

## Usage

Run the container to start the scheduler, and a server that serves the feed, available
at `/feed.json`. The first time you run the server, it will create an initial feed entry with the
last 50 posts on your timeline.

## Testing

There's a few scripts in the `test/` folder to mess around with various features:

```bash
# Print the JSON output of the Twitter API
node test/test-tweets.js > tweets.json

# Print the HTML output of the timeline
node test/test-html.js > timeline.html

# Generate a test digest feed (writes to `./public/feed.json`)
node test/test-digest.js
```

## To Do

- [x] Format RTs correctly
- [x] Auto-linkify text
- [x] Figure out RTs of RTs
- [x] Max number of entries in feed
- [x] Apply mute filters to links
- [x] Fix duplicate content for retweets
- [x] Expand URLs
- [x] Reverse order of posts (old → new)
- [x] Show/indicate multiple images?
- [x] Option for alternate frontend (e.g. Nitter)
- [x] Render RTs flat, not as blockquotes
- [x] Compress HTML
- [x] Format line breaks
- [ ] Add link previews
- [ ] URL filters not working?
- [ ] Handle videos
- [ ] Strip UTM
- [ ] Unicode issues (emoji don't display properly)

## License

MIT &copy; Geoff Kimball
