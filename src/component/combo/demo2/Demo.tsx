/**
 * @name name
 * @description description
 * @time 2020-02-27
 */
import * as React from "react";
import "./demo.scss";
import { ComboTree } from "@component/combo/index";
import { Input, CheckBox } from "../../input/index";

type Props = {};
type States = {
  obj: {
    idField: string;
    textField: string;
    noIcon: boolean; //wu下拉图标
    multiply: boolean; //多选
    tit: string; //提示语
    field: string; //下拉框的标识
    itemIcon: string; //下拉框每行的图标，目录默认用文件夹
    defaultVal: string; //默认选中的
    width: string; //显示框宽度
    maxHeight: string; //下拉框最大高度
    dropWidth: string; //下拉框宽度，默认是显示框宽度
    directionUp: boolean; //下拉框在显示框上还是下
    noRequire: boolean; //必选
    renderCallback: boolean; //组件第一次加载调用点击事件的回调函数
    ableClear: boolean; //能够清空所选
    // clickMethod?:(clickFn:(path?:string)=>void)=>void;//暴露实例方法
    // //自定义显示框的文字内容，selected所选择的内容
    // formatterVal?: (selected: states["selected"]) => React.ReactChild;
    // //自定义下拉框的文字内容
    // formatterDropItem?: (node:IImmutalbeMap<any>) => React.ReactChild;
    // //点击每行的回调函数
    // clickCallback(selected: ComboSpace.Iselected[], field: string,node?:IImmutalbeMap<any>): void;
  };
};
interface IDemo {}

const data = [
  {
    text: "1",
    id: "1",
    children: [
      {
        text: "1-1",
        id: "1-1"
      },
      {
        text: "1-2",
        id: "1-2"
      }
    ]
  },
  {
    text: "2",
    id: "2",
    children: [
      {
        text: "2-1",
        id: "2-1",
        children: [
          {
            text: "2-1-1",
            id: "2-1-1"
          }
        ]
      },
      {
        text: "2-2",
        id: "2-2"
      }
    ]
  }
];
class Demo extends React.PureComponent<Props, States> implements IDemo {
  state: States = {
    obj: {
      idField: "",
      textField: "",
      noIcon: false,
      multiply: false,
      tit: "",
      field: "",
      itemIcon: "",
      defaultVal: "",
      width: "",
      maxHeight: "",
      dropWidth: "",
      directionUp: false,
      noRequire: false,
      renderCallback: false, //组件第一次加载调用点击事件的回调函数
      ableClear: false
      // clickMethod?:(clickFn:(path?:string)=>void)=>void;//暴露实例方法
      // //自定义显示框的文字内容，selected所选择的内容
      // formatterVal?: (selected: states["selected"]) => React.ReactChild;
      // //自定义下拉框的文字内容
      // formatterDropItem?: (node:IImmutalbeMap<any>) => React.ReactChild;
      // //点击每行的回调函数
      // clickCallback(selected: ComboSpace.Iselected[], field: string,node?:IImmutalbeMap<any>): void;
    }
  };
  clickFn = (selecte: ComboSpace.Iselected[]) => {
    console.log(selecte);
  };
  inpChangeFn = () => {};
  render() {
    const {
      obj: {
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
        renderCallback, //组件第一次加载调用点击事件的回调函数
        ableClear
      }
    } = this.state;

    return (
      <div className="g-layout comboTree-page">
        <div className="g-layout-head">树形下拉框</div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <ComboTree data={data} field="tree" clickCallback={this.clickFn} />
          </div>
          <div className="g-item-show">
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
                <Input name="tit" changeFn={this.inpChangeFn} value={tit}>
                  提示语 tit：
                </Input>
              </div>
              <div className="inp-item">
                <Input name="field" changeFn={this.inpChangeFn} value={field}>
                  下拉框的标识 field：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="itemIcon"
                  changeFn={this.inpChangeFn}
                  value={itemIcon}
                >
                  下拉框每行的图标，目录默认用文件夹 itemIcon：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="defaultVal"
                  changeFn={this.inpChangeFn}
                  value={defaultVal}
                >
                  默认选中的 defaultVal ：
                </Input>
              </div>
              <div className="inp-item">
                <Input name="width" changeFn={this.inpChangeFn} value={width}>
                  显示框宽度 width：
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="maxHeight"
                  changeFn={this.inpChangeFn}
                  value={maxHeight}
                >
                  下拉框最大高度 maxHeight:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  name="dropWidth"
                  changeFn={this.inpChangeFn}
                  value={dropWidth}
                >
                  下拉框宽度，默认是显示框宽度 dropWidth:
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
                  name=" noRequire"
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

              {`data: any[];
                               
                                clickMethod?:(clickFn:(path?:string)=>void)=>void;//暴露实例方法
                                //自定义显示框的文字内容，selected所选择的内容
                                formatterVal?: (selected: states["selected"]) => React.ReactChild;
                                //自定义下拉框的文字内容
                                formatterDropItem?: (node:IImmutalbeMap<any>) => React.ReactChild;
                                //点击每行的回调函数
                                clickCallback(selected: ComboSpace.Iselected[], field: string,node?:IImmutalbeMap<any>): void;`}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
