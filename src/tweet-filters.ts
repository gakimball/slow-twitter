import { Status } from 'twitter-api-types'

/**
 * Check if `screenName` is the author of `tweet`, or the author of a quoted status within `tweet`.
 */
export const matchesUser = (screenName: string, tweet: Status) => {
  const name = screenName.slice(1) // Remove the @

  if (tweet.user.screen_name === name) {
    return true
  }

  if (tweet.retweeted_status?.user.screen_name === name) {
    return true
  }

  if (tweet.quoted_status?.user.screen_name === name) {
    return true
  }

  return false
}

/**
 * Check if `keyword` exists within the text of `tweet`
 */
export const matchesText = (keyword: string, tweet: Status) => {
  const searchQuery = keyword.toLowerCase()

  if (tweet.full_text?.toLowerCase().includes(searchQuery)) {
    return true
  }

  if (tweet.retweeted_status?.full_text?.toLowerCase().includes(searchQuery)) {
    return true
  }

  if (tweet.quoted_status?.full_text?.toLowerCase().includes(searchQuery)) {
    return true
  }

  // URLs within the status text use the `t.co` domain. We have to separately check each URL entity
  // to get the real domain, so it can be properly filtered
  if (tweet.entities.urls?.some(entity => entity.expanded_url?.toLowerCase().includes(searchQuery))) {
    return true
  }

  return false
}
