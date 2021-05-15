export const str1 = `sureFn(field:string){
      console.log(field);
      
    }`;

export const str2 = `modalCustomFoot=()=>{

      return (
        <>
            <Button handle={this.btnOptHandle} val="open">打开</Button>
            <Button styleType="line-btn" handle={this.btnOptHandle} val="close">关闭</Button>
            <Button styleType="line-btn" handle={this.btnOptHandle} val="close">自定义</Button>
        </>
      );
    }`;

export  const str3 = `//里层的modal容器 Router.tsx
<div className="g-main">
  <ErrorBoundary init={initRouter} bindGetHasError={this.bindGetHasError}>
    <Switch>
      <Route path="/button" component={loadable(routerConfig.buttonRouter)} />
      <Route path="/table" component={loadable(routerConfig.tableRouter)} />
      <Route path="/loading" component={loadable(routerConfig.loadingRouter)} />
      <Route path="/combo" component={loadable(routerConfig.comboRouter)} />
      <Route path="/blog" component={loadable(routerConfig.blog)} />
      <Route path="/alert" component={loadable(routerConfig.modal)} />
      <Route path="/menu" component={loadable(routerConfig.menu)} />
    </Switch>
  </ErrorBoundary>
  <div id="inner-modal-wrap"/>
  <div id="wrap-loading" />
  <div id="wrap-notice" />
</div>

//最外层的modal容器 index.html
<body>
  <div id="app" class="page"></div>
  <div id="out-modal-wrap"></div>
</body>
      
      `;
