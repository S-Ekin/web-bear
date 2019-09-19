/**
 * @name 表格
 * @description description
 * @time 2019-09-18
 */
import * as React from "react";
import * as Immutable from "immutable";
import {Empty} from "../icon/index";
import {CheckBox} from "../input/index";
import Scrollbar from "react-scrollbar";
import PageSize from "./PageSize";
import TabBody from "./TBody";

type Props={
	data: any[];
	noPageNums?: boolean;//页码
	column: MyTabSpace.columnItem[];//列头定义
	idField: string;//表格的节点标识
	checkbox?: boolean;//多选
	defaultSel?: string;//默认选中的
	tabField?: string;//表格标识
	emptyTxt?: string;//空数据时显示文字
    getCheckFn?:(fn:any)=>void;//获取选中的
    initSelectVal?:string;//通过外界改变表格的选中
};
type States= MyTabSpace.tableStates;
interface ITable {
    fieldObj:MyTabSpace.fieldObj;//一些固定不变的属性，用于传给子组件
}
enum checkAllStataus {
    hasChecked="hasCheck",
    checked="checked",
    noChecked="noChecked",
}
class Table extends React.PureComponent<Props,States> implements ITable{
    static defaultProps={
            defaultSel:"",
            emptyTxt:"当前没有数据！",
    };
    fieldObj = this.initFixObj();
	tableContainer: React.RefObject<HTMLDivElement> = React.createRef();
	scrollRef: React.RefObject<Scrollbar> = React.createRef();
    constructor(props:Props){
        super(props);
        const {data,defaultSel,idField} = props;
        this.state={
            perNums:20,
            curPage:1,
            tableData:this.initData(data,defaultSel!,idField),
            curPageCheckAll:checkAllStataus.noChecked
        };
    }
  
    initFixObj(){
        const {idField,checkbox,column,tabField,noPageNums} = this.props;
        return {
            idField,
            checkbox,
            column,
            tabField,
            noPageNums,
        };
    }
    
    initData(data:Props["data"],defaulSel:string,idField:string){

        const defaulSelArr = `${defaulSel}`.split(",");
        return  Immutable.fromJS(data,(_key,val,_path)=>{
                if(Immutable.isKeyed(val)){
                   // 对象
                    let obj = val.toOrderedMap();
                    const id = val.get(idField);
                    //添加选中的字段
                    obj = obj.set("checked",defaulSelArr.includes(`${id}`));
                    return obj ;
                }else{
                    //数组
                    return val.toList();
                }
        });
    }

    scrollToSeletItem(defaultSel?:string){

		if(defaultSel){
			// tslint:disable-next-line: triple-equals
			const item = this.tableContainer.current!.querySelector(".selected") as HTMLTableRowElement;
			if(!item){
				return ;
			}
			const par = this.tableContainer.current!;
			const top = item.offsetTop  - par.clientHeight + item.clientHeight + 100 ; 
			console.log(item.offsetTop,par.clientHeight,top);
			window.setTimeout(()=>{
				(this.scrollRef.current! as any).scrollYTo(Math.max(0,top));
			},10);
		}
    }
    getColGroupCom() {
		const { checkbox ,column} = this.props;

        const cheboxCom = checkbox ? (
					<col key="checkbox" style={{ width: "40px", }} />
                ) : undefined;

        const list =  column.map(({ width, field }) => {
                    let wObj ;
                    if(width){
                        const unit = (`${width}`).includes("%") ? "" : "px";
                        wObj = width ? { width: `${width}` + unit } : undefined;
                    }else{
                        wObj = undefined;
                    }
					return <col key={field} style={wObj} />;
				});
		return (
			<colgroup>
				{cheboxCom}
                <col style={{ width: "60px",}} key="order" />
				{list}
			</colgroup>
		);
    }
    checkCurPageAll=()=>{
        console.log(2);
        
    }
    getFixHead(){

        const {checkbox,column,tabField} = this.props;
        const {curPageCheckAll} = this.state;


        const colgroupCom = this.getColGroupCom();
        const checkCom = checkbox ? (
									<th>
										<CheckBox
											changeHandle={this.checkCurPageAll}
											checked={curPageCheckAll === checkAllStataus.checked}
											name="checkAll"
											hasChecked={curPageCheckAll === checkAllStataus.hasChecked}
										/>
									</th>
                                ) : undefined;
                                
        const colTixList = column.map(({ text, field, renderTit }) => {
                    const textCom = renderTit
												? renderTit(text,field,tabField)
												: text;
									return (
										<th key={field}>
											{textCom}
										</th>
									);
								});
        return (
            	<table>
						{colgroupCom}
						<thead>
							<tr>
								{checkCom}
							    <th key="order"> 序号 </th> 
								{colTixList}
							</tr>
						</thead>
					</table>
			
        );
    }

    changeState=<P extends keyof States>(field:P,data:States[P])=>{
         
        this.setState({
            [field as "curPage"]:data as any
        });
    }
   
    getTableBody(){

        const {curPage,tableData,perNums} = this.state ;
        
        return (
                    <Scrollbar
						className="m-fixTabBody"
						horizontal={false}
						ref={this.scrollRef}
                    >
						<table >
							{this.getColGroupCom()}
							<tbody>
								<TabBody
                                    curPage={curPage}
                                    perNums={perNums}
									changeHandle={this.changeState}
                                    tableData={tableData}
                                    fileObj={this.fieldObj}
								/>
							</tbody>
						</table>
					</Scrollbar>
        );
    }
    render(){
        const {
			noPageNums,
			emptyTxt,
		} = this.props;
		const { perNums, curPage, tableData } = this.state;
		const totalPages = Math.ceil(tableData.size / perNums);
        
        const mianBody = tableData.size ? this.getTableBody() : (
					<div className="m-fixTabBody">
						<Empty
							txt={emptyTxt}
						/>
					</div>
                );
                
        const pageSize = !noPageNums && tableData.size ? (
					<PageSize
						changeHandle={this.changeState}
						totalNums={tableData.size}
                        curPage={curPage}
						totalPages={totalPages}
					/>
				) : undefined;
		return (
			<div className="g-table" ref={this.tableContainer}>
				<div className={"m-fixTabHead "}>
                    {this.getFixHead()}
            	</div>
				{mianBody}
				{pageSize}
			</div>
		);
    }
}


export default Table;