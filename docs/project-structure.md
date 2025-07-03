# 项目配置文档

## 配置文件说明

### 核心配置（根目录）
- `package.json` - 项目依赖和脚本
- `vite.config.js` - 构建工具配置
- `jsconfig.json` - JavaScript 项目配置
- `index.html` - 应用入口页面

### 开发环境配置
- `.vscode/` - VS Code 编辑器配置
  - `extensions.json` - 推荐的扩展插件
  - `settings.json` - 项目特定设置

### 版本控制
- `.gitignore` - Git 忽略文件配置

### 数据文件
- `utilities/` - 本地数据和工具函数
  - `localmath.json` - 数学事实数据
  - `localtrivia.json` - 趣味问答数据
  - `localutilities.js` - 数据获取工具

## 为什么不建议移动配置文件？

1. **工具约定** - 每个工具都期望配置文件在特定位置
2. **自动识别** - 构建工具和 IDE 自动查找标准位置
3. **团队协作** - 标准结构便于团队成员理解
4. **生态兼容** - 与 npm、Vite、VS Code 生态保持一致
