# CuteMD - Markdown 编辑器

一款简洁优雅的在线 Markdown 编辑器，基于 [Vditor](https://github.com/Vanessa219/vditor) 构建。

## ✨ 特性

- 🎨 **双主题切换** - 支持亮色/暗色主题，自动适配系统偏好
- 📑 **动态大纲** - 实时生成文档大纲，支持平滑滚动定位
- ✍️ **即时渲染** - IR (Instant Rendering) 模式，所见即所得
- 🎯 **丰富工具栏** - 完整的 Markdown 编辑工具
- 💻 **代码高亮** - 支持多种编程语言的语法高亮
- 📐 **数学公式** - 支持 LaTeX 数学公式渲染
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 🚀 快速开始

### 在线使用

直接在浏览器中打开 `index.html` 文件即可使用。

### 本地部署

1. 克隆或下载此仓库

```bash
git clone https://github.com/yourusername/cuteMD.git
cd cuteMD
```

2. 使用本地服务器运行（推荐）

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 或使用 PHP
php -S localhost:8000
```

3. 在浏览器中访问 `http://localhost:8000`

## 📁 项目结构

```
cuteMD/
├── index.html          # 主 HTML 文件
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── app.js         # 应用脚本
└── README.md          # 项目说明
```

## 🎮 使用说明

### 工具栏功能

- **新建** (Ctrl+N) - 创建新文档
- **打开** (Ctrl+O) - 打开本地 Markdown 文件
- **保存** (Ctrl+S) - 保存当前文档
- **大纲切换** (Ctrl+\\) - 切换大纲侧边栏位置（左/右）
- **主题切换** - 切换亮色/暗色主题

### 编辑器功能

编辑器支持完整的 Markdown 语法，包括：

- 标题、粗体、斜体、删除线
- 链接、图片
- 列表（有序/无序/任务列表）
- 代码块和行内代码
- 引用、分隔线
- 表格
- 数学公式（使用 `$...$` 或 `$$...$$`）
- Emoji 表情

## 🛠️ 技术栈

- **Vditor** - Markdown 编辑器核心
- **原生 JavaScript** - 无框架依赖
- **CSS3** - 现代 CSS 特性和 CSS 变量
- **HTML5** - 语义化标签

## 📝 自定义

### 修改主题颜色

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #4a90e2;    /* 主色调 */
    --primary-hover: #357abd;    /* 主色调悬停 */
    /* ... 更多颜色变量 */
}
```

### 修改初始内容

编辑 `js/app.js` 中的 `initialValue` 变量：

```javascript
const initialValue = `# 你的标题\n\n你的内容...`;
```

### 自定义工具栏

编辑 `js/app.js` 中的 `toolbar` 配置：

```javascript
toolbar: [
    'emoji', 'headings', 'bold', 'italic',
    // 添加或移除工具栏按钮
]
```

## 📄 许可证

MIT License

## 🙏 致谢

- [Vditor](https://github.com/Vanessa219/vditor) - 优秀的 Markdown 编辑器
- [Feather Icons](https://feathericons.com/) - SVG 图标灵感来源

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

Made with ❤️ by CuteMD Team
