/**
 * @name name
 * @description description
 * @time 2020-03-20
 */
import * as React from "react";
import { TabList, GroupCols } from "@component/tableList/TabList";
import data from "./data";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import { Button } from "@component/button/index";
import { Input, CheckBox } from "@component/input/index";
import { str1 } from "./CodeStr";
import CodeBlock from "@container/codeBlock/CodeBlock";

type config = {
  noPageNums?: boolean; //页码
  multiply?: boolean;
  height?: number;
  idField: string; //表格的节点标识
  defaultSel?: string; //默认选中的
  tabField?: string; //表格标识
  emptyTxt?: string; //空数据时显示文字
  noOrder?: boolean;
  //   getCheckFn?:(fn:any)=>void;//获取选中的
  //     initSelectVal?:{id:string};//通过外界改变表格的选中
  //     bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
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
  noPageNums: false,
  height: 0,
  idField: "event_id",
  defaultSel: "", //默认选中的
  tabField: "", //表格标识
  emptyTxt: "", //空数据时显示文字
  noOrder: false
};

interface IDemo {

  refesh ():void; 
}
class Demo extends React.PureComponent<Props, States> implements IDemo {
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
    } else if (["multiply", "noOrder", "noPageNums"].includes(name)) {
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
        id: "224,229"
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
      multiply,
      emptyTxt,
      tabField,
      idField,
      defaultSel,
      noOrder,
      noPageNums
    } = immuConfig.toJS();
    return (
      <div className="g-layout">
        <div className="g-layout-head">列表表格</div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <Button handle={this.refesh}>刷新</Button>
          </div>
          <div className="g-item-show" style={{height: 400, overflow: "auto",}}>
            <TabList
                key={refreshId}
                data={data}
                initSelectVal={initSelectVal}
                {...config}
            >
              <GroupCols forzen={true}>
                <GroupCols.colItem field="eventNo" width={140}>
                  事件编号
                </GroupCols.colItem>
                <GroupCols.colItem field="category_name" width={120}>
                  事件类型
                </GroupCols.colItem>
              </GroupCols>
              <GroupCols>
                <GroupCols.colItem field="a_SHANGBAOSHIJIAN" width={220}>
                  上报日期
                </GroupCols.colItem>
                <GroupCols.colItem field="status_name" width={120}>
                  处理状态
                </GroupCols.colItem>

                <GroupCols.colItem field="category_name" width={180}>
                  事件类型
                </GroupCols.colItem>
              </GroupCols>
              <GroupCols forzen={true}>
                <GroupCols.colItem field="a_SHANGBAOREN" width={120}>
                  上报人
                </GroupCols.colItem>
              </GroupCols>
              <GroupCols>
                <GroupCols.colItem field="eventNo" width={120}>
                  事件编号
                </GroupCols.colItem>
                <GroupCols.colItem field="category_name" width={120}>
                  事件类型
                </GroupCols.colItem>
                <GroupCols.colItem field="status_name" width={120}>
                  处理状态
                </GroupCols.colItem>
              </GroupCols>
            </TabList>
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
                  name="idField"
                  value={idField}
                >
                  节点标识字段 idField:
                </Input>
              </div>
              <div className="inp-item">
                <span>无页码 noPageNums</span>
                <CheckBox
                  name="noPageNums"
                  value="1"
                  type="radio"
                  checked={noPageNums!}
                  changeHandle={this.changeConfig}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noPageNums"
                  value="2"
                  type="radio"
                  checked={!noPageNums}
                  changeHandle={this.changeConfig}
                >
                  否
                </CheckBox>
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
            </div>
          </div>
        <div className="g-item-show">
              <CodeBlock tit={this.getCodeBlockTit1()}>{str1}</CodeBlock>
         </div>
        </div>
       
      </div>
    );
  }
}

export default Demo;
