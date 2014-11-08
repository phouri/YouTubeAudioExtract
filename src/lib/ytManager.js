
/**
 * Created by pinha_000 on 11/8/14.
 */

var ytdl = require('ytdl-core'),
    ffmpeg = require('fluent-ffmpeg'),
    sanitizeFile = require('sanitize-filename'),
    path = require('path');

function getInfo(url, callback) {
    ytdl.getInfo(url, function(err, info) {
        callback(err,info);
    });
}

function downloadSong(url, callback, options) {
    if (!callback) {
        callback = function() {};
    }
    options = options || {};
    getInfo(url, function(err, info) {
        var stream = ytdl(url);
        var mp3Path = info.title;
        var length = info.length_seconds;
        mp3Path = sanitizeFile(mp3Path) + '.mp3';
        if (options.dir) {
            mp3Path = path.join(options.dir, mp3Path);
        }
        console.log('Starting downloading ', info.title);
        var now = Date.now();
        new ffmpeg({source: stream}).audioBitrate(192).audioChannels(2).noVideo().outputFormat('mp3')
            .on('error', function(err) {
                console.log('Error converting', err);
                callback(err);
            })
            .on('progress', function(progress) {
                var timemark = progress.timemark;
                var time = timemark.split(':');
                var seconds = time[0]*60*60 + time[1]*60 + time[2].split('.')[0];
                console.log(info.title + ' - ' + Number((seconds/length).toFixed(1))+ '%');
            })
            .on('end', function() {
                console.log('Finished saving ' + info.title, 'Took:', Math.floor((Date.now() - now)/1000), 'seconds');
                callback(null, mp3Path);
            })
            .save(mp3Path);
    });
}

module.exports = {
    getInfo: getInfo,
    download: downloadSong
};