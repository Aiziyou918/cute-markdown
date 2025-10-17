/**
 * CuteMD - ES 模块入口文件
 * 负责导入所有依赖并初始化应用
 */

// 导入 Vditor CSS
import 'vditor/dist/index.css';

// 导入自定义 CSS
import '../css/style.css';

// 导入 Vditor 库
import Vditor from 'vditor';

// 将 Vditor 挂载到全局 window 对象，供 app-logic.js 使用
window.Vditor = Vditor;

// 导入应用逻辑
import './app-logic.js';

console.log('✨ CuteMD ES 模块已加载');

