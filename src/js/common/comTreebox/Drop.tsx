import * as React from "react";
import * as Immutable from "immutable";
import { VelocityComponent } from "velocity-react";

type Parprops = {
	itemObj: Immutable.Map<string, any>;
	lev: number;
	oIndex: string;
} & Pick<DropProps, Exclude<keyof DropProps, "data">>


enum CheckStatus {
	checked = "checked",
	hasCheck = "hasCheck",
	uncheck = "uncheck",
}


type Parstates = {


};

class ChildCom extends React.PureComponent<Parprops>{

	render() {
		const { lev, itemObj, oIndex, getFieldVal, getCommonMethod } = this.props;

		const textFiled = getFieldVal("textFiled");
		const icon = getFieldVal("icon");


		const text = itemObj.get(textFiled);
		const checkStatus = itemObj.get("checkStatus");

		const checkCom = getCommonMethod<"getCheckBox">("getCheckBox")(checkStatus, oIndex, false);

		const activeName = !checkCom && checkStatus == CheckStatus["checked"] ? "active" : "";

		const clickFn = !!checkCom ? undefined : getCommonMethod<"clickItem">("clickItem");


		return (<li>
			<div className={"m-combo-item " + activeName} data-index={oIndex} onClick={clickFn}>
				<span className="g-item-text" style={{ paddingLeft: lev + "em" }}>
					{checkCom}
					<i className={icon}>&nbsp;</i> 
					<span>{text}</span>
				</span>
			</div>
		</li>)
	}
}

class ParCom extends React.PureComponent<Parprops, Parstates>{

	render() {

		const { itemObj, lev, oIndex, getFieldVal, getCommonMethod } = this.props;

		let _lev = lev;
		_lev++;

		const textFiled = getFieldVal("textFiled");
		const childField = getFieldVal("childField");
		const idField = getFieldVal("idField");
		const parCanClick = getFieldVal("parAbleClick");


		const text = itemObj.get(textFiled);
		const expand = itemObj.get("state");
		const checkStatus = itemObj.get("checkStatus");



		const checkCom = getCommonMethod<"getCheckBox">("getCheckBox")(checkStatus, oIndex, true);
		const expandToggle = getCommonMethod<"expandToggle">("expandToggle");
		 
		const clickBack = parCanClick ? getCommonMethod<"clickItem">("clickItem") :undefined;

		const activeName = !checkCom && {checked:"active",hasCheck:"activeClick",uncheck:""}[checkStatus as "checked"] || "";

		return (<li >
			<div className={"m-combo-item " + activeName} >
				<span className="g-item-text" data-index={oIndex} style={{ paddingLeft: lev + "em" }} 
				onClick={clickBack}>
					{checkCom}
					<span className={!expand ? "fa fa-folder-o " : "fa fa-folder-open-o"}>&nbsp;</span>
					<span>{text}</span>
				</span>
				<span className="j-slide" data-path={oIndex} onClick={expandToggle}>
					<i className={"fa " + (expand ? "fa-chevron-up" : "fa-chevron-down")}></i>
				</span>
			</div>
			<VelocityComponent animation={(expand ? "slideDown" : "slideUp")} duration={300}>
				<ul>
					{

						itemObj.get(childField).map((val: Immutable.Map<string, any>, index: number) => {

							const sub = val.get(childField) as Immutable.List<Immutable.Map<string, any>>;

							if (sub.size) {
								return <ParCom
									key={val.get(idField)}
									itemObj={val}
									oIndex={oIndex! + "@" + index}
									lev={_lev}
									getFieldVal={getFieldVal}
									getCommonMethod={getCommonMethod}
								/>

							} else {

								return <ChildCom
									key={val.get(idField)}
									itemObj={val}
									lev={_lev}
									oIndex={oIndex! + "@" + index}
									getFieldVal={getFieldVal}
									getCommonMethod={getCommonMethod}
								/>
							}
						})
					}
				</ul>
			</VelocityComponent>

		</li>)
	}
}





type DropProps = {

	data: Immutable.List<Immutable.Map<string, any>>;
	getFieldVal: ComTreeboxSpace.comTreeboxAPI["getFieldVal"];
	getCommonMethod: ComTreeboxSpace.comTreeboxAPI["getCommonMethod"];
}

type DropState = {


}





export default class Drop extends React.PureComponent<DropProps, DropState>{

	render() {

		const { data, getFieldVal, getCommonMethod } = this.props;

		const childField = getFieldVal("childField");
		const idField = getFieldVal("idField");


		return (<>
			{
				data.map((val, index) => {
					if (val.get(childField!).size) {
						return <ParCom key={val.get(idField)}
							itemObj={val}
							lev={0}
							oIndex={index + ""}
							getFieldVal={getFieldVal}
							getCommonMethod={getCommonMethod}
						/>
					}
				})
			}
		</>)
	}

}



