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
const str5 =` 
class TabView extends React.PureComponent<Props,States> implements ITabView{

getBody(){
        const {data,fixObj,fixObj:{idField,childField},config,viewIndex,changeState} = this.props;
        const {child:cols} = config;
        let order = {order:0} ;
        const trs = data.map((val,index)=>{
            const arr = val.get(childField);
            const id = val.get(idField);
            const isMainView= viewIndex === 0 ;
            if(arr && arr.size){
                return (
                    <ParTree
                        key={id}
                        order={order}
                        changeState={changeState}
                        lev={0}
                        index={index}
                        node={val}
                        cols={cols}
                        isMainView={isMainView}
                        fixObj={fixObj}
                    />
                );
            }else{
                return (
                    <TrItem
                        key={id}
                        order={order}
                        node={val}
                        index={index}
                        changeState={changeState}
                        cols={cols}
                        isMainView={isMainView}
                        lev={0}
                        fixObj={fixObj}
                    />
                );
            }
        });
        const colgroup = this.createColgroup();
        const fn = !config.forzen ? this.scrollFn : undefined;
        const wheel = config.forzen ? this.wheelFn :undefined;
        const makeSignFn = !config.forzen ? this.makeSign :undefined;

        return (
                <div className="tab-body-main" 
                    onScroll={fn} 
                    onWheel={wheel}
                    onMouseEnter={makeSignFn}
                    onMouseLeave={makeSignFn}
                    ref={this.tabBodyRef} 
                >
                    <table>
                        {colgroup}
                        <tbody>
                            {trs} 
                        </tbody>
                    </table>
                </div>
        );
    }
  }

class ParTree extends React.PureComponent<Props,States> implements IParTree{
 getSubBody(){

        const {node,fixObj,fixObj:{childField,idField},cols,lev,isMainView,index,changeState,order}  = this.props;
        const arr:common['data'] = node.get(childField);
        return arr.map((val,oindex)=>{
            const children = val.get(childField);
            const id = val.get(idField);
          
            if(children && children.size){
                    return (
                        <ParTree
                            order={order}
                            key={id}
                            node={val}
                            index={index,oindex}
                            lev={lev+1}
                            changeState={changeState}
                            cols={cols}
                            isMainView={isMainView}
                            fixObj={fixObj}
                        />
                    );
            }else{  
                
                return (
                        <TrItem
                            key={id}
                            order={order}
                            lev={lev+1}
                            node={val}
                            index={index,oindex}
                            changeState={changeState}
                            cols={cols}
                            isMainView={isMainView}
                            fixObj={fixObj}
                        />
                        );
            }
        }); 

    }
    render(){
        const {cols,fixObj,node,lev,isMainView,index,changeState,order} = this.props;
        const colgroup = this.createColgroup();
        const expand = node.get('expand');
       
        return (
            <>
                <TrItem
                    node={node}
                    fixObj={fixObj}
                    cols={cols}
                    lev={lev}
                    order={order}
                    changeState={changeState}
                    index={index}
                    isMainView={isMainView}
                    isPar={true}
                />
                <tr className="tree-td">
                    <td colSpan={cols.length}>
                         <VelocityComponent
					duration={300}
					animation={expand ? "slideDown" : "slideUp"}
					interruptBehavior="queue">
					<div className="tab-body">
                            <table>
                                {colgroup}
                                <tbody>
                                     {this.getSubBody()}
                                </tbody>
                            </table>
                        </div>
				</VelocityComponent>
                        
                    </td>
                </tr> 
               
                
            </>
            
        );
    }
}

class Item extends React.PureComponent<Props,States> implements IItem{
getFirstText(text:string){
        const {lev,isPar,index,fixObj:{multiply},order} = this.props;
        const fn = isPar ? this.clickFn :undefined;
        const className = isPar ? "tree-par" : undefined;
        const check= multiply ? this.checkFn : undefined;
        const checkName = multiply ? 'tree-check' : undefined;
        order.order ++ ;
        return (
            <div onClick={fn} className={className} data-index={index}>
                <span onClick={check} className={checkName}>
                    <span style={{paddingRight: lev*14,}} />
                    {this.getCheck()}
                    {this.getIcon()}
                    {order.order}
                    {text}
                </span>
            </div>
        );
    }
    
    render(){
        const {cols,node,fixObj:{tabField},isMainView} = this.props;
        
        const tds= cols.map((td,index)=>{
            const {field,formatter} = td;
            const text = formatter ? formatter(node,index,tabField) : node.get(field);
            const str = isMainView && index === 0 ? this.getFirstText(text) : text ;
            return (
                <td key={field} className="td-border">
                    {str}
                </td>
            );
        });

        return (
            <tr >
                {tds}
            </tr>
        );
    }
  }
`;    
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
              <GroupCols forzen={true}>
                <GroupCols.colItem width={180} field="name">
                  列1
                </GroupCols.colItem>
                <GroupCols.colItem width={60} field="persons">列2</GroupCols.colItem>
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
                <GroupCols.colItem width={240} field="progress">列3</GroupCols.colItem>
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
          <div className="g-item-show">
            <CodeBlock tit="递归组件ParTree来表示每个节点的序号，层级，路径,关于序号，明白Tritem才是真正渲染的地方，ParTree只是运输过程，在其他地方++order都不行">
              {str5}
            </CodeBlock>
          </div>
        </div>
      </div>
    );
  }
}

export default Demo;
