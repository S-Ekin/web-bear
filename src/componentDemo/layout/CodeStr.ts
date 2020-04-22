export const str1 = `render(){
        const {tit,children,className} = this.props;

        return (
          <div className={"g-layout" className}>
            <div className="g-layout-head">{tit}</div>
            <div className="g-layout-article">{children}</div>
          </div>
        );
    }
    `;

    export const str2 = `//整个右侧的容器
.g-content {
    flex: 1; // 很重要，为auto的话，即使兄弟元素固定宽度，只要它缩放会影响兄弟元素 
    overflow: auto; //当父节点没有固定的高度和宽度时，子节点要和他一样高和宽时，要用overflow：hidden || auto,生成BFC,
    //这样子节的不会越界跨出导致父节点自动扩大，会限制在父节点内。
    // auto 可以让宽度和高度有滚动条
    //  min-width: 1000px;  // 不能直接给g-content加上min-width，不然会挤掉左侧菜单的宽度，可以在g-content下再给一个节点包围所有的，把最小宽度给他
    min-height: 600px;
    height: 100%;
    .g-wrap-content {
        min-width: 1000px; // 让最小宽度在这里做限制
        height: 100%;
    }
}
    `;
     export const str3 = `<div id="app">
        <div className="g-slideMenu"></div>
        <div className="g-content">
            <div className="g-wrap-content">
                <div className="g-head"></div>
                <div className="main"></div>
            </div>
        </div>
    </div>		
    `;