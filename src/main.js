var ytdl = require('ytdl-core'),
    fs = require('fs'),
    ffmpeg = require('fluent-ffmpeg'),
    util = require('util'),
    minimist = require('minimist'),
    sanitizeFile = require('sanitize-filename');

var args = minimist(process.argv.slice(2));

if (!args.url) {
    console.error('No url specified');
    return;
}
ytdl.getInfo(args.url, function(err, info) {
    if (err) {
        console.error('Error retrieving video info', err);
        return;
    }
    onInfoReceived(info);
});

function onInfoReceived(info) {
    var stream = ytdl(args.url);
    var mp3Path = info.title;
    var length = info.length_seconds;
    mp3Path = sanitizeFile(mp3Path) + '.mp3';
    console.log('Starting downloading ', info.title);
    var now = Date.now();
    new ffmpeg({source: stream}).audioBitrate(192).audioChannels(2).noVideo().outputFormat('mp3')
        .on('error', function(err) {
            console.log('Error converting', err);
        })
        .on('progress', function(progress) {
            var timemark = progress.timemark;
            var time = timemark.split(':');
            var seconds = time[0]*60*60 + time[1]*60 + time[2].split('.')[0];
            console.log(Number((seconds/length).toFixed(1))+ '%');
        })
        .on('end', function() {
            console.log('Finished saving mp3', 'Took:', (Date.now() - now)/1000, 'seconds');
        })
        .save(mp3Path);
}


