/**
 * @name name
 * @description description
 * @time 2020-04-14
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import {Button} from "@component/button/index";
import Modal from "@component/modal/index";
import { Input, CheckBox } from "@component/input/index";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1,str2,str3} from "./codeStr";
type Props={

};
type States={
  immuConfig: IImmutalbeMap<config>;
  config:config;
  refreshId:number;
  show:boolean;
  hasSureFn:boolean;
  hasCustomFoot:boolean;
  textUpdate:boolean;
};
interface IDemo {
    changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}
type config = {
	noshade:boolean; //遮罩层透明
    wrapName:string;
    tit:string;
    className:string;
    field:string;//标识字段
    width:string;
};
const innerModalWrap = document.getElementById("inner-modal-wrap");
const outModalWrap = document.getElementById("out-modal-wrap");

const config:config = {
    noshade:true,
    wrapName:"inner-modal-wrap",
    tit:"模态框",
    className:"modalPage",
    field:"myModal",//标识字段
    width:"0",
};
class Demo extends React.PureComponent<Props,States> implements IDemo{

    state:States={
        immuConfig:createImmutableMap(config),
        refreshId:0,
        config:config,
        show:false,
        hasSureFn:false,
        hasCustomFoot:false,
        textUpdate:false,
    };
    toggleModal=(_field:string,show:boolean)=>{
       
      this.setState({
        show,
      });
        
    }

    refresh=()=>{

      this.setState(pre=>{
        return {
           refreshId:pre.refreshId+1,
           config:pre.immuConfig.toJS()
        };
      });

    }
    modalCustomFoot=()=>{

      return (
        <>
            <Button handle={this.btnOptHandle} val="open">打开</Button>
            <Button styleType="line-btn" handle={this.btnOptHandle} val="close">关闭</Button>
            <Button styleType="line-btn" handle={this.btnOptHandle} val="close">自定义</Button>
        </>
      );
    }
    changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
          const dom = e.currentTarget;
          const name = dom.name as any;
          let value: any = dom.value;

          if (["noshade"].includes(name)) {
              value = value === "1" ? true : false;
          }

          this.setState(pre => {
          return {
              immuConfig: pre.immuConfig.set(name, value)
          };
      });
    }
    btnOptHandle=(e:React.MouseEvent<HTMLButtonElement>)=>{
      const value = e.currentTarget!.value;
      this.setState({
        show:value==="open"
      });
    }
    sureFn(field:string){
      console.log(field);
      
    }
    changeState=(e:React.ChangeEvent<HTMLInputElement>)=>{
      const dom = e.currentTarget!;
      const name = dom.name;
      const val = dom.value;
      this.setState(()=>{
        return {
           [name as 'hasSureFn']:val === "1",
        };
      });
      
    }
    getStr1(){
      const {hasSureFn} = this.state;
      return (
        <div className="inp-item">
              <span>确定按钮调用的事件(不传就不会有底部的操作按钮) sureFn：</span>
              <CheckBox
                name="hasSureFn"
                value="1"
                type="radio"
                checked={hasSureFn}
                changeHandle={this.changeState}
              >
                是
              </CheckBox>
              <CheckBox
                name="hasSureFn"
                value="2"
                type="radio"
                checked={!hasSureFn}
                changeHandle={this.changeState}
              >
                否
              </CheckBox>
            </div>
      );
    }
    
    getStr2(){
      const {hasCustomFoot} = this.state;
      return (
        <div className="inp-item">
              <span>自定义底部按钮 footer：</span>
              <CheckBox
                name="hasCustomFoot"
                value="1"
                type="radio"
                checked={hasCustomFoot}
                changeHandle={this.changeState}
              >
                是
              </CheckBox>
              <CheckBox
                name="hasCustomFoot"
                value="2"
                type="radio"
                checked={!hasCustomFoot}
                changeHandle={this.changeState}
              >
                否
              </CheckBox>
            </div>
      );
    }
    render(){
        const {config,show,immuConfig,refreshId,hasSureFn,textUpdate,hasCustomFoot} = this.state;
        const {wrapName:wrap,width:wid,...obj} = config;
        const {width,field,tit,className,noshade,wrapName} = immuConfig.toJS();
        return (
            <Layout tit="模态框">
                <Modal
                    {...obj}
                    show={show}
                    key={refreshId}
                    width={~~wid}
                    sureFn={hasSureFn ? this.sureFn : undefined}
                    wrap={wrap === "inner-modal-wrap" ?innerModalWrap! : outModalWrap!}
                    customFootFn={hasCustomFoot ? this.modalCustomFoot :undefined}
                    toggleFn={this.toggleModal}
                >
                    <div>
                        模态框内容
                    </div>
                </Modal>
                <div className="g-item-show flex-between">
                    <div className="m-optBtn">
                        <Button handle={this.btnOptHandle} val="open">打开</Button>
                        <Button styleType="line-btn" val="close">关闭</Button>
                    </div>
                    <div>
                        <Button handle={this.refresh}>刷新配置</Button>
                    </div>
                </div>
                <div className="g-item-show">
                    <div className="inp-item">
                      <span>测试无关数据变化时会影响modal组件更新：</span>
                          <CheckBox
                            name="textUpdate"
                            value="1"
                            type="radio"
                            checked={textUpdate}
                            changeHandle={this.changeState}
                          >
                            是
                          </CheckBox>
                          <CheckBox
                            name="textUpdate"
                            value="2"
                            type="radio"
                            checked={!textUpdate}
                            changeHandle={this.changeState}
                          >
                            否
                          </CheckBox>
                    </div> 
                </div>
                <div className="g-item-show flex-between">
                      <div>
                        <div className="inp-item">
                          <Input
                            type="number"
                            changeFn={this.changeConfig}
                            name="width"
                            value={width}
                          >
                            width:
                          </Input>
                        </div> 
                       
                        <div className="inp-item">
                          <span>模态框容器 wrap</span>
                          <CheckBox
                            name="wrapName"
                            value="inner-modal-wrap"
                            type="radio"
                            checked={wrapName==="inner-modal-wrap"}
                            changeHandle={this.changeConfig}
                          >
                            inner-modal-wrap
                          </CheckBox>
                          <CheckBox
                            name="wrapName"
                            value="out-modal-wrap"
                            type="radio"
                            checked={wrapName === "out-modal-wrap"}
                            changeHandle={this.changeConfig}
                          >
                            out-modal-wrap
                          </CheckBox>
                        </div>
                    
                        <div className="inp-item">
                          <Input
                            changeFn={this.changeConfig}
                            name="className"
                            value={className}
                          >
                            模态框容器类名 className:
                          </Input>
                        </div>
                      </div>
                      <div>
                        <div className="inp-item">
                          <span>弹罩层透明 noshade</span>
                          <CheckBox
                            name="noshade"
                            value="1"
                            type="radio"
                            checked={noshade}
                            changeHandle={this.changeConfig}
                          >
                            是
                          </CheckBox>
                          <CheckBox
                            name="noshade"
                            value="2"
                            type="radio"
                            checked={!noshade}
                            changeHandle={this.changeConfig}
                          >
                            否
                          </CheckBox>
                        </div>
                    
                        <div className="inp-item">
                          <Input
                            changeFn={this.changeConfig}
                            name="tit"
                            value={tit}
                          >
                            模态框标题 tit:
                          </Input>
                        </div>
                        <div className="inp-item">
                          <Input
                            changeFn={this.changeConfig}
                            name="field"
                            value={field!}
                          >
                          标识字段 field:
                          </Input>
                        </div>
                      </div>
                    </div>
                <div className="g-item-show">
                    <CodeBlock
                      tit={this.getStr1()}
                    >
                      {str1}
                    </CodeBlock>
                    </div> 
                    <div className="g-item-show">
                      <CodeBlock
                        tit={this.getStr2()}
                      >
                        {str2}
                      </CodeBlock>
                    </div>
                    <div className="g-item-show">
                      <CodeBlock
                        language="html"
                        tit="注意模态框容器的位置"
                      >
                        {str3}
                      </CodeBlock>
                    </div>
            </Layout>
        );
    }
}


export default Demo;