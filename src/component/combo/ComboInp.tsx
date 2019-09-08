/**
 * @name 显示框
 * @description 显示的内容
 * @time 2019-08-14
 */
import * as React from "react";
import {Icon} from "../icon/index";
import * as Immtable from "immutable";
type props={
    tit:string;
    selected:Immtable.List<ComboSpace.Iselected>;
    formatterVal?:(selected:props["selected"])=>React.ReactChild;
    drop:boolean;
    noicon?:boolean;
    noRequire?:boolean;
    ableClear?:boolean;
    //下拉事件
    clearFn?:()=>void;
    slideFn():void;
};
type states={
};

class ComboInp extends React.PureComponent<props,states> {

   static defaultProps = {
		formatterVal:(seleted:props["selected"])=>{

            return seleted.map(val=>val.text).join("，");
        },
	};
    state:states={
    };
    getSlideIcon(noicon:boolean|undefined,drop:boolean){

        return !noicon ? (
            <Icon className={`fa-chevron-${drop?"down":"up"}`}/>
        ) : undefined;
    }
    //没有值的时候做提示，模仿input的placeholder
    getTit(tit:string){

        return (
            <span className="combo-inp-tit">{tit}</span>
        );
    }
    getClearCom(show:boolean){
        return  show ? (
           <span onClick={this.clickFn}>
               <Icon className={`fa-times`}/>
           </span> 
        ) : undefined;
    }
    clickFn=(e:React.MouseEvent<HTMLSpanElement>)=>{
        e.stopPropagation();
        const {clearFn} = this.props;
        if(clearFn){
            clearFn();
        }
    }
    render(){
        const {selected,slideFn,tit,formatterVal,noicon,drop,noRequire,ableClear} = this.props;
        const status = noRequire ? "" : selected.size ? "" : "no-fill";
        const clearStatus = ableClear && selected.size ? true :false;
        return (
                <div className={`m-combo-inp ${status}`}
                    onClick={slideFn}
                >
                    <div className="combo-value">
                        {selected.size ? formatterVal!(selected):this.getTit(tit)}
                    </div>
                    {this.getSlideIcon(noicon,drop)}
                    {this.getClearCom(clearStatus)}
                </div>
                );
    }
}


export default ComboInp;