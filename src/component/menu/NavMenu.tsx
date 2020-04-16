/**
 * @name 导航菜单
 * @description 固定的二级结构
 * @time 2019-08-14
 */
import * as React from "react";
import * as Immutable from "immutable";
import ParMenu from "./ParMenu";
import {createImmutableMap} from "../createImmutaleMap";
import {IMenuData,fieldObj} from "./menu";
import Scrollbar from "react-scrollbar";
	
type props={
    data:IMenuData[];
	expand: boolean; //是否收缩
	textField?: string;
	idField?: string;
	urlField?: string;
	iconField?: string;
    defaultMenuId?: string;
    clickBack?:()=>void;
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
            // 子节点也添加selected;
            par.children.forEach(sub=>{

                sub.selected = defaultMenuId === `${par[idField]}`;
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
        }else{
            return null ;
        }
    }
   
    constructor(prop:props){
        super(prop);
        
        this.state = this.initState(this.props);


    }
    initState(props:props){

        const {defaultMenuId,data,idField,textField,urlField,iconField} = props;
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
        };

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
        },()=>{
            const {clickBack} = this.props;
            if(clickBack){
                clickBack();
            }
        });
    }

    render(){
        const parItem =  this.getParMenu();
        const {expand} = this.props;
        return expand ? (
            <Scrollbar
                horizontal={false}
            >
                <ul className="g-menu">
                    {parItem} 
                </ul>
            </Scrollbar>
            
        ):(
          <ul className="g-menu">
            {parItem} 
        </ul>
        ); 
    }
}


export default NavMenu;