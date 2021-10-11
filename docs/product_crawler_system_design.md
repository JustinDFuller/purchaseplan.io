# Product Crawler System Design

The product crawler system retrieves product information from a web page.

- [ ] Means no unit test written.
- [x] Means a unit test is written. 

## Requirements

### Product

The crawler should retrieve data from the following:

- [ ] Schema.org JSON
- [ ] OpenGraph Meta Tags
- [ ] Standard HTML Meta tags
- [ ] Common HTML elements

Additional Requirements:
- [ ] The crawler should support custom parsers for common websites that do not follow the above conventions (like Amazon).
- [ ] For popular websites, the crawler should be extendable to support fetching product data from an API.

### Security

When retrieving data, the crawler should account for the following security requirements:

The system should account for robots.txt
- [ ] The system should not crawl sites where robots.txt forbids it.
- [ ] If a robots.txt file does not exist, the crawler should act without restriction.
- [ ] The crawler should cache the robots.txt file for 24 hours.
  - [ ] A missing robots.txt should only be re-fetched every 24 hours. 
- [ ] The crawler should continue to use a cached version of the file for non-404 errors (when trying to update the robots.txt)
- [ ] robots.txt files should be ignored if they are larger than 1 megabyte.

The system should not be usable for attacks on other systems.
- [ ] It should only retrieve an URL once each day.
- [ ] It should normalize URLs to reduce the possibility of duplicate requests.
  - [ ] It should lowercase URLs
  - [ ] It should remove extra spaces
  - [ ] It should remove common query parameters like `utm_source`.
- [ ] It should rate limit requests to 1 per second.
- [ ] There should be a way to globally disable requests to certain domains. (This may be requested by other companies.)
- [ ] It should timeout after 10 seconds.
  - [ ] After a timeout, it should not be able to retry for 60 seconds.

The system should only communicate over HTTPS, even if an HTTP protocol is requested by the user.

### Technical

When retrieving data, the crawler should account for the following technical requirements:

- [ ] The user agent should be versioned according to the current release.
- [ ] The crawler should store relevant data for each data type.
  - [ ] It should account for multiple entries for a given value. Ex. Multiple descriptions, multiple images.

## Implementation

### Data Structures

#### Type: Domain

| Property           | Type        | Description                                                                                                          | Example                  |
|--------------------|-------------|----------------------------------------------------------------------------------------------------------------------|--------------------------|
| Domain             | string      | The website domain                                                                                                   | purchaseplan.io          |
| Disabled           | boolean     | Provides a way to manually disable this domain.                                                                      | false                    |
| RobotsTxtAttempted | time.Time   | The last time the crawler attempted to fetch the robots.txt file.  This is used to limit requests to every 24 hours. | 2021-10-11T01:03:33.241Z |
| RobotsTxt          | []RobotsTxt | All of the robots.txt files retrieved for this file. Recent entries at end of array. Limit to 10 entries.                                                                | See RobotsTxt type.      |

### Type: RobotsTxt

| Property  | Type      | Description                                 | Example                         |
|-----------|-----------|---------------------------------------------|---------------------------------|
| Retrieved | time.Time | The time the robots.txt file was retrieved. | 2021-10-11T01:03:33.241Z        |
| Contents  | string    | The string contents of the robots.txt       | User-Agent: * Disallow: /*.json |

### Type: URL

| Property | Type   | Description               | Example                                 |
|----------|--------|---------------------------|-----------------------------------------|
| URL      | string | The normalized URL value. | https://purchaseplan.io/product/example |
