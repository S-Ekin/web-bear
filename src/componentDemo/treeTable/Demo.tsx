/**
 * @name name
 * @description description
 * @time 2020-02-25
 */
import * as React from "react";
import { GroupCols, TreeTable } from "@component/treeTable/TreeTable";
import data from "./data";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import { Button } from "@component/button/index";
import { Input, CheckBox } from "@component/input/index";
import {str1,str4,str2,str3,str5,str6} from './CodeStr';
import CodeBlock from "@container/codeBlock/CodeBlock";
type config = {
  multiply?: boolean;
  itemIcon?: string;
  height?: number;
  childField?: string;
  idField: string; //表格的节点标识
  defaultSel?: string; //默认选中的
  tabField?: string; //表格标识
  emptyTxt?: string; //空数据时显示文字
  noOrder?:boolean;
};
type Props = {};
type States = {
  immuConfig: IImmutalbeMap<config>;
  config: config;
  refreshId: number;
  initSelectVal: undefined | { id: string };
};
const initConfig = {
  multiply: false,
  height: 0,
  itemIcon: "file",
  childField: "children",
  idField: "id",
  defaultSel: "", //默认选中的
  tabField: "", //表格标识
  emptyTxt: "", //空数据时显示文字
  noOrder:false,
};
class Demo extends React.PureComponent<Props, States> {
  state: States = {
    immuConfig: createImmutableMap<config>(initConfig),
    config: initConfig,
    refreshId: 0,
    initSelectVal: undefined
  };
  refesh = () => {
    this.setState(pre => {
      return {
        config: pre.immuConfig.toJS(),
        refreshId: pre.refreshId + 1
      };
    });
  }
  changeConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const name = dom.name as any;
    let value: any = dom.value;

    if (["height"].includes(name)) {
      value = ~~value;
    } else if (["multiply",'noOrder'].includes(name)) {
      value = value === "1" ? true : false;
    }

    this.setState(pre => {
      return {
        immuConfig: pre.immuConfig.set(name, value)
      };
    });
  }
  changeSelect = () => {
    this.setState({
      initSelectVal: {
        id: "21,22"
      }
    });
  }
  getCodeBlockTit1(){
    return (
    <>
       <div>
         外部控制下拉的选择id:224,229的节点
                <Button handle={this.changeSelect}>选择</Button>
        </div>
    </>
    );
  }
  render() {
    const { refreshId, config, immuConfig, initSelectVal } = this.state;
    const {
      height,
      itemIcon,
      childField,
      multiply,
      emptyTxt,
      tabField,
      idField,
      defaultSel,
      noOrder
    } = immuConfig.toJS();
  
    return (
      <div className="g-layout">
        <div className="g-layout-head">
          <h3>树形表格</h3>
        </div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <Button handle={this.refesh}>刷新</Button>
          </div>
          <div className="g-item-show" style={{height: 400, overflow: "auto",}}>
            <TreeTable
              key={refreshId}
              data={data}
              initSelectVal={initSelectVal}
              {...config}
            >
              <GroupCols forzen={true}>
                <GroupCols.colItem width={180} field="name">
                  列1
                </GroupCols.colItem>
                <GroupCols.colItem width={60} field="persons" align="center">列2</GroupCols.colItem>
              </GroupCols>
              <GroupCols>
                <GroupCols.colItem width={140} field="name">
                  列1
                </GroupCols.colItem>
                <GroupCols.colItem field="persons" width={240}>
                  列2
                </GroupCols.colItem>
                <GroupCols.colItem width={240} field="begin">
                  列3
                </GroupCols.colItem>
                <GroupCols.colItem width={140} field="end">
                  列3
                </GroupCols.colItem>
                <GroupCols.colItem width={140} field="progress">
                  列3
                </GroupCols.colItem>
              </GroupCols>
              <GroupCols forzen={true} >
                <GroupCols.colItem width={140} field="name">列3</GroupCols.colItem>
              </GroupCols>
              <GroupCols  >
                <GroupCols.colItem width={140} field="name">列3</GroupCols.colItem>
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
                  norequire={true} 
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
                  norequire={true} 
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
                <span>不要序号 noOrder</span>
                <CheckBox
                  name="noOrder"
                  value="1"
                  type="radio"
                  checked={noOrder!}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noOrder"
                  value="2"
                  type="radio"
                  checked={!noOrder}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
              </div>
           
              <div className="inp-item">
                <Input
                  changeFn={this.changeConfig}
                  name="emptyTxt"
                  norequire={true} 
                  value={emptyTxt!}
                >
                  空数据时显示文字 emptyTxt:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  changeFn={this.changeConfig}
                  name="tabField"
                  norequire={true} 
                  value={tabField!}
                >
                  表格标识 tabField:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  changeFn={this.changeConfig}
                  name="defaultSel"
                  norequire={true} 
                  value={defaultSel!}
                >
                  默认选中 defaultSel:
                </Input>
              </div>
            </div>
          </div>

          <div className="g-item-show">
             
              <CodeBlock tit={this.getCodeBlockTit1()}>{str1}</CodeBlock>
          </div>
          <div className="g-item-show">
              <CodeBlock language="scss" tit="表格高度和宽度能自适应和有滚动条的关键css">{str2}</CodeBlock>
          </div>
          <div className="g-item-show">
              <CodeBlock tit="递归比较dom">{str3 + str4}</CodeBlock>
          </div>
          <div className="g-item-show">
            <CodeBlock tit="递归组件ParTree来表示每个节点的序号，层级，路径,关于序号，明白Tritem才是真正渲染的地方，ParTree只是运输过程，在其他地方++order都不行,order要做成对象{order：number}来传递和递增">
              {str5}
            </CodeBlock>
          </div>
          <div className="g-item-show">
            <CodeBlock tit='Immutable.fromJS()格式化json时，也就是用函数来得到节点的层级，路径，序号'>
              {str6}
            </CodeBlock>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
