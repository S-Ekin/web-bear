/**
 * @name 导航菜单
 * @description 固定的二级结构
 * @time 2019-08-14
 */
import * as React from "react";
import * as Immutable from "immutable";
import ParMenu from "./ParMenu";
import {createImmutableMap} from "../createImmutaleMap";

type props={
    data:MenuSpace.menuData[];
	expand: boolean; //是否收缩
	textField?: string;
	idField?: string;
	urlField?: string;
	iconField?: string;
	defaultMenuId?: string;
};
type states={
   selected:string;
   immutableData:Immutable.List<IImmutalbeMap<{
           children:Immutable.List<IImmutalbeMap<MenuSpace.menuData>>;
           [key: string]: any;
		   selected: boolean;
   }>>;
   fieldObj:MenuSpace.fieldObj;
};
type formatterData = {
    defaultMenuId:string;
    idField:string;
};
interface INavMenu{
    //格式化数据，添加属性selecte:Boolean代表选中
    formaterData(data:any[],obj:formatterData):void; 
    initState(props:props):states;
    getParMenu():Immutable.List<JSX.Element>;
    changeImmutableData(
        callback:(data:states["immutableData"],selected:string)=>{
            data:states["immutableData"],
            selected:string
        }
    ):void;
}
class NavMenu extends React.PureComponent<props,states> implements INavMenu{

    static defaultProps={
        textField:"name",
        idField:"id",
        iconField:"icon",
        urlField:"url",
    };
    constructor(prop:props){
        super(prop);
        
        this.state = this.initState(this.props);


    }
    initState(props:props){

        const {defaultMenuId,data,idField,textField,urlField,iconField} = props;
        const newData = this.formaterData(data,{idField:idField!,defaultMenuId:defaultMenuId!});

        return {
            selected:defaultMenuId || "",
            immutableData:Immutable.fromJS(newData),
            fieldObj:createImmutableMap({
                id:idField!,
                text:textField!,
                url:urlField!,
                icon:iconField!,
            }),
        };

    }
    formaterData(data:MenuSpace.menuData[],obj:formatterData){
        const {defaultMenuId,idField} = obj;
        return data.map(par=>{
            
            par.selected = false ;
            // 子节点也添加selected;
            par.children.forEach(sub=>{

                sub.selected = defaultMenuId === `${par[idField]}`;
            });
            return par ;


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

        this.setState(pre=>{
        
            const {immutableData,selected} = pre ;
          const {data,selected:_selected} = callback(immutableData,selected);
          return {
            immutableData:data,
            selected:_selected
          };
        });
    }

	//#todo:要改
    componentWillReceiveProps(props:props){
        if(props.data!==this.props.data){

            const data = this.formaterData(props.data,{defaultMenuId:props.defaultMenuId!,idField:props.idField!});
            this.setState({
                immutableData:Immutable.fromJS(data),
                selected:props.defaultMenuId || "",
            });
        }
    }
    render(){
        const parItem =  this.getParMenu();
        return (
            <ul className="g-menu">
                {parItem} 
            </ul>
        ); 
    }
}


export default NavMenu;