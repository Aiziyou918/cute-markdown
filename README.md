# CuteMD - 智能 Markdown 编辑器

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vditor](https://img.shields.io/badge/Vditor-3.11.2-green.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.10-646CFF.svg)

**[🌐 在线体验](https://james-blog.top/cutemd/)** | **[📖 文档](https://github.com/your-username/cuteMD#readme)** | **[🐛 反馈问题](https://github.com/your-username/cuteMD/issues)**

</div>

一款简洁优雅的在线 Markdown 编辑器，基于 Vditor 构建，集成多种 AI 提供商支持，提供所见即所得的编辑体验。

![CuteMD Editor](https://via.placeholder.com/800x450/4A90E2/FFFFFF?text=CuteMD+Markdown+Editor)

> 💡 **提示**：这是一个纯前端应用，无需安装，打开即用！所有数据都保存在本地，完全保护你的隐私。
> 
> 🚀 **在线演示**：访问 [https://james-blog.top/cutemd/](https://james-blog.top/cutemd/) 立即体验！

## ✨ 特性

- 📝 **所见即所得** - 基于 Vditor，提供即时渲染预览
- 🤖 **AI 智能助手** - 支持智能续写、智能摘要等 AI 功能
- 🌐 **多 AI 提供商** - 支持 OpenAI、Claude、Gemini、DeepSeek 和自定义 API
- 🎨 **语法高亮** - 支持多种编程语言的代码高亮
- 📊 **图表支持** - 内置 Mermaid 图表、数学公式（KaTeX）、流程图等
- 📑 **智能大纲** - 自动生成文档大纲，快速导航
- 💾 **本地存储** - 自动保存编辑内容到浏览器
- 🌓 **主题切换** - 支持亮色/暗色主题
- ⌨️ **丰富快捷键** - 支持完整的键盘快捷键操作
- 📱 **响应式设计** - 完美适配各种屏幕尺寸
- 🚀 **纯前端应用** - 无需后端，即开即用

## 🚀 快速开始

### 在线使用

🌐 **在线体验**：访问 [https://james-blog.top/cutemd/](https://james-blog.top/cutemd/) 立即开始使用，无需安装！

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/Aiziyou918/cute-markdown.git
cd cuteMD
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

构建完成后，生成的文件在 `dist` 目录中。

## 📦 技术栈

- **编辑器**: [Vditor](https://github.com/Vanessa219/vditor) - 一款浏览器端的 Markdown 编辑器，支持所见即所得、即时渲染和分屏预览模式
- **AI 集成**: 
  - [OpenAI API](https://openai.com/) - GPT 系列模型
  - [Anthropic Claude](https://www.anthropic.com/) - Claude 系列模型
  - [Google Gemini](https://ai.google.dev/) - Gemini 系列模型
  - [DeepSeek](https://www.deepseek.com/) - DeepSeek 系列模型
  - 自定义 OpenAI 兼容 API
- **构建工具**: [Vite](https://vitejs.dev/) - 下一代前端构建工具

## 🎯 功能说明

### 文件操作

- **新建文件** - 清空编辑器，开始新的文档
- **打开文件** - 从本地读取 `.md`、`.markdown` 或 `.txt` 文件
- **保存文件** - 将当前内容保存为 Markdown 文件
- **自动保存** - 编辑内容自动保存到浏览器本地存储

### AI 智能功能

#### 智能续写
基于当前内容，AI 帮助你继续写作，自动补全段落和想法。

#### 智能摘要
自动分析整篇文档，生成简洁的内容摘要。

#### 配置 AI 提供商
点击工具栏的 ⚙️ 按钮配置 AI 设置：
1. 选择 AI 提供商（OpenAI / Claude / Gemini / DeepSeek / 自定义）
2. 输入对应的 API Key
3. 选择使用的模型
4. 保存设置

**获取 API Key：**
- **OpenAI**: 访问 [platform.openai.com](https://platform.openai.com/api-keys)
- **Claude**: 访问 [console.anthropic.com](https://console.anthropic.com/)
- **Gemini**: 访问 [ai.google.dev](https://ai.google.dev/)
- **DeepSeek**: 访问 [platform.deepseek.com](https://platform.deepseek.com/)

> 🔒 **隐私保护**：API Key 仅保存在浏览器本地存储中，不会上传到任何服务器。

### Markdown 编辑

Vditor 提供三种编辑模式：
- **所见即所得模式**（WYSIWYG）- 默认模式，像使用 Word 一样编辑
- **即时渲染模式**（IR）- 输入 Markdown 语法即时转换
- **分屏预览模式**（SV）- 左侧编辑，右侧预览

支持完整的 Markdown 语法：
- 标题、段落、引用
- 列表（有序/无序/任务列表）
- 代码块（支持语法高亮）
- 链接、图片
- 表格
- 数学公式（KaTeX）
- Mermaid 图表
- 分隔线、强调（粗体/斜体/删除线）

### 快捷键支持

CuteMD 支持丰富的键盘快捷键，包括：
- 文件操作：`Ctrl+N`（新建）、`Ctrl+O`（打开）、`Ctrl+S`（保存）
- 格式化：`Ctrl+B`（粗体）、`Ctrl+I`（斜体）、`Ctrl+K`（链接）
- 标题：`Ctrl+1~6`（H1~H6）
- 视图：`Ctrl+Shift+L`（切换大纲）、`F11`（全屏）

完整的快捷键列表请查看 [SHORTCUTS.md](SHORTCUTS.md)。

### 大纲导航

编辑器会自动分析文档结构，生成大纲目录：
- 点击大纲项快速跳转到对应位置
- 点击工具栏的大纲按钮显示/隐藏大纲侧边栏

### 主题切换

点击工具栏的 ☀️/🌙 按钮在亮色和暗色主题之间切换。

## 📄 项目结构

```
cuteMD/
├── index.html          # 主 HTML 文件
├── css/
│   └── style.css      # 自定义样式
├── js/
│   └── app.js         # 应用主逻辑（编辑器、AI 功能、存储等）
├── dist/              # Vite 构建输出目录
├── node_modules/      # 依赖包
├── package.json       # 项目配置
├── vite.config.js     # Vite 构建配置
├── LICENSE            # MIT 许可证
├── README.md          # 本文档
└── SHORTCUTS.md       # 快捷键指南
```

## 💡 使用技巧

1. **快速开始写作**
   - 按 `Ctrl+N` 新建文档
   - 直接开始输入，内容会自动保存

2. **充分利用 AI 功能**
   - 写完一段后，使用"智能续写"让 AI 帮你继续
   - 完成长文档后，使用"智能摘要"快速生成总结

3. **快捷键是你的好朋友**
   - `Ctrl+B` 快速加粗文本
   - `Ctrl+K` 快速插入链接
   - `F11` 进入全屏专注模式

4. **大纲导航提高效率**
   - 对于长文档，使用大纲快速跳转
   - 大纲会自动根据标题层级生成

5. **Markdown 语法提示**
   - 输入 `---` 后回车创建分隔线
   - 输入 `- [ ]` 创建任务列表
   - 输入 ` ``` ` 创建代码块

## ❓ 常见问题

**Q: 我的内容会丢失吗？**  
A: 不会！编辑器会自动保存内容到浏览器本地存储。但建议定期使用"保存"按钮导出重要文档。

**Q: AI 功能需要付费吗？**  
A: CuteMD 本身完全免费，但 AI 功能需要各提供商的 API Key，这些服务可能需要付费。推荐使用 Google Gemini，它提供免费配额。

**Q: 支持导出为 PDF 吗？**  
A: 当前版本导出为 `.md` 文件。你可以使用浏览器的"打印"功能（Ctrl+P）将预览内容导出为 PDF。

**Q: 可以插入图片吗？**  
A: 可以！支持插入网络图片链接或使用 Base64 编码的图片。工具栏有图片插入按钮。

**Q: 清除浏览器数据会丢失内容吗？**  
A: 是的，清除浏览器缓存/本地存储会删除自动保存的内容。建议定期导出重要文档。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢以下优秀的开源项目：

- [Vditor](https://github.com/Vanessa219/vditor) - 强大的 Markdown 编辑器
- [Vite](https://vitejs.dev/) - 快速的前端构建工具

## 📞 反馈与支持

遇到问题或有好的建议？欢迎：
- 📋 提交 [Issue](https://github.com/your-username/cuteMD/issues)
- 💬 发起 [Discussion](https://github.com/your-username/cuteMD/discussions)
- ⭐ 给项目点个 Star 支持我们！

## 🔗 相关链接

- 🌐 **在线演示**: [https://james-blog.top/cutemd/](https://james-blog.top/cutemd/)
- 📦 **GitHub 仓库**: [https://github.com/Aiziyou918/cute-markdown](https://github.com/Aiziyou918/cute-markdown)
- 📖 **快捷键文档**: [SHORTCUTS.md](SHORTCUTS.md)

---

<div align="center">

Made with ❤️ by CuteMD Contributors

**[⬆ 回到顶部](#cutemd---智能-markdown-编辑器)**

</div>
