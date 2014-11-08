var request = require('request'),
    cheerio = require('cheerio');

function getVideosFromPlaylistUrl(url, callback) {
    request(url, function (err, response, body) {
        if (err) {
            callback(err);
            return;
        } else if (response.statusCode !== 200) {
            callback('Error ' + response.statusCode + body);
            return;
        }
        try {
            var $ = cheerio.load(body, {normalzeWhitespace: true});
            var playlistName = $('h3.playlist-title').text().trim();
            var links = $('.playlist-video.clearfix');
            var ytLinks = [];
            for (var i = 0; i < links.length; i++) {
                var link = 'https://www.youtube.com/' + links[i].attribs['href'];
                ytLinks.push(link);
            }
            callback(null, {
                title: playlistName,
                list: ytLinks
            });
        } catch (e) {
            callback(e);
        }
    });
}

module.exports = {
    getList: getVideosFromPlaylistUrl
};
