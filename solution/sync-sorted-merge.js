'use strict';

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources = [], printer) => {
  // logsDictionary is a key Value object, will handle keys and logs to prevent a forced search
  const logsDictionary = {};
  // searchCollection is an old-fashioned int array, we will use this array to sort the logs
  let searchCollection = [];

  /**
   * @function addLog
   * @description This function will add the logs to the logsDictionary & searchCollection, until the source stops returning logs.
   * @param  {LogSource} source This will contain the
   * @return {void}
   */
  function addLog(source) {
    // timeStamp used as key for logs at the logsDictionary
    const timeStamp = source.last.date.getTime();
    // source info is passed to logsDictionary
    logsDictionary[timeStamp] = source.last;
    // also searchCollection is populated only with the key (former timestamp)
    searchCollection = searchCollection.concat([timeStamp]);
    // check if the source has any remaining log
    const last = source.pop();
    if (last) {
      // In case that we get a log, we add the log using the same recursive function
      addLog(source);
    }
  }

  // Iterate over the logSource and get the logs using the addLog function
  logSources.forEach((logSource) => addLog(logSource));

  // Sort only once the search collection, remember that this collection only contain the timestamps from the logs
  searchCollection.sort();

  // Just iterate the already sorted searchCollection, and use the index (timestamp) as key from the logsDictionary to print the expected log
  let i = 0,
    len = searchCollection.length;
  while (i < len) {
    printer.print(logsDictionary[searchCollection[i]]);
    i++;
  }
  printer.done();
  return console.log('Sync sort complete.');
};
