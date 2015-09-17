### 如何使用 fis-command-baike-webfont？
1. npm 全局安装 fis-command-baike-webfont 插件
2. 在 AI 中制作单个矢量图标，固定比例调整缩放另图标较宽边为 300 px，画布尺寸与图标上下边界对齐，注意需保证是封闭的路径，不能是单路径描边
3. 将文件保存为 svg 格式
4. 如果你打算在 /static/demo/demo.less 中定义 font-icon，建议将单个 svg 储存于 /static/demo/resource/font/icon/ 目录下，并以 1-example.svg 的方式命名（前缀的数字是为了保证在之后你需要加入其他图标时，并不妨碍你早先定义的图标的顺序，防止图标与字符编码对应错乱的问题）
5. 命令行回到当前模块根目录下，执行 baike-webfont 命令，无需任何参数
6. 待执行完成， /static/demo/resource/font/ 下就为你制作好各浏览器所需要的字体文件了，值得注意的是，其中 woff2 格式的字体文件实际是生成失败的，woff2 作为新一代字体标准比 woff 有明显的优势（大小减小 30%），但浏览器支持度低，具体见 caniuse。由于没有相应的 npm 模块，而 Google 提供的方案也在开发中且不支持 windows，目前只能通过一些在线网站完成字体生成 everythingfonts - https://everythingfonts.com/
7. 完成字体制作就可以使用 fis-parser-baike-less 所提供的 mixin 语法进行每个 icon 的定义了