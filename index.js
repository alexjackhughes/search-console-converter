// Just requiring the data
const data = require("./data.js");
const convertSearchConsoleResults = require("./convertSearchConsoleResults");

// General information about the whole site, so page is connect to overall site.
// Could also include auditId etc.
const general = {
  userId: "123",
  domain: "darya.com",
  queryDate: "2012-12-14"
};

// This is the main function call - once you've done the query on Google Search Console
// Pass the data and call this function:
const pages = convertSearchConsoleResults(data, general);

// Hopefully, this will include data in correct format and
// pages should also include totals.
console.log(pages[0]);
