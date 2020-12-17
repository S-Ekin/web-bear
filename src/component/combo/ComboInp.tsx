/**
 * @name 显示框
 * @description 显示的内容
 * @time 2019-08-14
 */
import * as React from "react";
import {SvgIcon} from "../my-icon/index";
import * as Immtable from "immutable";
import {ISelected} from "./combo";
type props={
    tit:string;
    selected:Immtable.List<ISelected>;
    formatterVal?:(selected:props["selected"])=>React.ReactChild;
    drop:boolean;
    noicon?:boolean;
    noRequire?:boolean;
    ableClear?:boolean;
    //下拉事件
    slideFn(e:React.MouseEvent):void;
    clearFn():void;
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
            <SvgIcon className={`arrow-${drop?"down":"up"}`}/>
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
               <SvgIcon className={`close`}/>
           </span> 
        ) : undefined;
    }
    clickFn=(e:React.MouseEvent<HTMLSpanElement>)=>{
        e.stopPropagation();
        this.props.clearFn();
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
                    {this.getClearCom(clearStatus)}
                    {this.getSlideIcon(noicon,drop)}
                </div>
                );
    }
}


export default ComboInp;