
import * as React from "react";
import * as Immutable from "immutable" ;




type ItemComboProp = {
		getPropFieldVal(field:ComboboxSpace.field):string;
		clickFn:ComboboxSpace.comboboxAPI["clickFn"];
		node:TypedMap<ComboboxSpace.comboboxAPI["itemNode"]>;
		index:number;
}

type DropProp={
	data:Immutable.List<TypedMap<ComboboxSpace.comboboxAPI["itemNode"]>>;
	clickHande:ItemComboProp["clickFn"];
	getPropFieldVal(field:ComboboxSpace.field):string;
}

type DropState={

}



class ItemCombo extends React.PureComponent<ItemComboProp>{

	render(){


					const {node,getPropFieldVal,clickFn,index} = this.props;
		
					const active = node.get("active");
					const icon = getPropFieldVal("icon");
					const textField = getPropFieldVal("textField") as any;
					const text = node.get(textField);

					return (<li onClick={clickFn}  data-index={index} className={"m-combo-item " + (active ? "active" : "")}>
									{ icon ? <span className={icon}></span>:""}
									 <span>{text}</span>
								 </li>)
	}
}



export default class DropCom extends React.PureComponent<DropProp,DropState>{

		static ItemCombo:React.SFC<ItemComboProp> = ({getPropFieldVal,clickFn,node,index})=>{

						const active = node.get("active");
						const icon = getPropFieldVal("icon");
						const textField = getPropFieldVal("textField") as any;
						const text = node.get(textField);

						return (<li onClick={clickFn}  data-index={index} className={"m-combo-item " + (active ? "active" : "")}>
										{ icon ? <span className={icon}></span>:""}
										 <span>{text}</span>
									 </li>)
					}

		render(){

			const {data,clickHande,getPropFieldVal} = this.props;
			const idField = getPropFieldVal("idField") as any;



			return (<>
									{
										data.map((val,index)=>{
													const id = val.get(idField);
													return <ItemCombo node={val} index={index} getPropFieldVal={getPropFieldVal}   clickFn={clickHande} key={id}/>
										})
									}
							</>)
		}


}


