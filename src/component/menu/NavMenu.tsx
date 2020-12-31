/**
 * @name 导航菜单
 * @description 固定的二级结构
 * @time 2019-08-14
 */
import * as React from "react";
import { Animate } from "../animate/index";
import * as Immutable from "immutable";
import ParMenu from "./ParMenu";
import {createImmutableMap} from "../util/createImmutaleMap";
import {IMenuData,fieldObj} from "./menu";
import { ScrollBox } from "../scroll/index";

type props={
    data:IMenuData[];
    width?:number;
	expand: boolean; //是否收缩
	textField?: string;
	idField?: string;
	urlField?: string;
	iconField?: string;
    defaultMenuId?: string;
    init?:{id:string};
    clickBack?:(node:{[key:string]:any})=>void;
};
type states={
   selected:string;
   immutableData:Immutable.List<IImmutalbeMap<{
           children:Immutable.List<IImmutalbeMap<IMenuData>>;
           [key: string]: any;
		   selected: boolean;
   }>>;
   fieldObj:fieldObj;
   preData:any[];
   preInit:{id:string} | undefined;
};
type formatterData = {
    defaultMenuId:string;
    idField:string;
};
interface INavMenu{
    initState(props:props):states;
    getParMenu():Immutable.List<JSX.Element>;
    changeImmutableData(
        callback:(data:states["immutableData"],selected:string)=>{
            data:states["immutableData"],
            selected:string
        }
    ):void;
}

//格式化数据，添加属性selecte:Boolean代表选中
const formatter  = function(data:IMenuData[],obj:formatterData){
        const {defaultMenuId,idField} = obj;
        return data.map(par=>{
            par.selected = false ;
            par.drop = true;
            // 子节点也添加selected;
            par.children.forEach(sub=>{
                const status = defaultMenuId === `${sub[idField]}`;
                sub.selected =  status;
                if(status){
                    par.selected = true;
                }
            });
            return par ;
        });
    };

class NavMenu extends React.PureComponent<props,states> implements INavMenu{
    static defaultProps={
        textField:"name",
        idField:"id",
        iconField:"icon",
        urlField:"url",
        width:250
    };
    static  getDerivedStateFromProps(nextProps:props,preState:states):Partial<states> | null {
        if(nextProps.data!==preState.preData){
           const  data = formatter(nextProps.data,{
                    defaultMenuId:nextProps.defaultMenuId!,
                    idField:nextProps.idField!
                });
            return {
                preData:nextProps.data,
                immutableData:Immutable.fromJS(data),
                selected:nextProps.defaultMenuId || "",
            };
        }else if(nextProps.init!==preState.preInit){

            const  data = formatter(nextProps.data,{
                    defaultMenuId:nextProps.init!.id,
                    idField:nextProps.idField!
            });
            return {
                immutableData:Immutable.fromJS(data),
                preInit:nextProps.init
            };

        }else{
            return null ;
        }
    }
   
    constructor(prop:props){
        super(prop);
        this.state = this.initState(this.props);
    }
    initState(props:props){

        const {defaultMenuId,data,idField,textField,urlField,iconField,init} = props;
        const newData = formatter(data,{idField:idField!,defaultMenuId:defaultMenuId!});

        return {
            selected:defaultMenuId || "",
            immutableData:Immutable.fromJS(newData),
            fieldObj:createImmutableMap({
                id:idField!,
                text:textField!,
                url:urlField!,
                icon:iconField!,
            }),
            preData:data,
            preInit:init,
        };

    }
    
    toggleSlide=(index:number)=>{
		this.setState((pre)=>{
            const drop = !pre.immutableData.getIn([index,"drop"]);
			return {
				immutableData:pre.immutableData.setIn([index,"drop"],drop)
			};
		});
	}
    
    getParMenu(){

        const {immutableData,fieldObj} = this.state;
        const {idField,expand} = this.props;

        return immutableData.map((node,index)=>{

                return (
                        <ParMenu 
                            key={node.get(idField!)} 
                            node={node}
                            expand={expand}
                            fieldObj={fieldObj}
                            parIndex={index}
                            toggleSlide={this.toggleSlide}
                            changeData={this.changeImmutableData}
                        />
                        );
        });

    }
    //利用回调函数把数据传给在子组件调用的时候
    changeImmutableData=(
        callback:(data:states["immutableData"],selected:string)=>{
            data:states["immutableData"],
            selected:string;
        }
    )=>{

        let selectStringIndex = "";
        this.setState(
          (pre) => {
            const { immutableData, selected } = pre;
            const { data, selected: _selected } = callback(
              immutableData,
              selected
            );
            selectStringIndex  = _selected;
            return {
              immutableData: data,
              selected: _selected,
            };
          },
          () => {
            const { clickBack ,data,} = this.props;
            if (clickBack) {
                const indexArr = selectStringIndex.split(",");
                const node = data[+indexArr[0]!].children[+indexArr[1]];
                clickBack(node);
            }
          }
        );
    }

    render(){
        const parItem =  this.getParMenu();
        const {width,children,expand} = this.props;
        const menuCom = expand ? (
            <ScrollBox
                time={300}
            >
                <ul className="g-menu">
                    {parItem} 
                </ul>
            </ScrollBox>
            
        ):(
          <ul className="g-menu">
            {parItem} 
        </ul>
        ); 

		return (
            <Animate 
                className={"g-slideMenu " + (!expand ? "expand" : "")} 
                duration={240} 
                display="flex"
                animation={{ width: expand ? (width || 250): 70 }}
            >
                {children}
                {menuCom}
			</Animate>
			);
    }
}


export default NavMenu;