/**
 * @name 表格主体
 * @description description
 * @time 2019-09-19
 */
import {fieldObj,ITableFn} from "./mytable";
import * as React from "react";
import { CheckBox } from "../input/index";

type Props = {
	curPage:number;//当前页码
	perNums:number;//当前每页显示的条数
	tableData: IImmutalbeList<IImmutalbeMap<any>>; //当前页的数据
	fileObj:fieldObj;
	changeHandle: ITableFn["changeState"];
};
interface ITBody {
	isSameTr: string; //中间变量用于保存要合并的行的某个列的名称
}
// tslint:disable-next-line: variable-name
const TdCheckBox:React.SFC<{
	checked:boolean;
	index:string;
	changeFn:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}> = ({changeFn,index,checked})=>{

	return (
			<td>
					<CheckBox
						checked={checked}
						value={index}
						type="checkbox"
						changeHandle={changeFn}
					/>
				</td>
	);

};
type TbodyState = {};
class TBody extends React.PureComponent<Props, TbodyState> implements ITBody {
	isSameTr = "";
	
	//#todo:要改
	componentWillReceiveProps(nexrProps: Props) {
		if (nexrProps.tableData !== this.props.tableData) {
			this.isSameTr = "";
		}
	}

	getCheckCom(checkbox?:boolean) {
		return checkbox ?  TdCheckBox : () => <></>;
	}

	selectfn = () => {
		console.log(3);
	}
	checkFn = (e:React.ChangeEvent<HTMLInputElement>)=>{
		const dom = e.currentTarget;
		const value  = dom.value;
		const checked = dom.checked;

		const {tableData,changeHandle} = this.props;

		const newData = tableData.setIn([value,"checked"],checked);
		changeHandle<"tableData">("tableData",newData);

	}
	render() {
		const { perNums, curPage,fileObj, tableData } = this.props;

		const { idField, tabField, column, checkbox,noPageNums } = fileObj;
		const startIndex = (curPage - 1) * perNums;

        //当前页的数据
		const curData = (!noPageNums
			? tableData.slice(startIndex, startIndex + perNums)
            : tableData);

		// tslint:disable-next-line: variable-name
		const CheckBoxOrNull = this.getCheckCom(checkbox);

		return curData.map((dataItem, index) => {
			const order = `${startIndex + 1 + index}`;
			const checked = dataItem.get("checked");
			const selected = checked ? "selected" : undefined;

			const trCom = column.map(node => {
				const { field, formatter, isRowSpanField } = node;
				const text = formatter
					? formatter(dataItem, order, tabField)
					: dataItem.get(field);
				if (isRowSpanField) {
					const _textName = dataItem.get(field);
					// 判断是不是相同的行,相同就不要返回这个td
					if (this.isSameTr === _textName) {
						return undefined;
					} else {
						//重新赋值，便于后面的比较
						this.isSameTr = _textName;
						//找到需要合并的行数,从当前行开始往下找

						const rowspanNum = curData
							.slice(index)
							.findIndex(val => {
								return val.get(field) !== this.isSameTr;
							});
							const rowSpan  = rowspanNum === -1 ? curData.size : rowspanNum;
							return (
							<td
								key={field}
								rowSpan={rowSpan}>
								{text}
							</td>
						);
					}
				} else {
					return (
						<td
							key={field}
							data-index={order}
							onClick={field === "opt" ? this.selectfn : undefined}>
							{text}
						</td>
					);
				}
			});
			return (
				<tr key={dataItem.get(idField)} className={selected}>
					<CheckBoxOrNull 
						checked={checked}
						changeFn={this.checkFn}
						index={`${index+startIndex}`}
					/>
					<td>{order} </td>
					{trCom}
				</tr>
			);
		});
	}
}

export default TBody;
