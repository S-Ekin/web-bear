/**
 * @name 树形下拉框的目录组件
 * @description description
 * @time 2019-08-17
 */
import * as React from "react";
import { Icon } from "../icon/index";
import * as Immutable from "immutable";
import {activeStatus,DropItem} from "./DropItem";
import { VelocityComponent } from "velocity-react";
import {CheckBox} from "../input/index";
type node = {
	[key: string]: any;
	active: activeStatus;
	expand: boolean;
};
type immutableData = Immutable.List<IImmutalbeMap<node>>;

type props = {
    node: IImmutalbeMap<node>;
    fieldObj: ComboSpace.drop<"tree">["filedObj"];
    index: string;//节点索引
    lev: number//树形节点的层级
    checkMethod(value:string):void;
    checkForPar(value:string):void;
    clickFn(index:string):void;
    toggleExpand(index:string):void;
};

type states={

};
interface IParTreeItem {
 toggleExpandFn(e:React.MouseEvent<HTMLDivElement>):void;
}
class ParTreeItem extends React.PureComponent<props,states> implements IParTreeItem{

    static defaultProps={
        childField:"children",
    };
    state:states={

    };
   
    
    checkFn = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
		const dom = e.currentTarget!;
		const value = dom.value!;
        this.props.checkForPar(value);
	}
    getCheckbox() {
        const {fieldObj,node,index} = this.props;
        const multiply = fieldObj.get("multiply");
        const active = node.get("active");
        const hasChecked = activeStatus.hasSelect === active;
        const checked = activeStatus.select === active;
        return multiply ? (
            <CheckBox 
                hasChecked={hasChecked}
                checked={checked}
                value={index}
                changeHandle={this.checkFn}
            />
        ) : undefined;
    }
    
    getSubCom(child:immutableData,lev:number,oindex:string){
        const {fieldObj,clickFn ,checkForPar,checkMethod,toggleExpand} = this.props;
        const idField = fieldObj.get("idField");
        const multiply = fieldObj.get("multiply");
        return child.map((val:IImmutalbeMap<node>,index:number)=>{

            const child =val.get(fieldObj.get("childField")!) as immutableData;
        
            return !child.size ? (
               <DropItem 
                        key={val.get(idField)}
                        node={val}
                        fieldObj={fieldObj}
                        index={`${oindex},${index}`}
                        lev={lev+1}
                        clickFn={clickFn}
                        checkMethod={checkMethod} 
                        CheckBox={multiply ? CheckBox :undefined}
                    />
            ):(
                <ParTreeItem
					key={val.get(idField)}
					node={val}
					fieldObj={fieldObj}
					clickFn={clickFn}
                    index={`${oindex},${index}`}
                    lev={lev+1}
                    checkForPar={checkForPar}
                    checkMethod={checkMethod}
                    toggleExpand={toggleExpand}
				/>
            ) ;
        });
    }
    toggleExpandFn=(e:React.MouseEvent<HTMLDivElement>)=>{
        const dom = e.currentTarget!;
        const index= dom.dataset.index!;
        this.props.toggleExpand(index);
    }
    
    
    render(){
        const {lev,node,index,fieldObj} = this.props;
        //层级间的距离左侧的距离
        const levSpaceStyle =  { paddingLeft: `${lev}em`,};
        const text = node.get(fieldObj.get("textField"));
        const expand = node.get("expand");
        const child = node.get(fieldObj.get("childField")!) as immutableData;
        return (
            <li className="combo-par-item" >
                <div 
                className={`m-combo-item`} 
                data-index={index} 
                onClick={this.toggleExpandFn} 
                >
                    <span className="g-item-text" style={levSpaceStyle}>
                       {this.getCheckbox()}
                       <Icon className="fa-folder"/>
                        <span>{text}</span>
                    </span>
                    <Icon className={`fa-chevron-${expand ?"up" : "down"}`}/>
                </div>
               	<VelocityComponent
						duration={300}
						animation={expand ? "slideDown" : "slideUp"}
						interruptBehavior="queue">
							<ul>
								{this.getSubCom(child,lev,index)}
							</ul>
				</VelocityComponent>
            </li>

        );
    }
}


export default ParTreeItem;