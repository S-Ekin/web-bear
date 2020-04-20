/**
 * @name name
 * @description description
 * @time 2020-02-27
 */
import * as React from "react";
import "./demo.scss";
import { Combobox} from "@component/combo/index";
import { Input, CheckBox } from "@component/input/index";
import { createImmutableMap } from "@component/util/createImmutaleMap";
import { Button } from "@component/button/index";
import CodeBlock from "@container/codeBlock/CodeBlock";
import * as  ComboSpace from "@component/combo/combo";
import {data,str1,str2,str3,str4} from "./CodeStr";
type item = {
  idField: string;
  textField: string;
  noIcon: boolean; //wu下拉图标
  multiply: boolean; //多选
  tit: string; //提示语
  field: string; //下拉框的标识
  itemIcon: string; //下拉框每行的图标，目录默认用文件夹
  defaultVal: string; //默认选中的
  width: number; //显示框宽度
  maxHeight?: number; //下拉框最大高度
  dropWidth?: number; //下拉框宽度，默认是显示框宽度
  directionUp: boolean; //下拉框在显示框上还是下
  noRequire: boolean; //必选
  renderCallback: boolean; //组件第一次加载调用点击事件的回调函数
  ableClear: boolean; //能够清空所选
};
type fnObj = {
  clickCallback: boolean; //点击每行的回调函数
  formatterDropItem: boolean; //自定义下拉框的文字内容
  formatterVal: boolean;
  clickOrCheckForbid: boolean;
};
type Props = {};
type States = {
  obj: IImmutalbeMap<item & fnObj>;
  comboProps: item;
  refreshId: number;
  outControlSelecte: undefined | { id: string };
};
interface IDemo {
  selectFn: undefined | ((path: string) => void);
}

class Demo extends React.PureComponent<Props, States> implements IDemo {
  selectFn: IDemo["selectFn"] = undefined;
  state: States = {
    obj: createImmutableMap<item & fnObj>({
      idField: "id",
      textField: "text",
      noIcon: false,
      multiply: false,
      tit: "",
      field: "tree",
      itemIcon: "",
      defaultVal: "",
      width: 240,
      maxHeight: undefined,
      dropWidth: undefined,
      directionUp: false,
      noRequire: false,
      renderCallback: false, //组件第一次加载调用点击事件的回调函数
      ableClear: false,
      clickCallback: false, //点击每行的回调函数
      formatterDropItem: false, //自定义下拉框的文字内容
      formatterVal: false,
      clickOrCheckForbid: false
    }),
    comboProps: {
      idField: "id",
      textField: "text",
      noIcon: false,
      multiply: false,
      tit: "",
      field: "tree",
      itemIcon: "",
      defaultVal: "",
      width: 240,
      maxHeight: undefined,
      dropWidth: undefined,
      directionUp: false,
      noRequire: false,
      renderCallback: false, //组件第一次加载调用点击事件的回调函数
      ableClear: false
    },
    refreshId: 1,
    outControlSelecte: undefined
  };

  inpChangeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dom = e.currentTarget;
    const field = dom.name as keyof item;
    let value: any = dom.value;
    if (["width",'maxHeight','dropWidth'].includes(field)) {
      value = ~~value;
    } else if (
      [
        "directionUp",
        "noRequire",
        "ableClear",
        "renderCallback",
        "multiply",
        "noIcon",
        "formatterVal",
        "clickOrCheckForbid",
        "formatterDropItem"
      ].includes(field)
    ) {
      value = value === "1" ? true : false;
    }
    this.setState(pre => {
      return {
        obj: pre.obj.set(field, value)
      };
    });
  };
  refershConfig = () => {
    this.setState(pre => {
      const { clickCallback, formatterDropItem, formatterVal, clickOrCheckForbid, ...obj} = pre.obj.toJS()
      return {
        comboProps: obj,
        refreshId: pre.refreshId + 1
      };
    });
  };

  clickCallback = (
    selecte: ComboSpace.ISelected[],
    field: string,
    node?: IImmutalbeMap<any>
  ) => {
    console.log("-----clickCallback ---");
    console.log(selecte, field, node);
    console.log("-----clickCallback ---");
  };
  clickOrCheckForbid(node: IImmutalbeMap<any>, field: string) {
    console.log("----clickOrCheckForbid-----");
    console.log(node, field);
    console.log("----clickOrCheckForbid-----");
    return true;
  }
  formatterDropItem(node: IImmutalbeMap<any>) {
    return `自定义${node.get("text")}`;
  }
  formatterVal(selecteArr: IImmutalbeList<ComboSpace.ISelected>) {
    console.log(selecteArr);

    return selecteArr
      .map(val => {
        return `$-${val.text}`;
      })
      .join(",");
  }
  btnControlSelect = () => {
    this.setState({
      outControlSelecte: { id: "1" }
    });
  };
  getCodeBlockTit1(){
    const {formatterVal} = this.state.obj.toJS();
    return(
              <>
               <div className="inp-item">
              <span>启用自定义显示框的文字内容 formatterVal</span>
              <CheckBox
                name="formatterVal"
                value="1"
                type="radio"
                checked={formatterVal}
                changeHandle={this.inpChangeFn}
              >
                是
              </CheckBox>
              <CheckBox
                name="formatterVal"
                value="2"
                type="radio"
                checked={!formatterVal}
                changeHandle={this.inpChangeFn}
              >
                否
              </CheckBox>
            </div>
              </>
            )
  }
  getCodeBlockTit2(){
    const {formatterDropItem} = this.state.obj.toJS();
    return(<>
            <div className="inp-item">
              <span>启用自定义下拉框的文字内容 formatterDropItem</span>
              <CheckBox
                name="formatterDropItem"
                value="1"
                type="radio"
                checked={formatterDropItem}
                changeHandle={this.inpChangeFn}
              >
                是
              </CheckBox>
              <CheckBox
                name="formatterDropItem"
                value="2"
                type="radio"
                checked={!formatterDropItem}
                changeHandle={this.inpChangeFn}
              >
                否
              </CheckBox>
            </div>
            </>)
  }

  getCodeBlockTit3(){
    const {clickOrCheckForbid} = this.state.obj.toJS();
    return (
              <>
                <div className="inp-item">
              <span>
                启用 点击或是选中之前做的操作，可以阻止下面的操作
                clickOrCheckForbid
              </span>
              <CheckBox
                name="clickOrCheckForbid"
                value="1"
                type="radio"
                checked={clickOrCheckForbid}
                changeHandle={this.inpChangeFn}
              >
                是
              </CheckBox>
              <CheckBox
                name="clickOrCheckForbid"
                value="2"
                type="radio"
                checked={!clickOrCheckForbid}
                changeHandle={this.inpChangeFn}
              >
                否
              </CheckBox>
            </div>
              </>
            )
  }

  getCodeBlockTit4(){
    return (
              <>
               <div>
              <Button handle={this.btnControlSelect}>选择</Button>
              <small style={{marginLeft: 16,}}><b>外部控制下拉的选择id:1的节点</b></small>
            </div>
              </>
            )
  }
  render() {
    const {
      idField,
      textField,
      noIcon,
      multiply,
      tit,
      field,
      itemIcon,
      defaultVal,
      width,
      maxHeight,
      dropWidth,
      directionUp,
      noRequire,
      formatterDropItem,
      formatterVal,
      clickOrCheckForbid,
      renderCallback, //组件第一次加载调用点击事件的回调函数
      ableClear
    } = this.state.obj.toJS();
    const { comboProps, refreshId, outControlSelecte } = this.state;
    
    return (
      <div className="g-layout comboTree-page">
        <div className="g-layout-head"><h3>列表下拉框</h3></div>
        <div className="g-layout-article">
          <div className="g-item-show config-box">
            <Combobox
              data={data}
              key={refreshId}
              clickCallback={this.clickCallback}
              initComboVal={outControlSelecte}
              clickOrCheckForbid={
                clickOrCheckForbid ? this.clickOrCheckForbid : undefined
              }
              formatterVal={formatterVal ? this.formatterVal : undefined}
              formatterDropItem={
                formatterDropItem ? this.formatterDropItem : undefined
              }
              {...comboProps}
            />
            <Button handle={this.refershConfig}>刷新配置</Button>
          </div>
          <div className="g-item-show config-box">
            <div>
              <div className="inp-item">
                <Input
                  name="idField"
                  changeFn={this.inpChangeFn}
                  value={idField}
                >
                  id字段 idField：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="textField"
                  changeFn={this.inpChangeFn}
                  value={textField}
                >
                  文字内容字段 textField:
                </Input>
              </div>
              <div className="inp-item">
                <span>下拉图标不显示 noIcon</span>
                <CheckBox
                  name="noIcon"
                  value="1"
                  type="radio"
                  checked={noIcon}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noIcon"
                  value="2"
                  type="radio"
                  checked={!noIcon}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>

              <div className="inp-item">
                <span>多选 multiply</span>
                <CheckBox
                  name="multiply"
                  value="1"
                  type="radio"
                  checked={multiply}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="multiply"
                  value="2"
                  type="radio"
                  checked={!multiply}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <Input name="tit" changeFn={this.inpChangeFn} value={tit}
                  norequire={true} 
                >
                  提示语 tit：
                </Input>
              </div>
              <div className="inp-item">
                <Input name="field" changeFn={this.inpChangeFn} value={field}
                >
                  下拉框的标识 field：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="itemIcon"
                  changeFn={this.inpChangeFn}
                  value={itemIcon}
                  norequire={true} 
                >
                  下拉框每行的图标 itemIcon：
                </Input>
              </div>
            </div>
            <div>
              <div className="inp-item">
                <Input
                  name="defaultVal"
                  changeFn={this.inpChangeFn}
                  value={defaultVal}
                  norequire={true} 
                >
                  默认选中的 defaultVal ：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="width"
                  type="number"
                  norequire={true} 
                  changeFn={this.inpChangeFn}
                  value={width + ""}
                >
                  显示框宽度 width：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="maxHeight"
                  norequire={true} 
                  type="number"
                  changeFn={this.inpChangeFn}
                  value={maxHeight ?  maxHeight + "" : '0'}
                >
                  下拉框最大高度 maxHeight:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="dropWidth"
                  norequire={true} 
                  type="number"
                  changeFn={this.inpChangeFn}
                  value={dropWidth ? dropWidth + "" : '0'}
                >
                  下拉框宽度 dropWidth:
                </Input>
              </div>
              <div className="inp-item">
                <span>下拉框在显示框上还是下 directionUp</span>
                <CheckBox
                  name="directionUp"
                  value="1"
                  type="radio"
                  checked={directionUp}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="directionUp"
                  value="2"
                  type="radio"
                  checked={!directionUp}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>必选 noRequire</span>
                <CheckBox
                  name="noRequire"
                  value="1"
                  type="radio"
                  checked={noRequire}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="noRequire"
                  value="2"
                  type="radio"
                  checked={!noRequire}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>能够清空所选 ableClear</span>
                <CheckBox
                  name="ableClear"
                  value="1"
                  type="radio"
                  checked={ableClear}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="ableClear"
                  value="2"
                  type="radio"
                  checked={!ableClear}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
              <div className="inp-item">
                <span>组件第一次加载调用点击事件的回调函数 renderCallback</span>
                <CheckBox
                  name="renderCallback"
                  value="1"
                  type="radio"
                  checked={renderCallback}
                  changeHandle={this.inpChangeFn}
                >
                  是
                </CheckBox>
                <CheckBox
                  name="renderCallback"
                  value="2"
                  type="radio"
                  checked={!renderCallback}
                  changeHandle={this.inpChangeFn}
                >
                  否
                </CheckBox>
              </div>
            </div>
          </div>
          <div className="g-item-show">
            <CodeBlock tit={this.getCodeBlockTit1()}>
              {str1}
            </CodeBlock>
          </div>
          <div className="g-item-show">
            
            <CodeBlock tit={this.getCodeBlockTit2()}>
              {str2}
            </CodeBlock>
          </div>
          <div className="g-item-show ">
          
            <CodeBlock tit={this.getCodeBlockTit3()}>{str3}</CodeBlock>
          </div>
          <div className="g-item-show">
           
            <CodeBlock tit={this.getCodeBlockTit4()}>
              {str4}
            </CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
