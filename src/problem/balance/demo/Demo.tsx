import * as React from "react";
import CodeBlock from "@container/codeBlock/CodeBlock";
import { Button } from "@component/button/index";
import { Balence } from "../TwoBalance";
import { str1 } from "./codeStr";
import "./demo.scss";
type Props={

};
type States={
    child1:number,
    child2:number,
    child1H:number,
    child2H:number,
};

const total= 200;
const count = 5;

class Demo extends React.PureComponent<Props,States> {
    state:States={
        child1: 0,
        child2: 0,
        child1H: 100,
        child2H:100,
    };
    randomChildContent =() => {
        const child1 = Math.random()*10;
        const child2 = Math.random()*10;
        
        this.setState(()=>{
        let tabH = 0;    
        if (child1 < count) {
            tabH = total / 2;
        } else {
            tabH = 0;
        } 

        if (child2 < count) {
            tabH = tabH || 180;
        } else {
            tabH = tabH ? total- 180 :total/ 2;
        }
            return {
                child1H:tabH,
                child2H:total- tabH,
                child1,
                child2,
            };
        });
    }

    random1 = () => {
        const child1 = Math.random()*10 ;
            this.setState((pre)=>{
            let tabH = 0;    
            const child2 = pre.child2;
            if (child1 < count) {
                tabH = total/ 2;
            } else {
                tabH = 0;
            } 

            if (child2 < count) {
                tabH = tabH || 180;
            } else {
                tabH = tabH ? total- 180 : total/ 2;
            }
                return {
                    child1H:tabH,
                    child2H:total- tabH,
                    child1,
                };
        });
    }

    random2 = () => {
        const child2 = Math.random()*10 ;
            this.setState((pre)=>{
            let tabH = 0;    
            const child1 = pre.child1;
            if (child2 < count) {
                tabH = total/ 2;
            } else {
                tabH = 0;
            } 

            if (child1 < count) {
                tabH = tabH || 180;
            } else {
                tabH = tabH ? total- 180 : total/ 2;
            }
                return {
                    child2H:tabH,
                    child1H:total- tabH,
                    child2,
                };
        });
    }

    render(){
        const {} = this.props;
        const {child1, child2, child1H, child2H} = this.state;
        console.log(Balence);
        
        return (
            <div className="g-layout">
                <div className="g-layout-head">
                    两个容器之间的平衡 (寻找最优条件，不要每次重新计算两个的值)
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show">
                            <p>一个父容器里的两个子容器，两个都有内容或都无的时候，高度保持一致，否则没有内容的高度为100，另一个容器占满剩下的</p>
                        <div className="tit-head">
                            <Button handle={this.random1}>随机内容 child1</Button>
                            <Button handle={this.randomChildContent}>随机内容 2个</Button>
                            <Button handle={this.random2}>随机内容 child2</Button>
                        </div>
                        <div className="par-container">
                            <div className="item-child" style={{height: `${child1H}px`,}}>{child1}</div>
                            <div className="item-child"  style={{height: `${child2H}px`,}}>{child2}</div>
                        </div>
                    </div>
					<div className="g-item-show">
					<CodeBlock tit='两个都依赖对方的结果作判断，计算出一个就可以知道另一个，按顺序判断，不嵌套判断'>
                        {str1}
                    </CodeBlock>
                    </div>
                </div>
            </div>
           
        );
    }
}


export default Demo;