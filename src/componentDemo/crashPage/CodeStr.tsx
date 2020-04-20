export const str1 = `//错误要在render函数调用时制造，否则react不会报错
createCrash=()=>{
    // throw new Error();
    this.setState({
        error:true
    });
}
render(){
    const {error} = this.state;
    if(error){
        throw new Error('故意错误！'); // 显性抛出错误
        // return 隐形抛出错误
    }else{
        return (
           ...
        );
    }

}`;

export const str2 = `// ErrorBoundary  类 ，把获取hasError的函数传递出去
class ErrorBoundary  {
    constructor(props:props){
        super(props);
        const {bindGetHasError} = props;
        if(bindGetHasError){
            bindGetHasError(this.getHasError);
        }
    }
    ...
}

// Demo类
class Demo{
    getHasErrorFn:(()=>boolean) | undefined;
    bindGetHasError=(getHasErrorFn:(()=>boolean))=>{
        this.getHasErrorFn = getHasErrorFn;
    }
    getHasErrorBtnHandl=()=>{
        const hasError = this.getHasErrorFn!();
        alert(hasError:{hasError})
    }
    ...
}
`;