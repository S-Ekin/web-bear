/**
 * @author: SEKin 
 * @Date: 2021-01-06 10:34:25 
 * @description:  动态路由加载
 * @Last Modified time: 2021-01-06 10:34:25 
 */

import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import LoadCom from "../loading/Loading";
type loadObj<p> = {
    loader(): Promise<React.ComponentType<p> | { default: React.ComponentType<p> }>;
    loading?:()=>React.ReactNode;
}
type Props<p>={
    loadObj:loadObj<p>;
    children:(com:React.ComponentType<RouteComponentProps>)=>React.ReactNode;
};
type States<p>={
    Com:React.ComponentType<RouteComponentProps> | undefined;
    preLoadObj:Props<p>["loadObj"];
};
interface IrouterLoad {

}
class RouterLoad<P> extends React.PureComponent<Props<P>,States<P>> implements IrouterLoad{

    state:States<P>={
        Com:undefined,
        preLoadObj:this.props.loadObj
    };
    componentDidMount(){
        const { loadObj } = this.props;
        loadObj.loader().then((com:any)=>{
            this.setState({
                Com:com.default,
            })
        })
    }

    getLoad () {
        const { loadObj:{loading} } = this.props;
        return loading ? loading() : <LoadCom.LoadingCom />;
    }
    componentDidUpdate(){
        const { loadObj } = this.props;
        if (this.state.preLoadObj!==loadObj) {
            loadObj.loader().then((com:any)=>{
                this.setState({
                    Com:com.default,
                    preLoadObj: loadObj,
                })
            })
        }
    }
    render(){
        const { Com } = this.state;
        const {children} = this.props;
        return !Com ? this.getLoad() : children(Com);
    }
}


const loadable = function<e>(loadObj:loadObj<e>){
    //todo: 有点搞不清楚 RouterLoad 明明要传类型参数，这里没有传，而且也不是自动取的 loadObj的类型参数，因为鼠标放上去显示的是 定义类时的那个类型参数名称。
    return (route:RouteComponentProps)=> {
        const {location,match,history,staticContext } = route;
        return  (
        <RouterLoad loadObj={loadObj} >
            {
                (Com:React.ComponentType<RouteComponentProps>)=><Com location={location} match={match} history={history} staticContext={staticContext} />
            }
        </RouterLoad>
    )
    }
}

export default loadable;