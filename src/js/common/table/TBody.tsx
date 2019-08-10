import * as React from "react";
import * as Immutable from "immutable";

type TbodyProps={
    CheckBoxFn: ((checked: boolean, index: number, changeHandle: TbodyProps["changeHandle"]) => React.ReactChild);
	column: MyTabSpace.columnItem[];
	idField: string;
	startIndex: number;
	selectfn:(e:React.MouseEvent<HTMLTableCellElement>)=>void;
	changeHandle: (e:React.ChangeEvent<HTMLInputElement>) => void;
	noOrder?:boolean;
	tabField: string;
	curData:Immutable.List<Immutable.Map<string, any>>;//当前页的数据
}

type TbodyState={

}
class TBody extends React.PureComponent<TbodyProps,TbodyState>{

	rowsapnFn(){



	}
	componentWillReceiveProps(nexrProps:TbodyProps){

		if(nexrProps.curData!=this.props.curData){
			this.is_same = "";
		}



	}
	is_same="";
   render() {

		const { CheckBoxFn, selectfn,column, noOrder,curData, idField,  startIndex, changeHandle ,tabField} = this.props;
		
		
		return curData.map((dataItem, index) => {

			const order = startIndex + 1 + index + "";
			const checked = dataItem.get("checkStatus");
			const selected = dataItem.get("selected");
			return (
					<tr key={dataItem.get(idField)} className={selected && "selected" ||undefined} >
						
						{CheckBoxFn(checked, index, changeHandle)}
						
					{!noOrder?(	<td> {order} </td>):null}
						{
							column.map((node) => {
								const { field, formatter,rowSpanField} = node;
								const text = formatter ? formatter(dataItem.toJS(),order,tabField) : dataItem.get(field);
								if(rowSpanField){
									const _textName = dataItem.get(field);
									// 判断是不是相同的行,相同就不要返回这个td
									if(this.is_same == _textName){
										return undefined;
									}else{
										//重新赋值，便于后面的比较
										this.is_same = _textName ;
										//找到需要合并的行数,从当前行开始往下找

										const rowspanNum = curData.slice(index).findIndex((val)=>{

												return val.get(field) != this.is_same;

										});

										return <td key={field} rowSpan={rowspanNum == -1 ? curData.size : rowspanNum}  >{text}</td>

									}
									
								}else{
									return <td key={field} data-index={order}  onClick={field=="opt"? selectfn:undefined} >{text}</td>
								}
								
							})
						}
					</tr>
				)
								
		})
	}
}

export default TBody;