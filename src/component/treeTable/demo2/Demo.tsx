/**
 * @name name
 * @description description
 * @time 2020-02-25
 */
import * as React from "react";
import "./demo.scss";
import { GroupCols, TreeTable } from "../TreeTable";
import data from "./data";
import { createImmutableMap } from "@component/createImmutaleMap";
import {Button} from '@component/button/index';
import {Input,CheckBox} from '@component/input/index';
import CodeBlock from '@container/codeBlock/CodeBlock';
type config = {
  multiply?: boolean;
  itemIcon?: string;
  height?:number;
  childField?: string;
  idField: string; //表格的节点标识
  defaultSel?: string; //默认选中的
  tabField?: string; //表格标识
  emptyTxt?: string; //空数据时显示文字
  // getCheckFn?:(fn:any)=>void;//获取选中的
  // clickOrCheckForbid?:(node:IImmutalbeMap<any>,field:string)=>boolean;
  // bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
};
type Props = {};
type States = {
  immuConfig: IImmutalbeMap<config>;
  config: config;
  refreshId:number;
    initSelectVal:undefined | {id:string}
};
const initConfig = {
  multiply: false,
  height:240,
  itemIcon: "file",
  childField: "children",
  idField: "id",
  defaultSel: "", //默认选中的
  tabField: "", //表格标识
  emptyTxt: "" //空数据时显示文字
};
const str1 = `/* data: any[];
  //外部通过这个值来控制下拉框的选中,多个id用字符串分隔
  initSelectVal?:{id:string};
  */
 `;
class Demo extends React.PureComponent<Props, States> {
  state: States = {
    immuConfig: createImmutableMap<config>(initConfig),
    config: initConfig,
    refreshId:0,
    initSelectVal:undefined,
  };
  refesh=()=>{
    this.setState(pre=>{

        return {
            config:pre.immuConfig.toJS(),
            refreshId:pre.refreshId+1
        };
    });
  }
  changeConfig=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value:any = dom.value;

    if (['height'].includes(name)) {
      value = ~~value;
    } else if (
      [
        "multiply",
      ].includes(name)
    ) {
      value = value === "1" ? true : false;
    }

    this.setState(pre=>{

        return {
            immuConfig:pre.immuConfig.set(name,value)
        };
    });
  }
  changeSelect=()=>{
      this.setState({
          initSelectVal:{
              id:'21,22'
          }
      });
  }
  render() {
      const {refreshId,config,immuConfig,initSelectVal} = this.state;
      const {height,itemIcon,childField,multiply,emptyTxt,tabField,idField,defaultSel} = immuConfig.toJS();
    return (
      <div className="g-layout">
        <div className="g-layout-head">
          <h3>树形表格</h3>
        </div>
        <div className="g-layout-article">
            <div className="g-item-show">
                <Button handle={this.refesh}>刷新</Button>
            </div>
          <div className="g-item-show" >
            <TreeTable 
                key={refreshId} 
                data={data} 
                initSelectVal={initSelectVal}
                {...config}>
              <GroupCols forzen={true} width={200}>
                <GroupCols.colItem width={140} field="name">
                  列1
                </GroupCols.colItem>
                <GroupCols.colItem field="persons">列2</GroupCols.colItem>
              </GroupCols>
              <GroupCols>
                <GroupCols.colItem width={240} field="name">
                  列1
                </GroupCols.colItem>
                <GroupCols.colItem field="persons" width={240}>
                  列2
                </GroupCols.colItem>
                <GroupCols.colItem width={240} field="begin">
                  列3
                </GroupCols.colItem>
                <GroupCols.colItem width={240} field="end">
                  列3
                </GroupCols.colItem>
                <GroupCols.colItem width={240} field="progress">
                  列3
                </GroupCols.colItem>
              </GroupCols>
              <GroupCols forzen={true} width={240}>
                <GroupCols.colItem field="progress">列3</GroupCols.colItem>
              </GroupCols>
            </TreeTable>
          </div>
          <div className="g-item-show flex-between">
              <div>
                   <div className="inp-item">
                        <Input
                            type="number"
                            changeFn={this.changeConfig}
                            name="height"
                            value={`${height}`}
                        >
                            高度 height:
                        </Input>
                    </div>
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="itemIcon"
                            value={itemIcon!}
                        >
                            文件图标 itemIcon:
                        </Input>
                    </div> 
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="childField"
                            value={childField!}
                        >
                            子数组字段 childField:
                        </Input>
                    </div>
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="idField"
                            value={idField}
                        >
                            节点标识字段 idField:
                        </Input>
                    </div>
              </div>
              <div>
                   <div className="inp-item">
                        <span>多选 multiply</span>
                <CheckBox
                  name="multiply"
                  value="1"
                  type="radio"
                  checked={multiply!}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="multiply"
                  value="2"
                  type="radio"
                  checked={!multiply}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>   
                    </div>
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="emptyTxt"
                            value={emptyTxt!}
                        >
                           空数据时显示文字  emptyTxt:
                        </Input>
                    </div> 
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="tabField"
                            value={tabField!}
                        >
                           表格标识  tabField:
                        </Input>
                    </div>
                    <div className="inp-item">
                        <Input
                            changeFn={this.changeConfig}
                            name="defaultSel"
                            value={defaultSel!}
                        >
                            默认选中 defaultSel:
                        </Input>
                    </div>
              </div>

          </div>
            <div className="g-item-show">
                  <div className="g-item-show">
            <div>
              <Button handle={this.changeSelect}>选择</Button>
              <small style={{marginLeft: 16,}}><b>外部控制下拉的选择id:21,22的节点</b></small>
            </div>
            <CodeBlock>
              {str1}
            </CodeBlock>
          </div>
         
            </div>
        </div>
      </div>
    );
  }
}

export default Demo;
