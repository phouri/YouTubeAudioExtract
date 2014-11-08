var listsScraper = require('../lib/scraper'),
    ytManager = require('../lib/ytManager'),
    mkdirp = require('mkdirp'),
    async = require('async');

function onUrl(url, callback) {
    console.log(url);
    if (url.indexOf('list=') !== -1) {
        listsScraper.getList(url, function(err, playlist) {
            if (err) {
                callback(err);
                return;
            }
            mkdirp(playlist.title, function(err) {
                if (err) {
                    callback(err);
                }
                var parallelFunctions = {};
                playlist.list.forEach(function(url) {
                    parallelFunctions[url] =  function(cb) {
                        ytManager.download(url, cb, {dir: playlist.title});
                    }
                });
                async.parallelLimit(parallelFunctions, 3, function(err) {
                    if (!err) {
                        callback('Finished saving list ' + playlist.title);
                    }
                });
            });
        });
    } else {
        ytManager.download(url, callback);
    }
}

module.exports = {
    onUrl: onUrl
};