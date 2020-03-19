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
import { Button } from "@component/button/index";
import { Input, CheckBox } from "@component/input/index";
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
  // getCheckFn?:(fn:any)=>void;//获取选中的
  // clickOrCheckForbid?:(node:IImmutalbeMap<any>,field:string)=>boolean;
  // bindGetSelectedFn?:(getSelected:()=>IImmutalbeList<IImmutalbeMap<any>>)=>void;//把获取选中的项的函数传递给外部
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
  height: 240,
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
const str2 = `
 .g-content {
    flex: 1;/* 很重要，为auto的话，即使兄弟元素固定宽度，只要它缩放会影响兄弟元素 */
    overflow: hidden; // 防止子元素过宽，不能隐藏
    //  min-width: 1000px;
    min-height: 600px;
    height: 100%;
  }
  .tab-head-wrap {
    position: relative;
    overflow: hidden;

    .tab-head {
      float: left;
    }
  }
 `;
const str3 =`// 递归比较dom里table、tr高度
 function mapDom(domArr:HTMLDivElement[]){
        
        const tableArr = domArr.map(val=>val.firstElementChild!);
        const tabHArr = tableArr.map(val=>val.clientHeight).sort();
        
        if(tabHArr[0] !== tabHArr[tabHArr.length-1]){ // 高度不同

            let viewTrArr = tableArr.map(val=>{
                return val.lastElementChild!.children;
            });

            [...viewTrArr[0]].map((val,index)=>{

                const trHdom = viewTrArr.map(trArr=>{
                    return trArr[index];
                });
                const trH = trHdom.map(val=>val.clientHeight).sort();
                const trHMax = trH[trH.length-1];

                if(trH[0]!== trHMax){ // 高度不同
                    if(val.classList.contains('tree-td')){
                        const domArr = trHdom.map(val=>{
                            return val.firstChild!.firstChild! as HTMLDivElement;
                        });
                        this.mapDom(domArr);
                            
                    }else{
                            //设置高度
                            trHdom.forEach(tr=>{
                                [...tr.children].forEach(td=>{

                                    (td as HTMLTableCellElement).style.height = trHMax+"px";
                                });
                            });
                        }
                    }
            });
        }
    }`;
const str4 =` 
//用while代替递归
    function whilefn () {
        const rootRoot = this.tabMainTabBodyDomArr;
        let domArr = [rootRoot] ;

        while (domArr.length) {
         
           const contains:any[] = [];
           domArr.forEach(arr=>{

                const tabDomArr =  arr.map(val=>{
                  return val.firstElementChild!;
                });

                const tabHArr = tabDomArr.map(val=>{
                    return val.clientHeight;
                }).sort();
                const maxH = tabHArr[tabHArr.length-1];

                if(tabHArr[0]!==maxH){ // 高度不同
                    // tslint:disable-next-line: variable-name
                    const trArr_Arr = tabDomArr.map(val=>{
                            return val.lastElementChild!.children;
                    });

                    [...trArr_Arr[0]].forEach((tr,index)=>{

                        const trDomArr = trArr_Arr.map(trArr=>{
                            return trArr[index];
                        });

                        const trHArr = trDomArr.map(val=>{
                            return val.clientHeight;
                        }).sort();

                        const trHMax = trHArr[trHArr.length-1];
                        if(tr.classList.contains('tree-td')){
                           const childDomArr = trDomArr.map(val=>{
                                return val.firstChild!.firstChild!;
                            });
                            contains.push(childDomArr);
                        }else{
                            trDomArr.forEach(val=>{
                                (val as HTMLElement).style.height = trHMax + px;
                            });
                        }
                    });
                }
           });    
           
           domArr = contains;
        }
    }`;
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
    } else if (["multiply"].includes(name)) {
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
      defaultSel
    } = immuConfig.toJS();
    const code1 = (
    <>
       <div>
         外部控制下拉的选择id:21,22的节点
                <Button handle={this.changeSelect}>选择</Button>
        </div>
    </>
    );
    return (
      <div className="g-layout">
        <div className="g-layout-head">
          <h3>树形表格</h3>
        </div>
        <div className="g-layout-article">
          <div className="g-item-show">
            <Button handle={this.refesh}>刷新</Button>
          </div>
          <div className="g-item-show">
            <TreeTable
              key={refreshId}
              data={data}
              initSelectVal={initSelectVal}
              {...config}
            >
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
                  空数据时显示文字 emptyTxt:
                </Input>
              </div>
              <div className="inp-item">
                <Input
                  changeFn={this.changeConfig}
                  name="tabField"
                  value={tabField!}
                >
                  表格标识 tabField:
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
             
              <CodeBlock tit={code1}>{str1}</CodeBlock>
          </div>
          <div className="g-item-show">
              <CodeBlock language="scss" tit="表格高度和宽度能自适应和有滚动条的关键css">{str2}</CodeBlock>
          </div>
          <div className="g-item-show">
              <CodeBlock tit="递归比较dom">{str3 + str4}</CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
