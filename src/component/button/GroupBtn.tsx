/**
 * @name 下拉按钮组
 * @description description
 * @time 2019-08-14
 */
import * as React from "react";
import Button from "./MyButton";
import {Icon} from "../icon/index";
interface IGroupBtnsitem{
        id:string;
        text:string;
        icon?:string;
    }
type props={
    themeTxt:string;//主题名称，用于显示下拉主题
    list:IGroupBtnsitem[];
    icon?:string;
    clickFn:(field:string)=>void;
};
type states={

};
class GroupBtn extends React.PureComponent<props,states>{


    state:states={

    };
    clickFn=(e:React.MouseEvent<HTMLLIElement>)=>{
        const dom = e.currentTarget!;
        const field = dom.dataset.field!;
        const {clickFn} = this.props;
        clickFn(field);
    }
    getBtns(){
        const {list} = this.props;
        return list.map(val=>{
            const {text,id} = val;
            return (
                <li key={id} className="drop-item" onClick={this.clickFn} data-field={id}>
                    <span>
                        {text}
                    </span>
                </li>
            );

        });
    }
    render(){
        const {themeTxt,icon} = this.props;
        const themeIcon = icon ? <Icon className={icon}/> :undefined;
        return (
         <div className="g-group-btns">
             <div className="drop-theme">
                <Button noAnimate={true}>
                    {themeIcon}    
                    {themeTxt}
                </Button>
             </div>
             <div className="wrap-drop">
                  <ul className="drop-group">
                    {this.getBtns()}
                  </ul>
             </div> 
            
         </div>
        
        );
    }
}


export default GroupBtn;