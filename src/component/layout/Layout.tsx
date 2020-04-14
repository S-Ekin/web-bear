/**
 * @name 一般的页面布局
 * @description description
 * @time 2020-04-14
 */
import * as React from "react";


type Props={
    tit:string;
    className?:string;
};
type States={

};

class Layout extends React.PureComponent<Props,States> {

    static defaultProps={
      className:""
    }
    state:States={

    };
    render(){
        const {tit,children,className} = this.props;

        return (
          <div className={`g-layout ${className}`}>
            <div className="g-layout-head">{tit}</div>
            <div className="g-layout-article">{children}</div>
          </div>
        );
    }
}


export default Layout;