/**
 * @name 下拉框行
 * @description 树形下拉框的子项和列表下拉框的行
 * @time 2019-08-16
 */
import * as React from "react";
import { SvgIcon } from "../icon/index";
enum activeStatus {
	select = "selected",
	hasSelect = "hasSelect",
	noSelect = "noSelect",
}


type comboType = keyof ComboSpace.IDrop;
type props<P extends comboType> = {
	node: IImmutalbeMap<any>;
	fieldObj: ComboSpace.drop<P>["filedObj"];
	index: string; //节点索引
	lev?: number; //树形节点的层级
	CheckBox?: React.ComponentType<ComboSpace.ICheckboxCom>;
    checkMethod?:(value:string)=>void;
	formatterDropItem?: (node: IImmutalbeMap<any>) => React.ReactNode;
	clickFn(index:string):void;
};
type states = {};
interface IDropItem {
	getCheckbox(text:string,icon:JSX.Element|undefined): JSX.Element;
}

class DropItem<P extends comboType>
	extends React.PureComponent<props<P>, states>
	implements IDropItem {
	state: states = {};
	checkFn = (e: React.ChangeEvent<HTMLInputElement>) => {
		const dom = e.currentTarget!;
		const value = dom.value!;
		this.props.checkMethod!(value);
	}
	
	getCheckbox(text:string,icon:JSX.Element|undefined) {
		const { node, index, CheckBox } = this.props;
		const active = node.get("active");
		const hasChecked = activeStatus.hasSelect === active;
		const checked = activeStatus.select === active;
		return CheckBox ? (
			 <CheckBox 
                hasChecked={hasChecked}
                checked={checked}
                value={index}
                changeHandle={this.checkFn}
            > 
				{icon}
              <span className="combo-text">{text}</span>
            </CheckBox>
		) : (
			<>
				{icon}
				<span className="combo-text">{text}</span>
		    </>
		);
	}
	clickFn=(e:React.MouseEvent<HTMLDivElement>)=>{
		const dom = e.currentTarget!;
		const index = dom.dataset.index!;
		this.props.clickFn(index);
	}
	render() {
		const { node, index, lev, fieldObj, formatterDropItem } = this.props;

		//层级间的距离左侧的距离
		const levSpaceStyle =
			lev !== undefined ? { paddingLeft: `${lev}em` } : undefined;
		const icon = fieldObj.get("itemIcon")!;
		const text = formatterDropItem
			? formatterDropItem(node)
			: node.get(fieldObj.get("textField"));
		const multiply = fieldObj.get("multiply")!;
		const iconCom = icon ? <SvgIcon className={icon} /> : undefined;
		// 因为list 不会传lev,通过levSpaceStyle 判断是tree还是list
		const fn = levSpaceStyle && multiply ? undefined: this.clickFn;
			
		const activeName =
			levSpaceStyle && multiply
				? ""
				: node.get("active") === activeStatus.select
				? "active"
				: "";
		return (
			<li>
				<div
					className={`m-combo-item ${activeName}`}
					data-index={index}
					onClick={fn}>
					<span className="g-item-text" style={levSpaceStyle}>
						{this.getCheckbox(text,iconCom )}
					</span>
				</div>
			</li>
		);
	}
}

export { DropItem, activeStatus };
