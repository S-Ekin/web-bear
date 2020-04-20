/**
 * @name name
 * @description description
 * @time 2020-02-21
 */
import * as React from "react";
import Empty from '@component/my-icon/Empty';
import {SvgIcon} from '@component/my-icon/index';
import './demo.scss';
type Props={

};
type States={

};
interface IDemo {

}

const iconList = ["menu","plus","minus","loading", "alert", "close", "warn", "menu-expand", "menu-slide", "bin-tree", "calendar1", "arrow-pre", "arrow-next", "dataType", "arrow-left-square", "arrow-right-square", "role", "pdf", "excel", "word", "zip", "txt", "file", "img", "combo", "modal", "table", "toast", "calendar", "success", "error", "empty", "checkbox-blank", "checkbox-marked", "checkbox-has-selected", "radio-off", "input", "radio-on", "search", "setting", "folder", "folder-open", "user", "arrow-up", "arrow-down", "menu-button"];

class Demo extends React.PureComponent<Props,States> implements IDemo{


    state:States={

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

    render(){
        const {} = this.props;

        return (
            <div className="g-layout icon-box">
                <div className="g-layout-head">
                    <h3>空数据和图标</h3>
                </div>
                <div className="g-layout-article">
                    <div className="g-item-show empty-box" >
                        <Empty/>
                    </div>
                    <div className="g-item-show">
                            {this.getIcon()}
                    </div>
                </div>
            </div>
        );
    }
}


export default Demo;