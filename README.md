# web-bear

我能写的web组件
贡献者

[![npm version](https://img.shields.io/npm/v/@s-ekin/web.svg)](https://www.npmjs.com/package/@s-ekin/web)

#### 一. 编码组件时，所有文件里的引用地址，暂且不能使用 **@component/**来应用，因为在编译为组件库时，其他的项目在引用这个库时会报错】
#### 发布组件代码到npm
   - 在 **src/component** 目录下，使用npx tsc 来把组件编译成 js 代码发布
   - 升级包版本 **npm version major | minor | patch**
      - 主版本号:MAJOR 版本号的变更说明新版本产生了不兼容低版本的 API 等，
      - 次版本号:MINOR 版本号的变更说明你在以向后兼容的方式添加功能
      - 修订号:PATCH 版本号的变更说明你在新版本中做了向后兼容的 bug 修复。
   - 编译 scss , ts 是不会处理scss 文件的，需要自己处理。
      - 在**src/component/my-css** 目录下，
      - 使用 npx sass main.scss ../../../../lib/index.css -s compressed --no-source-map 
      - 具体命令看sass 官网
   - 样式文件也可以不编译，直接把**src/component/my-css**放到lib下。
   - 最后使用 npm publish
#### 发布到本地库
   - 全局安装 yalc
   - 在组件库 yalc publish 发布到本地
   - 在其他项目里，使用 yalc add @s-ekin/web 来使用这个库。（效果和从npm 里 install 一样）
   - 当修改组件库时，使用yalc push 可以同步所有使用这个组件库的项目。
   - 避免使用npm link 来软链 ，导致组件库和项目库同时保存两份 react实例，导致react-router 和 react hook 报错。，同时ts类型也报错。 
#### 切换代理
   - **nrm ls** 查看代理列表
   - **nrm use npm | cnpm | yarn | taobao** 使用npm作为代理
   - 发布到npm时，要使用npm作为代理，也就是npm本身，否则不能发布上去