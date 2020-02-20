/**
 * @name name
 * @description description
 * @time 2020-02-19
 */
import * as React from "react";
import Loading from '../Loading';
import loadFn from '@component/loading/loadMethod';
import './index.scss';
import {Button} from '@component/button/index';
type Props={

};
type States={
    closeTime:number;
};
interface Iindex {

}
class Index extends React.PureComponent<Props,States> implements Iindex{


    loadingRef:React.RefObject<HTMLDivElement> = React.createRef();
    state:States={
        closeTime:0,
    };
    componentDidMount(){
        console.log(this.loadingRef)

    }

   
    btnLoadingFn=(e:React.MouseEvent<HTMLButtonElement>)=>{
        const val = e.currentTarget.value;
        if(val==="open"){
            loadFn.open();

            this.setState({
                closeTime:1
            });

            const timer = window.setInterval(()=>{

                this.setState(pre=>{
                    return {
                        closeTime:pre.closeTime+1
                    }
                })

            },1000);
            window.setTimeout(()=>{

                
                loadFn.close();
                window.clearInterval(timer);
                
                this.setState({
                    closeTime:0
                })
            },3000)
        }
    }
    render(){
        const {closeTime} = this.state;
        return (
          <div className="g-layout loading-box">
            <div className="g-layout-head">
              <h3>数据加载</h3>
            </div>
            <div className="g-layout-article">
              <div className="g-item-show">
                <p className="title">通过组件，指定容器的加载</p>
                <div ref={this.loadingRef}>
                  <Loading.LoadingCom />
                </div>
              </div>
              <div className="g-item-show">
                <p className="title">
                  通过调用loading方法,默认容器是div.g-main,3s后调用关闭方法
                </p>
                <div className="btn-box">
                  <Button val="open" handle={this.btnLoadingFn}>
                    打开
                  </Button>
                  <Button
                    colorType="green"
                    val="close"
                    handle={this.btnLoadingFn}
                  >
                    <span>{closeTime?closeTime:undefined}</span>
                    <span>关闭</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
}


export default Index;