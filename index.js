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
                (function readDir(_dir) {
                    var _items = fs.readdirSync(_dir);
                    for (var i in _items) {
                        var _path = path.join(_dir, _items[i]),
                            _stat = fs.lstatSync(_path);
                        if (_stat.isDirectory()) {
                            readDir(_path);
                            if (iconDirRegExp.test(_items[i])) {
                                _iconDirList.push({
                                    src: _path,
                                    dest: _dir,
                                    fontname: _path.replace(/\//g, '\\').match(/static\\(.*)\\resource|static\/(.*)\/resource/)[1].replace(/\/|\\/g, '-')
                                });
                            }
                        }
                    }
                })(path.join(root, 'static'));
                return _iconDirList;
            })();


            // 生成字体文件
            for (var i in iconDirList) {
                var settings = {
                    src: iconDirList[i].src,
                    dest: iconDirList[i].dest,
                    fontname: iconDirList[i].fontname,
                    order: 'name',
                    startCodepoint: 0xe600,
                    descent: 0
                };
                if (i + 1 == iconDirList.length) {
                    settings.callback = function() {
                        console.log(' [SUCCESS] 完成 ' + iconDirList.length + ' 组字体文件的生成');
                    }
                }
                webfont.generateFonts(settings);
            };

        });
}