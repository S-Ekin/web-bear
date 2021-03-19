/**
 * @name 下拉框的公用的高阶组件
 * @description 树形下拉框和列表下拉框的公共部分，也就是显示框和下拉框
 */
import * as React from "react";
import ComboInp from "./ComboInp";
import * as Immutable from "immutable";
import { SlideBox } from "../animate/index";
import {ISelected,IDrop,drop,filedObj} from "./combo";
import {slideOther,event} from "../util/autoSlideUp";
type props = {
	data: any[];
	idField?: string;
	textField?: string;
	noIcon?: boolean;//下拉图标
	noSearch?: boolean;//下拉图标
	multiply?: boolean;//多选
	tit?: string;//提示语
	field: string; //下拉框的标识
	itemIcon?: string;//下拉框每行的图标，目录默认用文件夹
	defaultVal?: string;//默认选中的
	width?: number;//显示框宽度
	maxHeight?: number;//下拉框最大高度
	dropWidth?: number;//下拉框宽度，默认是显示框宽度
	directionUp?: boolean;//下拉框在显示框上还是下
	noRequire?: boolean;//必选
	renderCallback?: boolean; //组件第一次加载调用点击事件的回调函数
	ableClear?:boolean;//能够清空所选
	//外部通过这个值来控制下拉框的选中,id可以是字符串分隔
	initComboVal?:{id:string}; // 用来完全初始化选择的，不要用混
	//点击或是选中之前做的操作，返回true不执行选中操作，默认返回false
	clickOrCheckForbid?:(node:IImmutalbeMap<any>,field:string,selectedArr:states['selected'])=>boolean;
	//自定义显示框的文字内容，selected所选择的内容
	formatterVal?: (selected: states["selected"]) => React.ReactChild;
	//自定义下拉框的文字内容
	formatterDropItem?: (node:IImmutalbeMap<any>) => React.ReactChild;
	//点击每行的回调函数
	clickCallback(selected: ISelected[], field: string,node?:IImmutalbeMap<any>): void;
	
};

type states = {
	selected: IImmutalbeList<ISelected>;
	drop: boolean;
};

interface ICombo {
	eventId: string;
	dropStyle:{maxHeight:number};
	selectFn(path?:string):void;
	dropToggle(e:React.MouseEvent): void;
	changeSelect(selected:states["selected"],node?:IImmutalbeMap<any>):void;
}
type comboType = keyof IDrop;


const wrapComboHC = <P extends comboType>(
	// tslint:disable-next-line: variable-name
	Drop: React.ComponentType<drop<P>>,
	comboType: comboType
) => {
	return class
		extends React.PureComponent<props & IDrop[P], states>
		implements ICombo {
		static defaultProps = {
			idField: "id",
			textField: "text",
			childField: "children",
			width:240,
			maxHeight:240,
			defaultVal:"",
			clickOrCheckForbid:function(){
				return false ;
			}
		};
		eventId = `${new Date().getTime().toString()}-${this.props.field}`;
		filedObj!: IImmutalbeMap<filedObj<P>>;
		dropStyle:ICombo["dropStyle"];
		selectFn!:ICombo["selectFn"];
		constructor(props: props & IDrop[P]) {
			super(props);
			this.state = this.initState();
			this.initFieldObj(props);
			const {maxHeight} = props;
			this.dropStyle = { maxHeight: maxHeight !,};
		}
		bindSelectFn=(fn:any)=>{
			this.selectFn = fn;
		}
		//把一些固定的字段整合在immutable对象里，传参的时候只用传一个
		initFieldObj(props: props & IDrop[P]) {
			const {
				idField,
				textField,
				multiply,
				itemIcon,
				defaultVal,
				noSearch,
				field,
				clickOrCheckForbid,
			} = props as props;
			const common = {
				idField: idField!,
				textField: textField!,
				multiply,
				noSearch,
				itemIcon,
				defaultVal:`${defaultVal}`,
				clickOrCheckForbid,
				field
			};
			if (comboType === "list") {
				this.filedObj = Immutable.fromJS(common);
			} else {
				const {
					childField,
					noSearch,
				} = props as IDrop["tree"];
				let treeField = Object.assign(common, { childField, noSearch });
				this.filedObj = Immutable.fromJS(treeField);
			}
		}
		
		dropToggle = (e:React.MouseEvent) => {
			slideOther(e.nativeEvent,this.eventId);
			this.setState(pre => ({
				drop: !pre.drop,
			}));
		}
		initState(): states {
		
			return {
				drop: false,
				selected: Immutable.List([]),
			};
		}
		documentClickFn = () => {
				this.setState({
					drop: false,
				});
		}
		componentDidMount() {
			event.on(this.eventId,this.documentClickFn);
		}
		componentWillUnmount() {
			event.remove(this.eventId);
		}
		initSelect=(selected:states["selected"])=>{
			const {renderCallback} = this.props;
			this.setState({
				selected:selected
			},()=>{
				if(renderCallback){
					const {field,clickCallback} = this.props;
					const {selected} = this.state;
					clickCallback(selected.toJS(),field);
				}

			});
			
		}
		changeSelect=(selected:states["selected"],node?:IImmutalbeMap<any>)=>{
			const{clickCallback,field,multiply} = this.props;
			this.setState((pre)=>{
				return {
					selected:selected,
					drop:!multiply ? false : pre.drop // 单选的时候，点击后关闭下拉框
				};
			},()=>{
				const {selected} = this.state;
				clickCallback(selected.toJS(),field,node);
			});

		}
		
		renderCombox() {
			const {
				formatterVal,
				noIcon,
				multiply,
				tit,
				width,
				data,
				dropWidth,
				noRequire,
				formatterDropItem,
				directionUp,
				ableClear,
				initComboVal,
			} = this.props;
			const { selected, drop } = this.state;
			const palceholder = tit ? tit! : multiply ? "多选" : "单选";
			const activeName = drop ? "autoSlideUp" : "";	
			return (
				<div 
				className={"g-combo " + activeName} 
				data-event={this.eventId}
				style={{ width: width !, }} 
				>
					<ComboInp
						drop={drop}
						tit={palceholder}
						selected={selected}
						formatterVal={formatterVal}
						slideFn={this.dropToggle}
						noicon={noIcon}
						ableClear={ableClear}
						noRequire={noRequire}
						clearFn={this.selectFn}
					/>
					<div
						className={`m-drop ${directionUp ? "direction-up" : ""}`}
					    style={dropWidth?{width:dropWidth}:undefined}
					>
						<SlideBox slide={drop} directionUp={directionUp}>
							<Drop 
								filedObj={this.filedObj} 
								data={data} 
								changeSelect={this.changeSelect}
								selected={selected}
								dropStyle={this.dropStyle}
								initSelect={this.initSelect}
								initComboVal={initComboVal}	
								formatterDropItem={formatterDropItem}
								clickMethod={this.bindSelectFn}
							/>
					</SlideBox>
					</div>
				</div>
			);
		}

		render(){
			const { children } = this.props;
			return children ? (
				<div className="m-flex-center">
					<span className="lab-tit">{children}</span>
					{this.renderCombox()}
				</div>
			): this.renderCombox();
		}
	};
};
export default wrapComboHC;
