'use strict';

exports.name = 'baike-webfont';
exports.usage = '[options]';
exports.desc = 'fis webfont generator, support svg, eot, ttf, woff, woff2';

var path = require('path');
var fs = require('fs');
var exec = require("child_process").exec;
var exists = fs.existsSync;
var webfont = require("./lib/webfont");


exports.register = function(commander) {
    commander
        .option('-n,--fontname <fontname>', 'set fontname, default `iconfont`')
        .option('-s,--src  <srcdir>', 'set svg icon dir')
        .option('-d,--dest <destdir>', 'set font dir')
        .option('-r,--root <path>', 'set project root')
        .action(function() {
            var args = [].slice.call(arguments);
            var options = args.pop();
            var root = path.join(process.cwd(), options.root || "");
            var filepath = path.resolve(root, 'fis-conf.js');

            if (exists(filepath)) {
                require(filepath);
            } else {
                fis.log.error('请在模块根目录下运行 fis-command-baike-webfont');
                return;
            }

            // 遍历 icon/ 目录，获取需要导出字体文件的字体目录
            var iconDirList = (function getIconDirList() {
                var iconDirRegExp = new RegExp(/^icon$/),
                    _iconDirList = [];
                (function readDir(dir) {
                    var items = fs.readdirSync(dir);
                    for (var i in items) {
                        var path = dir + '/' + items[i],
                            stat = fs.lstatSync(path);
                        if (stat.isDirectory()) {
                            readDir(path);
                            if (iconDirRegExp.test(items[i])) {
                                _iconDirList.push({
                                    src: path,
                                    dest: dir,
                                    fontname: ((fis.config.get('namespace') + '-') || '') + path.match(/^static\/(.*)\/resource/)[1]
                                });
                            }
                        }
                    }
                })('static');
                return _iconDirList;
            })();


            // 生成字体文件
            for (var i in iconDirList) {
                webfont.generateFonts({
                    src: iconDirList[i].src,
                    dest: iconDirList[i].dest,
                    fontname: iconDirList[i].fontname,
                    order: 'name',
                    startCodepoint: 0xe600,
                    descent: 0
                })
            };

            console.log(' [SUCCESS] 完成 ' + iconDirList.length + ' 个字体文件的生成');
        });
}