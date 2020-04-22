/**
 * @name name
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import data from "./data";
import Table from "@component/table/index";
import {Button} from "@component/button/index";
import * as Immutable from "immutable";
import {createImmutableMap} from "@component/util/createImmutaleMap";
import Layout from "@component/layout/Layout";
import CodeBlock from "@container/codeBlock/CodeBlock";
import {str1} from "./CodeStr";
import {CheckBox,Input,Search} from "@component/input/index";
type Props={

};
type States={
	tableData:any[];
	selectTableVal:{id:string};
	immuConfig:IImmutalbeMap<config>;
	config:config;
	refreshId:number;
};
interface IDemo {
  tableGetCheckedFn:()=>IImmutalbeList<IImmutalbeMap<any>>;
}
type report ={
    a_FASHENGSHIJIAN: string
    a_SHANGBAOREN: string
    a_SHANGBAOSHIJIAN: string
    b_SHIJIANLEIBIE1: string
    category_name: string
    eventNo: string
    event_id: string;
    function_reject: string;
    orgList: any[]
    org_id: string;
    org_name: string
    qc_reject: string
    shijianleixing: string
    status: string;
    status_name: string
    type_id: string;
};
type config = {
	noPageNums:boolean;
	idField: string;
	checkbox:boolean;
	defaultSel: string;
	tabField: string;
	emptyTxt: string;
	hasBorder?:boolean;
	height:number;
};

const config:config = {
	noPageNums:false,
	idField: "event_id",
	checkbox: false,
	defaultSel: "",
	tabField: "",
    hasBorder:false,
	emptyTxt: "",
	height:0,
};
class Demo extends React.PureComponent<Props,States> implements IDemo{
    
    formatterObj ={
		eventType:function(node:IImmutalbeMap<report>){
					return node.get("category_name") || "--";
				},
		date:function(node: IImmutalbeMap<report>) {
					let time = node.get("a_SHANGBAOSHIJIAN") || "";
					return `${time.substr(0, 4)}-${time.substr( 4, 2)}-${time.substr(6, 2)}`;
				},
		reporter:(node: IImmutalbeMap<report>) => {
					return <span>{node.get("a_SHANGBAOREN") || "匿名"}</span>;
				},
		opt:(node: IImmutalbeMap<report>) => {
					return (
						<span
							className="m-optBtn"
							data-event_id={node.get("event_id")}
							data-status_name={node.get("status_name")}
							data-type_id={node.get("type_id")}>
                                <Button>操作</Button>
						</span>
					);
				}
	}; 
	
    state:States={
		tableData:data,
		selectTableVal:{id:""},
		immuConfig:createImmutableMap(config),
		refreshId:0,
		config:config,
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
		} else if (["checkbox", "noOrder", "noPageNums","hasBorder"].includes(name)) {
		value = value === "1" ? true : false;
		}

		this.setState(pre => {
		return {
			immuConfig: pre.immuConfig.set(name, value)
		};
		});
  	}
	tableGetCheckedFn:IDemo["tableGetCheckedFn"] =function () {
		return Immutable.List([]); 
	};
	bindgetTableSelecte=(fn:IDemo["tableGetCheckedFn"])=>{
		this.tableGetCheckedFn = fn;
	}	
	getRandomData=()=>{
		const leg = data.length;
		const max = leg + 1 ;
		const random =Math.floor(Math.random()*max);
		this.setState({
			tableData:data.slice(random)
		});

	}
	selectVal=(keyWord:string,_field:string)=>{
		this.setState({
			selectTableVal:{
				id:keyWord
			}
		});
	}
	clearData=()=>{
		this.setState({
			tableData:[]
		});
	}
	getChecked=()=>{
		const arr = this.tableGetCheckedFn();
		console.log(arr);
	}
    render(){
		const {tableData,selectTableVal,immuConfig,refreshId ,config} = this.state;
		const {noPageNums,idField,defaultSel,tabField,emptyTxt,checkbox,hasBorder,height} = immuConfig.toJS();

        return (
          <Layout tit="普通表格">
            <div className="g-item-show">
              <div>
                <Button handle={this.refesh}>刷新配置</Button>
              </div>
              <div className="flex-between">
                <div>
                  <div className="inp-item">
                    <span>无页码 noPageNums：</span>
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
                    <span>有边框 hasBorder：</span>
                    <CheckBox
                      name="hasBorder"
                      value="1"
                      type="radio"
                      checked={hasBorder!}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="hasBorder"
                      value="2"
                      type="radio"
                      checked={!hasBorder}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="idField"
                      value={idField}
                      changeFn={this.changeConfig}
                    >
                      标识字段 idField：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="defaultSel"
                      norequire={true}
                      value={defaultSel}
                      changeFn={this.changeConfig}
                    >
                      默认选中的 defaultSel：
                    </Input>
                  </div>
                </div>
                <div>
                  <div className="inp-item">
                    <span>多选  checkbox：</span>
                    <CheckBox
                      name="checkbox"
                      value="1"
                      type="radio"
                      checked={checkbox}
                      changeHandle={this.changeConfig}
                    >
                      是
                    </CheckBox>
                    <CheckBox
                      name="checkbox"
                      value="2"
                      type="radio"
                      checked={!checkbox}
                      changeHandle={this.changeConfig}
                    >
                      否
                    </CheckBox>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="tabField"
					  value={tabField}
					  norequire={true}
                      changeFn={this.changeConfig}
                    >
                      表格标识 tabField：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <Input
                      name="emptyTxt"
					  norequire={true}
					  width={280}
                      value={emptyTxt}
                      changeFn={this.changeConfig}
                    >
                      无数据提示 emptyTxt：
                    </Input>
                  </div>
				  <div className="inp-item">
                    <Input
					  name="height"
					  type="number"
					  norequire={true}
                      value={`${height}`}
                      changeFn={this.changeConfig}
                    >
                      表格高度 height：
                    </Input>
                  </div>
                </div>
              </div>
            </div>
            <div className="g-item-show">
              <div className="m-optBtn">
                <Button handle={this.getRandomData}>重新获取数据</Button>
                <Button handle={this.clearData}>clear</Button>
                <Button handle={this.getChecked}>获取选中的</Button>
                <Search
                  searchHandle={this.selectVal}
                  field="eventId"
                  tip="搜索事件编号的后4位为id"
                  width={300}
                />
              </div>
              <div style={{ marginTop: 20, height: 400, overflow: "auto",}}>
                <Table
                  key={refreshId}
                  data={tableData}
                  {...config}
                  initSelectVal={selectTableVal}
                  bindGetSelectedFn={this.bindgetTableSelecte}
                >
                  <Table.colItem width={150} field="eventNo">
                    事件编号
                  </Table.colItem>
                  <Table.colItem
                    width={150}
                    field="category_name"
                    formatter={this.formatterObj.eventType}
                  >
                    事件类型
                  </Table.colItem>
                  <Table.colItem
                    width={140}
                    field="a_SHANGBAOSHIJIAN"
                    align="left"
                    formatter={this.formatterObj.date}
                  >
                    上报日期
                  </Table.colItem>
                  <Table.colItem
                    width={100}
                    field="a_SHANGBAOREN"
                    formatter={this.formatterObj.reporter}
                  >
                    上报人
                  </Table.colItem>
                  <Table.colItem width={120} field="status_name" isRowSpanField={true}>
                    处理状态
                  </Table.colItem>
                  <Table.colItem width={100} field="org_name">
                    上报科室
                  </Table.colItem>
                  <Table.colItem
                    width={200}
                    field="opt"
                    formatter={this.formatterObj.opt}
                  >
                    操作
                  </Table.colItem>
                </Table>
              </div>
            </div>
            <div className="g-item-show">
              <CodeBlock tit="表格头部作为子组件渲染，把表格的配置组件化" language="html">{str1}</CodeBlock>
            </div>
          </Layout>
        );
    }
}


export default Demo;