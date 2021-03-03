/**
 * @name name
 * @description description
 * @time 2020-02-21
 */
import './demo.scss';
import "../../assert/css/font-awesome.min.css"
import * as React from "react";
import Empty from '@component/my-icon/Empty';
import {SvgIcon,Icon} from '@component/my-icon/index';
import {Input,CheckBox} from "@component/input/index";
type Props={

};
type States={
    emptyTxt:string;
    iconName:string;
    iconSize: "normal" | "big" | "middle";
    libIconName:string;//引入的字体图标库名称 
};
interface IDemo {

}

const iconList = ["arrow-icon","util","animate","scroll","menu","plus","minus","loading", "alert", "close", "warn", "menu-expand", "menu-slide", "bin-tree", "calendar1", "arrow-pre", "arrow-next", "dataType", "arrow-left-square", "arrow-right-square", "role", "pdf", "excel", "word", "zip", "txt", "file", "img", "combo", "modal", "table", "toast", "calendar", "success", "error", "empty", "checkbox-blank", "checkbox-marked", "checkbox-has-selected", "radio-off", "input", "radio-on", "search", "setting", "folder", "folder-open", "user", "arrow-up", "arrow-down", "menu-button"];

class Demo extends React.PureComponent<Props,States> implements IDemo{

    state:States={
        emptyTxt:"内容为空！",
        iconSize:"normal",
        iconName:"menu",
        libIconName:"fa fa-bath",
    };

    getIcon(){
       return  iconList.map(val=>{
            
            return (
                <div className="icon-item" key={val}>
                    <p>
                        <SvgIcon className={val} size="big" />
                    </p>
                    <p className="icon-name">
                        {val}
                    </p>
                    
                </div>
            )
        })
    }
    changeState=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const dom = e.currentTarget!;
        const value = dom.value;
        const name = dom.name;

        this.setState({
            [name as "emptyTxt"]:value,
        })
    }
    render(){
        const {emptyTxt,iconSize,iconName,libIconName} = this.state;
        
        return (
          <div className="g-layout icon-box">
            <div className="g-layout-head">
              <h3>空数据和图标</h3>
            </div>
            <div className="g-layout-article">
              <div className="g-item-show empty-box">
                <Empty txt={emptyTxt} />
                <div className="inp-item">
                  <Input
                    name="emptyTxt"
                    changeFn={this.changeState}
                    norequire={true}
                    value={emptyTxt}
                    width={280}
                  >
                    空状态的提示语 txt：
                  </Input>
                </div>
              </div>
              <div className="g-item-show" style={{ height: 160, }}>
                <div>
                  <span>自定义的svg图标：</span>
                  <SvgIcon className={iconName} size={iconSize}>
                    asd
                  </SvgIcon>
                </div>
                <div>
                  <div className="inp-item">
                    <Input
                      name="iconName"
                      changeFn={this.changeState}
                      value={iconName}
                    >
                      名称：className：
                    </Input>
                  </div>
                  <div className="inp-item">
                    <span>大小 size：</span>
                    <CheckBox
                      name="iconSize"
                      value="normal"
                      changeHandle={this.changeState}
                      checked={iconSize === "normal"}
                    >
                      normal
                    </CheckBox>
                    <CheckBox
                      name="iconSize"
                      value="middle"
                      changeHandle={this.changeState}
                      checked={iconSize === "middle"}
                    >
                      middle
                    </CheckBox>
                    <CheckBox
                      name="iconSize"
                      value="big"
                      changeHandle={this.changeState}
                      checked={iconSize === "big"}
                    >
                      big
                    </CheckBox>
                  </div>
                </div>
              </div>
              <div className="g-item-show icon-list">{this.getIcon()}</div>
              <div className="g-item-show">
                <span>引入的字体图标库 图标：</span>
                <Icon className={libIconName}>asd</Icon>
                <div className="inp-item">
                  <Input
                    name="libIconName"
                    changeFn={this.changeState}
                    norequire={true}
                    value={libIconName}
                  >
                    图标名称 className：
                  </Input>
                </div>
                <a href="http://www.fontawesome.com.cn/icons/bath/" target="_blank">图标库地址</a>
               
              </div>
            </div>
          </div>
        );
    }
}


export default Demo;