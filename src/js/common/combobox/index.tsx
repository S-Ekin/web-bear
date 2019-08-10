
import * as React from "react";
import * as Immutable from "immutable";
//import "@css/common/combobox.scss";
import { VelocityComponent } from "velocity-react";
import { ComboInp } from "@js/common/InputBtn";
import DropCom from "./Drop";

type props = {
	idField?: string;
	textField?: string;
	icon?: string;
	clickCallback?: (slecte: Readonly<ComboboxSpace.comboboxAPI["slectedItem"][]>, field: string, node?: Readonly<any>, ) => void;
	field: string;
	multiply?: boolean;
	defaultVal?: string;
	width?: number;
	maxHeight?: number;
	data: any[];
	hasSlideIcon?: boolean;
	formatter?: (node: Readonly<any>) => JSX.Element;
	pannelWidth?: number;
	inpShowField?: string;
	require?: boolean;
	placeholder?: string;
	dirctionUp?:boolean;
	renderClick?:boolean;//是否在初始化的时候调用点击的回调函数
	init?:boolean;
	autoH?:boolean;
	disabled?:boolean;
}


type state = {
	drop: boolean;
	slected: Immutable.List<ComboboxSpace.comboboxAPI["slectedItem"]>;
	data: Immutable.List<TypedMap<ComboboxSpace.comboboxAPI["itemNode"]>>
}


export default class Combobox extends React.PureComponent<props, state>{

	static defaultProps = {
		idField: "id",
		textField: "text",
		icon: "",
		multiply: false,
		defaultVal: "",
		width: 240,
		maxHeight: 300,
		hasSlideIcon: true,
		require: true,
		placeholder:"",
		init:false,
	}


	wrapDomRef:React.RefObject<HTMLDivElement> = React.createRef();

	constructor(props: props) {

		super(props);

		const { defaultVal, data, idField, textField ,inpShowField,clickCallback,field,renderClick} = props;

		const _defaultVal = defaultVal + "";



		let defaultNode: ComboboxSpace.comboboxAPI["slectedItem"][];
		let _node = undefined ;

		if (!_defaultVal) {
			defaultNode = [];
		} else {
			const _defaultNode = _defaultVal.split(",").map(val => {

				const node = data.find(node => (node[idField!] == val))!;
				_node = node ;
				return node ? {
					id: val,
					text: inpShowField?node[inpShowField]: node[textField!]
				} : null;
			});

			defaultNode = _defaultNode.filter(val => !!val) as ComboboxSpace.comboboxAPI["slectedItem"][];
		}

		const slected = Immutable.List(defaultNode);

		this.state = {
			drop: false,
			slected,
			data: Immutable.fromJS(this.addField(data, slected)),
		};
		// 有默认值的时候，触发点击的回调事件
		if(renderClick){
			const seleteNode:Readonly<any> | undefined = _node  ;
			clickCallback && defaultNode.length && clickCallback(defaultNode,field,seleteNode);
		}
		

	}

	componentWillReceiveProps(nextProp: props) {

		//父组件
		if (nextProp.data != this.props.data || nextProp.defaultVal !=this.props.defaultVal || this.props.init != nextProp.init) {
			
			let _node = undefined ;
			const _defaultVal = nextProp.defaultVal + "";
			const _defaultNode = _defaultVal.split(",").map(val => {
				const node = nextProp.data.find(node => (node[nextProp.idField!] == val))!;
				_node = node ;
				return node ? {
					id: val,
					text:nextProp.inpShowField ? node[nextProp.inpShowField]: node[nextProp.textField!]
				}  : null;
			});

			const slected = Immutable.List(_defaultNode.filter(val => !!val) as ComboboxSpace.comboboxAPI["slectedItem"][]);


			this.setState({
				data: Immutable.fromJS(this.addField(nextProp.data, slected)),
				slected,
			});
			const {clickCallback ,field,renderClick} = nextProp;

			if(renderClick){
				const slecteArr = slected.toJS();
				const slecteNode = _node;
				clickCallback && slecteArr.length && clickCallback(slecteArr,field,slecteNode);
			}
		
		}


	}

	addField(data: any[], slecteArr: state["slected"]): any[] {

		const { idField } = this.props;

		return JSON.parse(JSON.stringify(data), function (...args) {

			const [, val] = args
			if (Object.prototype.toString.call(val) === "[object Object]") {
				val.active = (slecteArr.findIndex(node => node.id == val[idField!]) > -1)
			}
			return val;
		});
	}

	toggleDrop = () => {
		this.setState(preState => {
			return {
				drop: !preState.drop
			}
		})
	}

	getValue() {
		const { slected } = this.state;
		const arr = slected.map(node => {
			return node!.text;
		});
		return arr.join("，");
	}

	getPropFieldVal = (field: ComboboxSpace.field) => {
		return this.props[field]!;
	}



	clickFn = (e: React.MouseEvent<HTMLLIElement>) => {

		const index = +e.currentTarget.dataset.index!;

		const { multiply, textField, idField, clickCallback, field, inpShowField } = this.props;
		const { data, slected } = this.state;

		const flagText = inpShowField || textField;

		const node = data.get(index)!;
		const id = node.get(idField as any);
		const text = node.get(flagText as any);

		const slecteIndex = slected.findIndex(val => val.id == id);
		const is_has = slecteIndex > -1;

		if (multiply) {

			this.setState({
				data: data.set(index, node.set("active", !is_has)),
				slected: !is_has ? slected.push({ id, text }) : slected.remove(slecteIndex),
			},()=>{

					clickCallback && clickCallback(this.state.slected.toJS(), field!);

			});

		} else {

			if (is_has) {
				return;
			};

			const preSlected = slected.get(0);



			let $data = data.set(index, node.set("active", !is_has));

			if (preSlected) {
				const preIndex = data.findIndex(val => val.get(idField as any) == preSlected.id);
				$data = $data.update(preIndex, node => node.set("active", false));
			}



			clickCallback && clickCallback([{ id, text }], field!, node.toJS());

			this.setState({
				data: $data,
				slected: slected.clear().push({ id, text }),
				drop: false
			})

		};
	}

	documentClickFn=(e:MouseEvent)=>{

		const target = e.target! as HTMLElement;
		const wrap = this.wrapDomRef.current!;
		if(target == wrap || wrap.contains(target) ){
			
		}else{

			this.setState({
				drop:false
			});
		}


		

	}

	componentDidMount(){

		document.addEventListener("click",this.documentClickFn);
	}
	componentWillUnmount(){

		document.removeEventListener("click",this.documentClickFn);
	}

	render() {

		const { drop, data } = this.state;

		const { multiply, width,autoH, maxHeight, hasSlideIcon, pannelWidth, require, placeholder ,dirctionUp,disabled} = this.props;



		const value = this.getValue();

		

		return (<div ref={this.wrapDomRef} className={"combobox "+(disabled ? "disabled" : "") + (!disabled && drop ? "active " : "") + ((!value && !disabled && require) ? "no-fill" : "")} style={{ width }} >

			<ComboInp 
				placeholder={placeholder} 
				multiply={multiply!} 
				toggleDrop={disabled ? undefined : this.toggleDrop} 
				value={disabled ? placeholder! : value} 
				drop={drop} 
				hasSlideIcon={hasSlideIcon}
				autoH={autoH}
			/>
			<VelocityComponent duration={300} animation={!disabled && drop ? "slideDown" : "slideUp"}
					interruptBehavior="queue"
			>
				<ul style={{ maxHeight, width: (pannelWidth ? pannelWidth : "100%") }} className={"m-drop " + (dirctionUp && "direction-up" || "direction-down")} >

					<DropCom data={data} getPropFieldVal={this.getPropFieldVal} clickHande={this.clickFn} />

				</ul>
			</VelocityComponent >
		</div>);

	}




}