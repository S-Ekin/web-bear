export const str1 =`sureFn(field:string){
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

  export  const str3 =`//里层的modal容器
  <BrowserRouter>
        <SlideMenu expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />
        <div className="g-content">
          <Head expand={menuExpand} toggleMenuFn={this.toggleMenuSlide} />

          <div className="g-main">
            <ErrorBoundary>
               <Switch>
                <MainRouter />
              </Switch>
            </ErrorBoundary>
			  	  <div id="inner-modal-wrap"/>
            <div id="wrap-loading" />
            <div id="wrap-notice" />
          </div>
        </div>
      </BrowserRouter>
      //最外层的modal容器
      <body>
        <div id="app" class="page"></div>
        <div id="out-modal-wrap"></div>
      </body>
      
      `;