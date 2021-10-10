# Product Crawler System Design

The product crawler system retrieves product information from a web page.

## Product Requirements

The crawler should retrieve data from the following:

- Schema.org JSON
- OpenGraph Meta Tags
- Standard HTML Meta tags
- Common HTML elements

Additionally, the crawler should support custom parsers for common websites that do not follow the above conventions (like Amazon).

Additionally, for popular websites, the crawler should be extendable to support fetching product data from an API.

## Security Requirements

- The system should not crawl sites where robots.txt forbids it.
- If a robots.txt file does not exist, the crawler should act without restriction.
- The crawler should cache the robots.txt file for 24 hours.
- The crawler should continue to use a cached version of the file for non-404 errors (when trying to update the robots.txt)

## Technical Requirements

- The user agent should be versioned according to the current release.
