const { calculateTotal, formatKeyphraseTotal } = require("./calculateTotals");

/**
 * This is the master function.
 *
 * @param searchResults Data returned from the search console query.
 * @param general Object containing site-specific info: (userId, domain, queryDate).
 * @return pages And array of all the pages to be saved in database.
 *
 * Basically, the Search Console results Google provides you with aren't sorted,
 * so to use them we need to sort them.
 *
 * Manipulates the search console results so that data that concerns the same page
 * is added into the same object, and the same keyphrases for that page
 * are also added into a master 'keyphrase' - for each page.
 */
module.exports = (searchResults, general) => {
  const pages = [];

  searchResults.rows.map(result => {
    addPage(pages, result, general);
  });

  return addTotalsToPages(formatPages(pages));
};

/**
 * This function will manipulate the page data to include totals.
 *
 * Basically, we want to create a total clicks for each unique keyphrase,
 * and a total of totals for all those keyphrases on a page.
 */
function addTotalsToPages(pages) {
  // Map through each page and create a total
  // for every unique keyword.
  pages.map(page => {
    page.keyphrases.map(keyphrase => {
      keyphrase.total = formatKeyphraseTotal(calculateTotal(keyphrase.data));
    });

    // Then create a total of all the totals for page.
    const totals = page.keyphrases.map(keyphrase => {
      return keyphrase.total;
    });

    page.total = formatKeyphraseTotal(calculateTotal(totals));
  });

  return pages;
}

/**
 * Sorts the pages, so that each unique page is added
 * to the pages array.
 *
 * If the page has already been added on a page, then we add that
 * search result data underneath that existing page.
 */
function addPage(pages, data, general) {
  // Returns boolean depending on whether page already exists based on URL
  const found = pages.some(el => el.page === data.keys[0]);

  // If it doesn't exist, create a new page entry in pages
  if (!found) {
    pages.push({
      ...general,
      page: data.keys[0],
      data: [data]
    });

    // If it does exist, we just update that page entry
  } else {
    pages.map(page => {
      if (page.page === data.keys[0]) {
        page.data.push(data);
      }
    });
  }
}

/**
 * Sorts the keyphrases, so that each unique keyphrase is added
 * to the keyphrases array.
 *
 * If the keyphrase has already been added on a keyphrase, then we add that
 * search result data underneath that existing keyphrase.
 */
function addKeyphrases(result, sorted) {
  // Returns a boolean, depending on whether keyphrase already exists
  const found = sorted.some(el => el.keyphrase === result.keyphrase);

  // If it doesn't exist, create a new keyphrase entry in pages
  if (!found) {
    sorted.push({ keyphrase: result.keyphrase, data: [result] });

    // If it does exist, we just update that keyphrase entry
  } else {
    sorted.map(page => {
      if (page.keyphrase === result.keyphrase) {
        page.data.push(result);
      }
    });
  }
}

/**
 * Formats the Search Console results, so that
 * unique keyphrases are added together into the same place,
 * and also format the keyphrases into the right schema structure.
 */
function formatKeyphrases(pageResults) {
  const sorted = [];

  pageResults.map(pageResult => {
    if (pageResult.keys) {
      pageResult.keyphrase = pageResult.keys[1];
      pageResult.country = pageResult.keys[2];
      pageResult.device = pageResult.keys[3];
    }

    addKeyphrases(pageResult, sorted);
  });

  return sorted;
}

/**
 * Takes an array of pages, and cleans the data
 * of all fields that are repeated elsewhere in data, so
 * that data is ready to be saved in our database.
 */
function formatPages(pages) {
  const formattedPages = [...pages];

  formattedPages.map(page => {
    page.keyphrases = formatKeyphrases(page.data);
    delete page.data;

    page.keyphrases.map(keyphrase => {
      delete keyphrase.keys;

      keyphrase.data.map(data => {
        delete data.keys;
        delete data.keyphrase;
      });
    });
  });

  return formattedPages;
}
