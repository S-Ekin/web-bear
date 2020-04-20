export const str1 = ` // 直接在父容器管理 是否显示的状态
const innerLoadingWrap = document.getElementById("wrap-loading")!;
const outLoadingWrap = document.getElementById("out-modal-wrap")!;
const loadCom = showLoading ? (
    <Loading container={wrapDom === "wrap-loading" ?innerLoadingWrap :outLoadingWrap} />
) :undefined;
`;

export const str2 = `// 直接在父容器管理 是否显示的状态
const loadingCom = showLoading? (
    <Loading.LoadingCom />
    ) :undefined;
`;

export const str3 =`// 容器
const createLoad = function(callback?:()=>void) {
    const wrap = document.getElementById("wrap-loading");
    ReactDom.render(<Loading ref={ref => (loadingRef = ref)} />, wrap,function(){
        if(callback){
            callback();
        }
        
    });
};
//打开、关闭的函数
btnLoadingFn=(e:React.MouseEvent<HTMLButtonElement>)=>{
    const val = e.currentTarget.value;
    if(val==="open"){
        loadFn.open();
        this.setState({
            closeTime:5
        });
        this.timeInterval= window.setInterval(()=>{
            this.setState(pre=>{
                return {
                    closeTime:pre.closeTime-1
                };
            });
        },1000);
        this.timeTimeOut = window.setTimeout(()=>{
            loadFn.close();
            window.clearInterval(this.timeInterval);
            this.setState({
                closeTime:0
            });
        },5000);
    }
}`;