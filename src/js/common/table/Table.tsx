import * as React from "react";
import { Checkbox } from "@js/common/InputBtn";
import * as Immutable from "immutable";
import {EmptyWarn} from "@js/common/Button";
import Scrollbar from "react-scrollbar";
import PageSize from "./PageSize";
import TabBody from "./TBody";

type TableProps = {
	data: any[];
	hasPageNums?: boolean;
	column: columnItem[],
	idField?: string;
	hasOrder?: boolean;
	checkbox?: boolean,
	defaultSel?:string,
	tabField?:string;
	noOrder?:boolean;
	emptyTxt?:string;
}

type columnItem = {
	text: string;
	width?: number | string;
	field: string;
	formatter?: (node:any,index:string,tabField:string) => React.ReactChild;
	renderTit?: (tabField:string) => React.ReactChild;
}

type TableState = {
	perNums: number;//每页条数
	tableH:number;
	curPage: number;
	tableData: Immutable.List<Immutable.Map<string, any>>;
	pageCheckAll: boolean;
}



export default class Table extends React.PureComponent<TableProps, TableState>{



	static defaultProps = {
		hasPageNums: true,
		idField: "id",
		hasOrder: true,
		checkbox: false,
		emptyTxt:"当前没有数据！",
 		tabField :""
	}

	static CheckBoxFn = (checked: boolean, index: number, changeHandle:  Table["checkItem"]) => {

		return (<td><Checkbox
					changeHandle={changeHandle}
					checked={checked}
					value={index+""}
					nameFiled="user"
					
		/></td>) 
	};

	static NoCheckBoxFn = () => {
		
		return null;
	};

	constructor(props: TableProps) {
		super(props);
		this.state = {
			perNums: 20,
			tableH: 0, //0 的话自动高度
			curPage: 1,
			tableData: this.addStaTusField(props.data,props.defaultSel!,props.idField!),
			pageCheckAll: false,
		}

	}
	addStaTusField(data: TableProps["data"],defaulSel:string,idField:string) {
		const dataCopy = JSON.parse(JSON.stringify(data)).map((val: any) => {
			val.checkStatus = false;
			val.selected = defaulSel == val[idField];
			return val;
		});
		return Immutable.fromJS(dataCopy);
	}
	TableContainer: React.RefObject<HTMLDivElement> = React.createRef();
	componentWillReceiveProps(nextProps: TableProps) {

		if (nextProps.data !== this.props.data || nextProps.defaultSel!=this.props.defaultSel) {

		
			this.setState({
				tableData: this.addStaTusField(nextProps.data,nextProps.defaultSel!,nextProps.idField!),
				curPage:1,
			})
		}

	}
	componentDidMount() {

		
		

	}
	jumpPage = (size: number) => {

		this.setState({
			curPage: size
		})

	}
	selectedHandle=(e:React.MouseEvent<HTMLTableCellElement>)=>{

		const index = e.currentTarget!.dataset.index!;


		this.setState(pre=>{

			const data = pre.tableData ;
			const seleted = data.findIndex(val=>{
				return val.get("selected") 
			});

			

			const tableData = seleted==-1? data.setIn([+index-1,"selected"],true):data.setIn([seleted,"selected"],false).setIn([+index-1,"selected"],true)
			return {
				tableData,

			}
		})

		

	

	}
	checkAll = (status: boolean) => {

		const { perNums, tableData, curPage } = this.state;
		const {hasPageNums} = this.props;
		let num = tableData.size;

		if(hasPageNums){
			//看最后一页是不是满的
			const rest = curPage * perNums - tableData.size
		     num = rest > 0 ? perNums - rest : perNums;
		}
	


		let newData = tableData;
		Array.from({ length: num }).forEach((...args) => {
			const [, index] = args;
			//计算要从当前页的起始位置开始
			newData = newData.updateIn([index + (curPage - 1) * perNums], val => {
				return val.set("checkStatus", !status)
			})

		})

		this.setState({
			tableData: newData
		})
	}

	countTotalStatus(total: number, curData: TableState["tableData"]) {

		const checkedNum = curData.count(val => {
			return val!.get("checkStatus")
		});
		const rest = total - checkedNum;

		const hasChecked = rest > 0 && rest < curData.size;

		const isAllChecked = !hasChecked && total !== 0 && rest === 0;

		return { hasChecked, isAllChecked }

	}
	checkItem = (e: React.ChangeEvent<HTMLInputElement>) => {

		const index = +e.currentTarget!.value;
		const { curPage,perNums } = this.state;
		this.setState(preState => {


			return {
				tableData: preState.tableData.updateIn([index + (curPage - 1) * perNums], (val: Immutable.Map<string, any>) => {
					const status = !val.get("checkStatus");
					return val.set("checkStatus", status);
				})
			}
		})
	}

	getColgroupCom(column: columnItem[]) {

		const {checkbox,noOrder} = this.props;

		return (<colgroup>
			{checkbox ? <col key="checkbox" style={{width:"40px"}}/>:null}

			{ !noOrder ? <col style={{ width: "60px" }} key="order"/>:null}

			{
				column.map(({ width, field }) => {

					const unit = (width+"").includes("%") ?"":"px";
					const wObj = width ? { width: width +  unit} : undefined;

					return <col key={field} style={wObj} />
				})
			}
		</colgroup>)
	}
	barStyle={
		borderRadius:6,
		background:"#c5d0d7"
	}
	changePageNum=(perNums:number)=>{

		this.setState({
			perNums,
			curPage:1
		})



	}
	render() {

		const { hasPageNums, column, idField, checkbox,tabField,noOrder,emptyTxt } = this.props;
		const {perNums, curPage, tableData} = this.state;

		const startIndex = (curPage - 1) * perNums;

		const curData = (hasPageNums ? tableData.slice(startIndex, startIndex + perNums) : tableData) as TableState["tableData"];
		const has_pageNum = hasPageNums && tableData.size > perNums;

		

		const total = curData.size;
		const pages = Math.ceil(tableData.size / perNums);
	

		const CheckBoxFn = checkbox ? Table.CheckBoxFn : Table.NoCheckBoxFn;
		const checkAllStataus = this.countTotalStatus(total, curData)

		const colgroupCom = this.getColgroupCom(column);
		
		return (<div className="g-table" ref={this.TableContainer}>

			<div className={"m-fixTabHead "}>
				<table >
					{colgroupCom}
					<thead >
						<tr>
							

								{checkbox ? (<th ><Checkbox
												changeHandle={() => this.checkAll(checkAllStataus.isAllChecked)}
												checked={checkAllStataus.isAllChecked}
												nameFiled="user"
												
												hasChecked={checkAllStataus.hasChecked}

											/></th>) :null }
							
							{!noOrder?(<th key="order"> 序号 </th>):null}
							{
								column.map(({ text, field ,renderTit}) => {

									return <th key={field}>{renderTit ? renderTit(tabField!) :text}</th>
								})
							}
						</tr>
					</thead>
				</table>
			</div>

		{curData.size  ?(<Scrollbar className="m-fixTabBody"  
					horizontal={false}
					verticalScrollbarStyle={this.barStyle}
					>
						
				<table data-field={tabField}>
					{colgroupCom}
					<tbody>
								<TabBody
									CheckBoxFn={CheckBoxFn as any}
									column={column}
									idField={idField!}
									startIndex={startIndex}
									changeHandle={this.checkItem}
									selectfn={this.selectedHandle}
									noOrder={noOrder}
									tabField={tabField!}
									curData={curData}
								/>
					</tbody>
				</table></Scrollbar>):<div className="m-fixTabBody"> <EmptyWarn txt={emptyTxt}/></div>}
			
			
			{has_pageNum && tableData.size? <PageSize changePageNum={this.changePageNum} total={tableData.size} jumpPage={this.jumpPage} curNum={curPage} pages={pages} /> : null}
		</div>
		
		)


	}



}