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
    
    const aiSettingsBtn = document.getElementById('aiSettingsBtn');
    const aiSettingsModal = document.getElementById('aiSettingsModal');
    const aiSettingsCloseBtn = document.getElementById('aiSettingsCloseBtn');
    const saveAISettings = document.getElementById('saveAISettings');
    const clearAISettings = document.getElementById('clearAISettings');

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

    // --- AI Configuration & Integration ---
    
    /**
     * AI 配置管理
     */
    const AIConfig = {
        storageKey: 'cutemd_ai_config',
        
        // 获取配置
        get() {
            const config = localStorage.getItem(this.storageKey);
            return config ? JSON.parse(config) : {
                provider: 'gemini',
                openai: { key: '', model: 'gpt-3.5-turbo', endpoint: '' },
                anthropic: { key: '', model: 'claude-3-5-sonnet-20241022' },
                gemini: { key: '', model: 'gemini-2.0-flash-exp' },
                deepseek: { key: '', model: 'deepseek-chat' },
                custom: { endpoint: '', key: '', model: '' }
            };
        },
        
        // 保存配置
        save(config) {
            localStorage.setItem(this.storageKey, JSON.stringify(config));
        },
        
        // 清除配置
        clear() {
            localStorage.removeItem(this.storageKey);
        }
    };
    
    /**
     * 加载设置到 UI
     */
    function loadAISettingsToUI() {
        const config = AIConfig.get();
        
        // 设置提供商
        document.querySelector(`input[name="aiProvider"][value="${config.provider}"]`).checked = true;
        showProviderSettings(config.provider);
        
        // 加载各个提供商的设置
        document.getElementById('openaiKey').value = config.openai.key || '';
        document.getElementById('openaiModel').value = config.openai.model || 'gpt-3.5-turbo';
        document.getElementById('openaiEndpoint').value = config.openai.endpoint || '';
        
        document.getElementById('anthropicKey').value = config.anthropic.key || '';
        document.getElementById('anthropicModel').value = config.anthropic.model || 'claude-3-5-sonnet-20241022';
        
        document.getElementById('geminiKey').value = config.gemini.key || '';
        document.getElementById('geminiModel').value = config.gemini.model || 'gemini-2.0-flash-exp';
        
        document.getElementById('deepseekKey').value = config.deepseek.key || '';
        document.getElementById('deepseekModel').value = config.deepseek.model || 'deepseek-chat';
        
        document.getElementById('customEndpoint').value = config.custom.endpoint || '';
        document.getElementById('customKey').value = config.custom.key || '';
        document.getElementById('customModel').value = config.custom.model || '';
    }
    
    /**
     * 显示/隐藏提供商设置
     */
    function showProviderSettings(provider) {
        document.getElementById('openaiSettings').style.display = provider === 'openai' ? 'block' : 'none';
        document.getElementById('anthropicSettings').style.display = provider === 'anthropic' ? 'block' : 'none';
        document.getElementById('geminiSettings').style.display = provider === 'gemini' ? 'block' : 'none';
        document.getElementById('deepseekSettings').style.display = provider === 'deepseek' ? 'block' : 'none';
        document.getElementById('customSettings').style.display = provider === 'custom' ? 'block' : 'none';
    }
    
    /**
     * 打开 AI 设置
     */
    aiSettingsBtn.addEventListener('click', () => {
        loadAISettingsToUI();
        aiSettingsModal.style.display = 'flex';
    });
    
    /**
     * 关闭 AI 设置
     */
    const closeAISettingsModal = () => {
        aiSettingsModal.style.display = 'none';
    };
    
    aiSettingsCloseBtn.addEventListener('click', closeAISettingsModal);
    aiSettingsModal.addEventListener('click', (e) => {
        if (e.target === aiSettingsModal) {
            closeAISettingsModal();
        }
    });
    
    /**
     * 提供商切换
     */
    document.querySelectorAll('input[name="aiProvider"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            showProviderSettings(e.target.value);
        });
    });
    
    /**
     * 保存 AI 设置
     */
    saveAISettings.addEventListener('click', () => {
        const provider = document.querySelector('input[name="aiProvider"]:checked').value;
        
        const config = {
            provider,
            openai: {
                key: document.getElementById('openaiKey').value.trim(),
                model: document.getElementById('openaiModel').value,
                endpoint: document.getElementById('openaiEndpoint').value.trim()
            },
            anthropic: {
                key: document.getElementById('anthropicKey').value.trim(),
                model: document.getElementById('anthropicModel').value
            },
            gemini: {
                key: document.getElementById('geminiKey').value.trim(),
                model: document.getElementById('geminiModel').value
            },
            deepseek: {
                key: document.getElementById('deepseekKey').value.trim(),
                model: document.getElementById('deepseekModel').value
            },
            custom: {
                endpoint: document.getElementById('customEndpoint').value.trim(),
                key: document.getElementById('customKey').value.trim(),
                model: document.getElementById('customModel').value.trim()
            }
        };
        
        // 验证当前提供商是否配置了必要信息
        let valid = true;
        switch(provider) {
            case 'openai':
                if (!config.openai.key) {
                    alert('请输入 OpenAI API Key');
                    valid = false;
                }
                break;
            case 'anthropic':
                if (!config.anthropic.key) {
                    alert('请输入 Anthropic API Key');
                    valid = false;
                }
                break;
            case 'gemini':
                if (!config.gemini.key) {
                    alert('请输入 Gemini API Key');
                    valid = false;
                }
                break;
            case 'deepseek':
                if (!config.deepseek.key) {
                    alert('请输入 DeepSeek API Key');
                    valid = false;
                }
                break;
            case 'custom':
                if (!config.custom.endpoint || !config.custom.key || !config.custom.model) {
                    alert('请完整填写自定义 API 配置');
                    valid = false;
                }
                break;
        }
        
        if (valid) {
            AIConfig.save(config);
            alert('✅ AI 设置已保存！');
            closeAISettingsModal();
        }
    });
    
    /**
     * 清除 AI 设置
     */
    clearAISettings.addEventListener('click', () => {
        if (confirm('确定要清除所有 AI 配置吗？')) {
            AIConfig.clear();
            loadAISettingsToUI();
            alert('✅ AI 设置已清除！');
        }
    });
    
    /**
     * 统一的 AI API 调用函数
     */
    async function callAI(prompt, button) {
        const config = AIConfig.get();
        const providerConfig = config[config.provider];
        
        // 检查配置
        if (!providerConfig || !providerConfig.key) {
            alert(`❌ 请先配置 AI 服务\n\n当前选择的提供商: ${config.provider}\n\n点击顶部的设置按钮 (⚙️) 进行配置。`);
            return null;
        }
        
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loader"></span>';
        button.disabled = true;

        try {
            let result;
            
            switch(config.provider) {
                case 'openai':
                    result = await callOpenAI(prompt, providerConfig);
                    break;
                case 'anthropic':
                    result = await callAnthropic(prompt, providerConfig);
                    break;
                case 'gemini':
                    result = await callGemini(prompt, providerConfig);
                    break;
                case 'deepseek':
                    result = await callDeepSeek(prompt, providerConfig);
                    break;
                case 'custom':
                    result = await callCustomAPI(prompt, providerConfig);
                    break;
                default:
                    throw new Error('未知的 AI 提供商');
            }
            
            return result;
        } catch (error) {
            console.error('AI API 调用失败:', error);
            alert(`❌ AI 功能调用失败：${error.message}\n\n请检查:\n1. API Key 是否正确\n2. 网络连接是否正常\n3. 所选服务在您的地区是否可用`);
            return null;
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    }
    
    /**
     * OpenAI API 调用
     */
    async function callOpenAI(prompt, config) {
        const endpoint = config.endpoint || 'https://api.openai.com/v1';
        const url = `${endpoint}/chat/completions`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }
    
    /**
     * Anthropic Claude API 调用
     */
    async function callAnthropic(prompt, config) {
        const url = 'https://api.anthropic.com/v1/messages';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': config.key,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: config.model,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }]
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.content?.[0]?.text || '';
    }
    
    /**
     * Google Gemini API 调用
     */
    async function callGemini(prompt, config) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.key}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        
        if (!response.ok) {
            if (response.status === 400 || response.status === 403) {
                throw new Error('Gemini API 在您所在的地区不可用');
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    
    /**
     * DeepSeek API 调用
     */
    async function callDeepSeek(prompt, config) {
        const url = 'https://api.deepseek.com/v1/chat/completions';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
    }
    
    /**
     * 自定义 API 调用 (OpenAI 格式)
     */
    async function callCustomAPI(prompt, config) {
        const url = `${config.endpoint}/chat/completions`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content || '';
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
        
        const generatedText = await callAI(prompt, continueBtn);
        
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
        
        const summary = await callAI(prompt, summarizeBtn);
        
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

    // 键盘快捷键系统
    document.addEventListener('keydown', (e) => {
        const mod = e.ctrlKey || e.metaKey; // Ctrl on Windows/Linux, Cmd on Mac
        const shift = e.shiftKey;
        const alt = e.altKey;
        const key = e.key.toLowerCase();
        
        // ========== 文件操作 ==========
        
        // Ctrl/Cmd + N: 新建
        if (mod && !shift && !alt && key === 'n') {
            e.preventDefault();
            newFileBtn.click();
            return;
        }
        
        // Ctrl/Cmd + O: 打开
        if (mod && !shift && !alt && key === 'o') {
            e.preventDefault();
            openFileBtn.click();
            return;
        }
        
        // Ctrl/Cmd + S: 保存
        if (mod && !shift && !alt && key === 's') {
            e.preventDefault();
            saveFileBtn.click();
            return;
        }
        
        // Ctrl/Cmd + W: 关闭（新建空白文档）
        if (mod && !shift && !alt && key === 'w') {
            e.preventDefault();
            newFileBtn.click();
            return;
        }
        
        // ========== 视图操作 ==========
        
        // Ctrl/Cmd + Shift + L: 切换侧边栏/大纲
        if (mod && shift && !alt && key === 'l') {
            e.preventDefault();
            outlineToggleBtn.click();
            return;
        }
        
        // Ctrl/Cmd + Shift + 1: 大纲（与切换侧边栏相同）
        if (mod && shift && !alt && key === '1') {
            e.preventDefault();
            outlineToggleBtn.click();
            return;
        }
        
        // Ctrl/Cmd + /: 源代码模式（Vditor 自带，不需要处理）
        // F8: 对焦模式（需要通过 Vditor API）
        if (!mod && !shift && !alt && e.key === 'F8') {
            e.preventDefault();
            // 切换对焦模式 - 通过 Vditor 内置功能
            const focusBtn = document.querySelector('[data-type="focus"]');
            if (focusBtn) focusBtn.click();
            return;
        }
        
        // F9: 打字机模式
        if (!mod && !shift && !alt && e.key === 'F9') {
            e.preventDefault();
            // 切换打字机模式
            const typewriterBtn = document.querySelector('[data-type="typewriter"]');
            if (typewriterBtn) typewriterBtn.click();
            return;
        }
        
        // F11: 全屏模式
        if (!mod && !shift && !alt && e.key === 'F11') {
            e.preventDefault();
            const fullscreenBtn = document.querySelector('[data-type="fullscreen"]');
            if (fullscreenBtn) fullscreenBtn.click();
            return;
        }
        
        // ========== 编辑操作 ==========
        // 注意：大部分编辑操作（如 Ctrl+B, Ctrl+I 等）由 Vditor 内置处理
        // 这里只处理一些特殊的或者需要自定义的快捷键
        
        // Ctrl/Cmd + F: 查找（Vditor 自带）
        // Ctrl/Cmd + H: 替换（Vditor 自带）
        
        // ========== 段落操作 ==========
        
        // Ctrl/Cmd + 0: 段落
        if (mod && !shift && !alt && key === '0') {
            e.preventDefault();
            const paragraphBtn = document.querySelector('[data-type="paragraph"]');
            if (paragraphBtn) paragraphBtn.click();
            return;
        }
        
        // Ctrl/Cmd + 1-6: 标题 1-6
        if (mod && !shift && !alt && ['1', '2', '3', '4', '5', '6'].includes(key)) {
            e.preventDefault();
            const headingBtn = document.querySelector(`[data-type="heading"][data-level="${key}"]`);
            if (headingBtn) {
                headingBtn.click();
            } else {
                // 如果找不到按钮，尝试插入标题
                const level = parseInt(key);
                const hashes = '#'.repeat(level);
                vditor.insertValue(`\n${hashes} `);
            }
            return;
        }
        
        // Ctrl/Cmd + Shift + K: 代码块
        if (mod && shift && !alt && key === 'k') {
            e.preventDefault();
            const codeBtn = document.querySelector('[data-type="code"]');
            if (codeBtn) codeBtn.click();
            return;
        }
        
        // Ctrl/Cmd + Shift + Q: 引用
        if (mod && shift && !alt && key === 'q') {
            e.preventDefault();
            const quoteBtn = document.querySelector('[data-type="quote"]');
            if (quoteBtn) quoteBtn.click();
            return;
        }
        
        // Ctrl/Cmd + Shift + [: 有序列表
        if (mod && shift && !alt && key === '[') {
            e.preventDefault();
            const orderedListBtn = document.querySelector('[data-type="ordered-list"]');
            if (orderedListBtn) orderedListBtn.click();
            return;
        }
        
        // Ctrl/Cmd + Shift + ]: 无序列表
        if (mod && shift && !alt && key === ']') {
            e.preventDefault();
            const listBtn = document.querySelector('[data-type="list"]');
            if (listBtn) listBtn.click();
            return;
        }
        
        // Ctrl/Cmd + T: 表格
        if (mod && !shift && !alt && key === 't') {
            e.preventDefault();
            const tableBtn = document.querySelector('[data-type="table"]');
            if (tableBtn) tableBtn.click();
            return;
        }
        
        // ========== 格式化操作 ==========
        // Vditor 内置支持的快捷键：
        // Ctrl+B: 粗体
        // Ctrl+I: 斜体
        // Ctrl+U: 下划线
        // Ctrl+K: 链接
        // 等等...
        
        // Ctrl/Cmd + Shift + `: 行内代码
        if (mod && shift && !alt && key === '`') {
            e.preventDefault();
            const inlineCodeBtn = document.querySelector('[data-type="inline-code"]');
            if (inlineCodeBtn) inlineCodeBtn.click();
            return;
        }
        
        // Ctrl/Cmd + Shift + I: 图片
        if (mod && shift && !alt && key === 'i') {
            e.preventDefault();
            const uploadBtn = document.querySelector('[data-type="upload"]');
            if (uploadBtn) uploadBtn.click();
            return;
        }
        
        // Ctrl/Cmd + \: 清除格式
        if (mod && !shift && !alt && key === '\\') {
            e.preventDefault();
            const clearBtn = document.querySelector('[data-type="clearCache"]');
            if (clearBtn) clearBtn.click();
            return;
        }
    });

    // 初始化文件名和标题
    setFileName(currentFileName);
});
