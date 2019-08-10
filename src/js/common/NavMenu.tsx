import * as React from "react";
import {  NavLink } from "react-router-dom";
import "@css/common/menu.scss";
import * as Immutable from "immutable";
import * as Velocity from "velocity-react";
import { SvgIcon } from "@js/common/Button";
import Scrollbar from "react-scrollbar";



type objMenu = {
	id: string;
	name: string;
	sys_param: string;
	url:string ;
	par_id: number;
	active: boolean;
	children: Immutable.List<MenuItem>
}
type MenuItem = TypedMap<objMenu>;
type ItemProps = {
	obj: MenuItem;
	textField: string;
	index: number;//索引位置
	pathField: string;
	iconField: string;
	idField: string;
	slectItem: (index: number, parIndex?: number) => void;
	expand: boolean;
	parIndex?: number;
	sub?: Immutable.List<ItemProps["obj"]>;
};

class ParMenu extends React.PureComponent<ItemProps>{

	state = {
		drop: true,
	}

	toggleSlide=()=>{

	//	const index = e.currentTarget!.dataset.index;
		this.setState((prevState: { drop: boolean }) => ({ drop: !prevState.drop }));

	//	this.props.slectItem(+index!);

	}

	

	render() {



		const { obj, textField, idField,expand, iconField, pathField, sub, index ,slectItem} = this.props;

	//	const path = obj.get( pathField as "url" ).split("/");
		const icon = obj.get( iconField as "sys_param" );
		const text = obj.get(textField as "name");

		const activeName = obj.get("active") ? "active" : "";

		return (
			<li className="li-par">
				<div className={"menu-item menu-par " + activeName} data-index={index} onClick={ expand ? this.toggleSlide :undefined}>
					<span className="par-icon">
						<SvgIcon styleType={icon} />

					</span>
					<span className="j-nav" >
						{/* <Link to={"/"+path[path.length-1]}>{text}</Link> */}
						{text}
					</span>
					<span className="j-slide_menu" >
						<i className={"fa fa-chevron-" + (!this.state.drop ? "down" : "up")}></i>
					</span>
				</div>
			{ expand ? (<Velocity.VelocityComponent 
				 animation={ this.state.drop ? "slideDown" : "slideUp"} 
				 duration={300}
				 interruptBehavior="queue"
				 >
					<ul className="child-ul " >
						{
							sub!.map((node: MenuItem, childIndex) => {

								const nodeId = node.get(idField! as "id");
								return <SubMenu
									obj={node}
									key={nodeId}
									slectItem={slectItem}
									idField={idField}
									textField={textField}
									iconField={iconField}
									pathField={pathField}
									parIndex={index}
									index={childIndex}
								/>
							})

						}
					</ul>
				</Velocity.VelocityComponent>):(<ul className="child-ul " >
						{
							sub!.map((node: MenuItem, childIndex) => {

								const nodeId = node.get(idField! as "id");
								return <SubMenu
									obj={node}
									key={nodeId}
									slectItem={slectItem}
									idField={idField}
									textField={textField}
									iconField={iconField}
									pathField={pathField}
									parIndex={index}
									index={childIndex}
								/>
							})

						}
				</ul>)}

			</li>
		)

	}

}


type SubMenuProp = Pick<ItemProps, Exclude<keyof ItemProps, "expand">>



type SubMenuState = {

}

class SubMenu extends React.PureComponent<SubMenuProp, SubMenuState>{


	render() {

		const { obj, idField, textField, pathField, slectItem, parIndex, index } = this.props;

	

		const path = obj.get( pathField as "url" ).split("/");
		const id = obj.get(idField as "id");
		const text = obj.get(textField as "name");


		const pathObj = {
			pathname: "/"+path[path.length-1],
			state: {
				id,
				text
			},
		};

		const activeName = obj.get("active") ? "active" : "";

		return (
			<li className="li-child">
				<div className={"menu-item menu-child " + activeName} >
					<span className="j-nav" onClick={() => slectItem(index, parIndex)}>
						<NavLink
							to={pathObj}
							replace={true}
						>{text}</NavLink>
					</span>
				</div>
			</li>
			
		)


	}

}



type props = {
	data: any[];
	expand: boolean;//是否展开，提示到父组件,可以通过兄弟组件控制
	textField?: string;
	childrenField?: string;
	pathField?: string;
	iconField?: string;
	idField?: string; 
	defaultMenuId?:string
};


type state = {
	data: Immutable.List<MenuItem>;
	preIndex: number[];
}

class NavMenu extends React.PureComponent<props, state>{

	static defaultProps = {
		textField: "text",
		childrenField: "children",
		pathField: "url",
		iconField: "icon",
		idField: "id"
	};


	constructor(props: props) {

		super(props);
		
		const defaultMenuId = this.props.defaultMenuId;
		const preIndex = defaultMenuId ? defaultMenuId.split(",").map(val => +val) : [];
		const menuData = this.addFieldToData(this.props.data,preIndex);
		this.state = {
			data: Immutable.fromJS(menuData),
			preIndex,
		}
	}

	addFieldToData(data: props["data"],prePath:number[]) {

		return data.map((val,index) => {
			const parActive = (prePath.length>0 && prePath[0] == index) ? true :false;
			val.active = parActive;

			const child = val.children.map((node:any,oindex:number) => {

				node.active = parActive && (prePath.length>1 && prePath[1] == oindex) ? true :false;

				return node;
			});
			val.children = child;
			return val;
		});

	}

	componentWillReceiveProps(nextProp: props) {

		if (nextProp.data !== this.props.data|| this.props.defaultMenuId!=nextProp.defaultMenuId) {
			const {defaultMenuId} = nextProp;
			const  preIndex =defaultMenuId ? defaultMenuId.split(",").map(val=>+val):[];
			this.setState({
				data: Immutable.fromJS(this.addFieldToData(nextProp.data,preIndex)),
				preIndex,
			})
		}

	}



	restPreSel(pre: state) {





		const { preIndex, data } = pre;
		const { childrenField } = this.props;

		if (preIndex.length === 0) {
			return data;
		}

		let newSata;

		newSata = data.updateIn([preIndex[0]], (node: MenuItem) => {
			return node.set("active", false)
		})

		if (preIndex.length > 1) {

			newSata = newSata.updateIn([preIndex[0], childrenField, preIndex[1]], (node: MenuItem) => {
				return node.set("active", false)
			})

		}

		return newSata;
	}


	slectItem = (index: number, parIndex?: number) => {

		const { childrenField } = this.props;

		const curPath = parIndex ? (parIndex + "" + index) : (index + "");

		if (curPath === this.state.preIndex.join("")) {
			return;
		}


		this.setState(pre => {


			let preIndex;
			let data = this.restPreSel(pre);
			data = data.updateIn([(parIndex !== undefined ? parIndex : index)], (node: MenuItem) => {
				return node.set("active", true)
			});



			if (parIndex !== undefined) { //  子节点
				data = data.updateIn([parIndex, childrenField, index], (node: MenuItem) => {
					return node.set("active", true)
				});

				preIndex = [parIndex, index]

			} else {

				preIndex = [index]

			}



			return { data, preIndex }
		});

	}

barStyle={
		borderRadius:6,
		background:"#c5d0d7"
	}
	render() {
		const { textField, childrenField, idField, iconField, expand, pathField } = this.props;
		const { data } = this.state;

		return (<Scrollbar
            className="scroll-area"
            contentClassName="scroll-content"
			horizontal={false}
			verticalScrollbarStyle={this.barStyle}
		>

						<ul className="g-menu" >

									{

										data.map((item, oIndex) => {
											const val = item;
											const child = val.get(childrenField as "children");
											const id = val.get(idField as "id");

											if (child && child.size) {
												return <ParMenu
													expand={expand}
													index={oIndex}
													sub={child}
													obj={val}
													key={id}
													slectItem={this.slectItem}
													idField={idField!}
													textField={textField!}
													pathField={pathField!}
													iconField={iconField!}
												/>
											} else {
												return <SubMenu
													obj={val}
													key={id}
													slectItem={this.slectItem}
													index={oIndex}
													idField={idField!}
													textField={textField!}
													pathField={pathField!}
													iconField={iconField!}
												/>
											}
										})

									}
								</ul>


				</Scrollbar>)
		
		
		
		
	}
}





export default NavMenu;