/**
 * @name name
 * @description description
 * @time 2020-04-20
 */
import * as React from "react";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1} from "./CodeStr";
import "./index.scss";
import NavMenu from "@component/menu/NavMenu";
import {menuList} from "@container/menuData";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import { CheckBox, Input } from "@component/input/index";
import {Button} from "@component/button/index";
type config = {
	expand: boolean; //是否收缩
	textField: string;
	idField: string;
	urlField: string;
	iconField: string;
  defaultMenuId: string;
  width:number;
};

const config:config = {
    expand: true, //是否收缩
    textField: "name",
    idField: "id",
    urlField: "url",
    iconField: "icon",
    defaultMenuId: "",
    width:0
};

type Props={

};
type States={
    immuConfig:IImmutalbeMap<config>;
    refreshId:number;
    config:config;
    selectedId:{id:string};
    selectdInpVal:string;
};
interface IDemo {
  changeConfig(e: React.ChangeEvent<HTMLInputElement>):void;
}
class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    immuConfig: createImmutableMap(config),
    refreshId: 0,
    config: config,
    selectedId:{id:""},
    selectdInpVal:"",
  };
  refesh = () => {
    this.setState((pre) => {
      return {
        refreshId: pre.refreshId + 1,
        config: pre.immuConfig.toJS(),
      };
    });
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value: any = dom.value;
    if (name === "expand") {
      value = value === "1";
    }else if(name === "width"){

      value =~~ value ;

    }
    this.setState((pre) => {
      return {
        immuConfig: pre.immuConfig.set(name, value),
      };
    });
  }
  clickCallBack=(node:any)=>{
    console.log(node);
  }
  changeMenuId=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const dom = e.currentTarget!;
    const val = dom.value;

    this.setState({
      selectdInpVal:val,
    });

    
  }
  outControl=()=>{
    const {selectdInpVal} = this.state;

    this.setState({
      selectedId:{id:selectdInpVal}
    });
  }
  render() {
    const { immuConfig, refreshId, config ,selectdInpVal,selectedId} = this.state;
    const {
      textField,
      idField,
      defaultMenuId,
      urlField,
      expand,
      iconField,
      width,
    } = immuConfig.toJS();

    return (
      <Layout tit="菜单" className="menuDemo">
        <div className="flex-between menu-wrap">
          <NavMenu 
          key={refreshId} 
          {...config} 
          data={menuList}
          clickBack={this.clickCallBack}
          init={selectedId}
           />
          <div className="config">
            <div className="g-item-show" >
              <div className="g-item-show">
                <div>
                  <Button handle={this.refesh}>刷新配置</Button>
                </div>
                <div className="flex-between">
                  <div>
                    <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="idField"
                        value={idField}
                      >
                        idField：
                      </Input>
                    </div>
                    <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="urlField"
                        value={urlField}
                      >
                        urlField：
                      </Input>
                    </div>
                    <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="defaultMenuId"
                        norequire={true}
                        value={defaultMenuId}
                      >
                        defaultMenuId：
                      </Input>
                    </div>
                     <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="width"
                        type="number"
                        norequire={true}
                        value={`${width}`}
                      >
                        width：
                      </Input>
                    </div>
                  </div>
                  <div>
                    <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="textField"
                        value={textField}
                      >
                        textField：
                      </Input>
                    </div>
                    <div className="inp-item">
                      <Input
                        changeFn={this.changeConfig}
                        name="iconField"
                        value={iconField}
                      >
                        iconField：
                      </Input>
                    </div>

                    <div className="inp-item">
                      <span>展开 expand：</span>
                      <CheckBox
                        name="expand"
                        value="1"
                        type="radio"
                        checked={expand}
                        changeHandle={this.changeConfig}
                      >
                        是
                      </CheckBox>
                      <CheckBox
                        name="expand"
                        value="2"
                        type="radio"
                        checked={!expand}
                        changeHandle={this.changeConfig}
                      >
                        否
                      </CheckBox>
                    </div>
                  </div>
                </div>
              </div>
              <div className="g-item-show ">
                <CodeBlock tit="注意事项">{str1}</CodeBlock>
              </div>
              <div className="g-item-show">
                <div>
                  <Button handle={this.outControl}>设置菜单Id</Button>：
                  <Input
                    value={selectdInpVal}
                    norequire={true}
                    changeFn={this.changeMenuId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}


export default Demo;