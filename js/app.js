/**
 * CuteMD - Markdown 编辑器
 * 主应用脚本
 */

document.addEventListener('DOMContentLoaded', () => {
    // 初始内容
    const initialValue = `# CuteMD - 一款简洁优雅的 Markdown 编辑器

## 欢迎使用！

这是一个基于 Vditor 实现的在线 Markdown 编辑器，旨在提供一个专注、高效且美观的写作环境。

### 主要特性

- **亮/暗**双主题切换
- 动态文档**大纲**
- 支持丰富的 Markdown 语法
- 代码块高亮
- 数学公式 $E=mc^2$
- ✨ **AI 智能续写**和**智能摘要**
- ... 以及更多！

### 如何使用

1.  使用顶部的工具栏进行格式化操作。
2.  点击 **新建**、**打开** 或 **保存** 来管理您的文件。
3.  试试点击 **✨ 智能续写** 和 **✨ 智能摘要** 按钮来体验 AI 的魔力！

---

> "代码和文字一样，都是思想的表达。"

祝您使用愉快！
`;
    
    // 初始化 Vditor 编辑器
    const vditor = new Vditor('vditor', {
        height: '100%',
        mode: 'ir',
        theme: 'classic',
        value: initialValue,
        toolbar: [
            'emoji', 'headings', 'bold', 'italic', 'strike', 'link', '|',
            'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
            'quote', 'line', 'code', 'inline-code', 'insert-before', 'insert-after', '|',
            'table', 'undo', 'redo', '|',
            'edit-mode', 'content-theme', 'code-theme', 'export',
            {
                name: 'more',
                toolbar: [
                    'fullscreen',
                    'both',
                    'preview',
                    'info',
                    'help',
                ],
            },
        ],
        after: () => {
            updateOutline();
            // 根据系统偏好设置初始主题
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
            
            // 监听全屏事件
            setupFullscreenHandler();
        },
        input: () => {
            updateOutline();
        },
        blur: () => {
            updateOutline();
        }
    });
    
    // DOM 元素引用
    const fileNameEl = document.getElementById('fileName');
    const outlineContent = document.getElementById('outlineContent');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const outlineSidebar = document.getElementById('outlineSidebar');
    const outlineToggleBtn = document.getElementById('outlineToggleBtn');
    const outlineCloseBtn = document.getElementById('outlineCloseBtn');
    
    const newFileBtn = document.getElementById('newFileBtn');
    const openFileBtn = document.getElementById('openFileBtn');
    const saveFileBtn = document.getElementById('saveFileBtn');
    const fileInput = document.getElementById('fileInput');
    
    const continueBtn = document.getElementById('continueBtn');
    const summarizeBtn = document.getElementById('summarizeBtn');
    
    const aiModal = document.getElementById('aiModal');
    const aiModalTitle = document.getElementById('aiModalTitle');
    const aiModalContent = document.getElementById('aiModalContent');
    const aiModalCloseBtn = document.getElementById('aiModalCloseBtn');

    // 当前文件名（用于标题更新）
    let currentFileName = '未命名.md';

    /**
     * 更新浏览器标签页标题
     */
    function updateDocumentTitle(fileName) {
        document.title = `${fileName} - CuteMD`;
    }

    /**
     * 设置文件名
     */
    function setFileName(name) {
        currentFileName = name;
        fileNameEl.textContent = name;
        updateDocumentTitle(name);
    }

    /**
     * 文件名点击编辑功能
     */
    fileNameEl.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'file-name-input';
        input.value = currentFileName;
        
        // 替换元素
        fileNameEl.parentNode.replaceChild(input, fileNameEl);
        input.focus();
        input.select();
        
        // 处理输入完成
        const finishEditing = () => {
            let newName = input.value.trim();
            if (!newName) {
                newName = '未命名.md';
            } else if (!newName.endsWith('.md') && !newName.endsWith('.markdown')) {
                newName += '.md';
            }
            
            setFileName(newName);
            input.parentNode.replaceChild(fileNameEl, input);
        };
        
        input.addEventListener('blur', finishEditing);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishEditing();
            } else if (e.key === 'Escape') {
                input.value = currentFileName;
                finishEditing();
            }
        });
    });

    /**
     * 更新文档大纲
     */
    function updateOutline() {
        // 获取编辑器的 Markdown 内容
        const content = vditor.getValue();
        if (!content) {
            outlineContent.innerHTML = '<div class="outline-empty">暂无大纲</div>';
            return;
        }

        // 解析 Markdown 中的标题
        const lines = content.split('\n');
        const headings = [];
        
        lines.forEach((line, index) => {
            // 匹配标题（# 开头）
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                headings.push({
                    level: level,
                    text: text,
                    lineIndex: index
                });
            }
        });

        // 如果没有标题，显示空状态
        if (headings.length === 0) {
            outlineContent.innerHTML = '<div class="outline-empty">暂无大纲</div>';
            return;
        }

        // 生成大纲 HTML
        outlineContent.innerHTML = '';
        headings.forEach((heading, index) => {
            const item = document.createElement('div');
            item.className = 'outline-item';
            item.setAttribute('data-level', heading.level);
            item.textContent = heading.text;
            item.setAttribute('data-line', heading.lineIndex);
            
            // 添加点击事件
            item.addEventListener('click', () => {
                // 移除所有 active 类
                outlineContent.querySelectorAll('.outline-item').forEach(el => {
                    el.classList.remove('active');
                });
                // 添加 active 类到当前项
                item.classList.add('active');
                
                // 滚动到对应位置
                const editor = vditor.vditor.ir.element;
                const allHeadings = editor.querySelectorAll('h1, h2, h3, h4, h5, h6');
                if (allHeadings[index]) {
                    allHeadings[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
            
            outlineContent.appendChild(item);
        });
    }

    /**
     * 应用主题
     * @param {string} theme - 'light' 或 'dark'
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            vditor.setTheme('dark');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline-block';
        } else {
            document.body.classList.remove('dark-theme');
            vditor.setTheme('classic');
            sunIcon.style.display = 'inline-block';
            moonIcon.style.display = 'none';
        }
    }
    
    /**
     * 设置全屏处理程序 - 修复全屏退出问题
     */
    function setupFullscreenHandler() {
        // 监听全屏变化事件
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    function handleFullscreenChange() {
        const isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        
        // Vditor 会自动处理全屏状态，我们只需要确保 ESC 键可以退出
        if (!isFullscreen) {
            // 确保编辑器从全屏模式正确退出
            const vditorElement = document.getElementById('vditor');
            if (vditorElement) {
                vditorElement.classList.remove('vditor--fullscreen');
            }
        }
    }
    
    /**
     * 主题切换按钮
     */
    themeToggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
    });
    
    /**
     * 大纲位置切换（左/右）或重新打开
     */
    outlineToggleBtn.addEventListener('click', () => {
        // 如果大纲被隐藏，则重新打开
        if (outlineSidebar.classList.contains('hidden')) {
            outlineSidebar.classList.remove('hidden');
        } else {
            // 否则切换左右位置
            outlineSidebar.classList.toggle('right');
        }
    });
    
    /**
     * 隐藏大纲
     */
    outlineCloseBtn.addEventListener('click', () => {
        outlineSidebar.classList.add('hidden');
    });

    /**
     * 文件操作 - 新建
     */
    newFileBtn.addEventListener('click', () => {
        if (confirm('创建新文件将清空当前内容，是否继续？')) {
            vditor.setValue('');
            setFileName('未命名.md');
            updateOutline();
        }
    });

    /**
     * 文件操作 - 打开
     */
    openFileBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                vditor.setValue(e.target.result);
                setFileName(file.name);
                updateOutline();
            };
            reader.readAsText(file);
        }
        // 重置文件输入以允许再次打开同一文件
        event.target.value = '';
    });

    /**
     * 文件操作 - 保存
     */
    saveFileBtn.addEventListener('click', () => {
        const content = vditor.getValue();
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = currentFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // --- Gemini API Integration ---

    const API_KEY = ""; // 用户需要自己设置 API Key
    
    /**
     * 调用 Gemini API
     */
    async function callGeminiAPI(prompt, button) {
        // 检查 API Key
        if (!API_KEY || API_KEY.trim() === '') {
            alert('AI 功能需要配置 Gemini API Key。\n\n请在 js/app.js 文件中设置 API_KEY 变量。\n\n注意：Gemini API 在某些国家/地区可能不可用。');
            return null;
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`;
        
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loader"></span>';
        button.disabled = true;

        try {
            const payload = {
                contents: [{ parts: [{ text: prompt }] }],
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // 检查是否是区域限制错误
                if (response.status === 400 || response.status === 403) {
                    throw new Error('REGION_NOT_SUPPORTED');
                }
                
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                return candidate.content.parts[0].text;
            } else {
                throw new Error("No content generated or unexpected API response format.");
            }
        } catch (error) {
            console.error("Gemini API call failed:", error);
            
            if (error.message === 'REGION_NOT_SUPPORTED') {
                alert('❌ Gemini API 在您所在的国家/地区不可用。\n\nGemini API 目前仅在部分国家/地区提供服务。如果您在中国大陆，此功能暂时无法使用。\n\n您可以尝试：\n1. 使用 VPN 连接到支持的地区\n2. 等待 API 在您的地区开放');
            } else if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                alert('❌ 网络连接失败\n\n可能的原因：\n1. Gemini API 在您所在的国家/地区被限制\n2. 网络连接问题\n3. API Key 无效\n\n请检查您的网络连接和 API Key 设置。');
            } else {
                alert(`AI 功能调用失败：${error.message}\n\n请检查浏览器控制台获取更多信息。`);
            }
            return null;
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }

    /**
     * 智能续写功能
     */
    continueBtn.addEventListener('click', async () => {
        if (!vditor) return;
        const currentText = vditor.getValue();
        if (currentText.trim().length < 10) {
            alert("请输入至少 10 个字符的内容以便 AI 更好地理解上下文。");
            return;
        }
        
        const prompt = `You are a helpful writing assistant. Please continue writing the following text in a natural and coherent way, in the same language. Do not repeat the original text in your response. Here is the text:\n\n---\n\n${currentText}`;
        
        const generatedText = await callGeminiAPI(prompt, continueBtn);
        
        if (generatedText) {
            vditor.insertValue(`\n\n${generatedText}`);
        }
    });

    /**
     * 智能摘要功能
     */
    summarizeBtn.addEventListener('click', async () => {
        if (!vditor) return;
        const currentText = vditor.getValue();
        if (currentText.trim().length < 50) {
            alert("请输入至少 50 个字符的内容以便 AI 生成有意义的摘要。");
            return;
        }
        
        const prompt = `You are an expert summarizer. Please provide a concise summary of the following text in a few bullet points. The summary must be in the same language as the original text. Here is the text:\n\n---\n\n${currentText}`;
        
        const summary = await callGeminiAPI(prompt, summarizeBtn);
        
        if (summary) {
            // 使用 Vditor 的 markdown 解析器渲染摘要在 modal 中
            aiModalTitle.textContent = '✨ 智能摘要';
            Vditor.preview(aiModalContent, summary, {
                cdn: 'https://unpkg.com/vditor@3.10.4',
            });
            aiModal.style.display = 'flex';
        }
    });
    
    /**
     * 关闭 AI Modal
     */
    const closeAiModal = () => {
        aiModal.style.display = 'none';
        aiModalContent.innerHTML = '';
    };
    
    aiModalCloseBtn.addEventListener('click', closeAiModal);
    aiModal.addEventListener('click', (e) => {
        if (e.target === aiModal) {
            closeAiModal();
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S: 保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveFileBtn.click();
        }
        // Ctrl/Cmd + N: 新建
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            newFileBtn.click();
        }
        // Ctrl/Cmd + O: 打开
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            openFileBtn.click();
        }
    });

    // 初始化文件名和标题
    setFileName(currentFileName);
});
