/**
 * This is the query for Search Engine console,
 * in case anyone wants to implement it whilst I'm away.
 */
function execute() {
  return gapi.client.webmasters.searchanalytics.query({
    siteUrl: "url-of-the-site.com",
    resource: {
      startDate: "2018-02-01",
      endDate: "2018-03-30",
      dimensions: ["page", "query", "country", "device"],
      searchType: "web"
    }
  });
}
