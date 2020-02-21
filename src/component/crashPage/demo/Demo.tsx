/**
 * @name 页面崩溃处理
 * @description description
 * @time 2020-02-20
 */
import * as React from "react";
import {Button} from '@component/button/index';
import './index.scss';
type Props={

};
type States={
    error:boolean
};
interface IDemo {
    createCrash():void;
}
class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={
        error:false
    };
    createCrash=()=>{

       // throw new Error();

       this.setState(pre=>{
          
            return null;
        
       },()=>{

            alert(1);
       })
    }
    render(){
     //   const {error} = this.state;
        if(false){
            throw new Error('故意错误！'); // 显性抛出错误
            // return 隐形抛出错误
        }else{
            return (
                <div className="g-layout crash-box">
                    <Button handle={this.createCrash}>抛出错误</Button>
                </div>
        );
        }
        
    }
}


export default Demo;