# Gemini API 配置指南

## 如何获取 Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 使用您的 Google 账号登录
3. 点击 "Create API Key" 创建新的 API 密钥
4. 复制生成的 API Key

## 配置步骤

1. 打开 `js/app.js` 文件
2. 找到第 348 行附近的这一行：
   ```javascript
   const API_KEY = ""; // 用户需要自己设置 API Key
   ```
3. 将您的 API Key 粘贴到引号中：
   ```javascript
   const API_KEY = "YOUR_API_KEY_HERE";
   ```
4. 保存文件

## 区域限制说明

⚠️ **重要提示**：Gemini API 目前仅在部分国家/地区可用。

### 支持的地区
- 美国
- 欧盟大部分国家
- 日本
- 等其他地区

### 不支持的地区
- 中国大陆
- 其他受限制的国家/地区

### 如果您在不支持的地区

当您点击 AI 功能按钮时，系统会自动检测并显示友好的提示信息：

1. **未配置 API Key 时**：
   - 提示需要配置 API Key
   - 说明 API 可能在某些地区不可用

2. **API 调用失败时**：
   - 自动检测是否是区域限制问题
   - 显示详细的错误信息和解决建议
   - 提供替代方案（如使用 VPN）

## 功能说明

### ✨ 智能续写
- 自动根据当前内容继续写作
- 需要至少 10 个字符的内容作为上下文
- AI 会保持与原文相同的语言和风格

### ✨ 智能摘要
- 生成内容的简洁摘要
- 需要至少 50 个字符的内容
- 摘要以要点形式展示
- 会在弹窗中显示摘要结果

## 安全提示

⚠️ **不要将包含 API Key 的代码提交到公共代码仓库！**

如果您需要分享代码：
1. 创建 `.gitignore` 文件（如果还没有）
2. 考虑使用环境变量或配置文件来存储 API Key
3. 在分享前确保删除 API Key

## 故障排除

### 问题：点击 AI 按钮没有反应
- 检查浏览器控制台是否有错误信息
- 确认已正确配置 API Key
- 检查网络连接

### 问题：提示"区域不支持"
- 这表示 Gemini API 在您的地区不可用
- 可以尝试使用 VPN 连接到支持的地区
- 或者等待 API 在您的地区开放

### 问题：API 调用失败
- 检查 API Key 是否正确
- 确认 API Key 没有过期
- 检查是否超出了 API 配额限制

## 相关链接

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API 文档](https://ai.google.dev/docs)
- [API 配额和限制](https://ai.google.dev/pricing)

