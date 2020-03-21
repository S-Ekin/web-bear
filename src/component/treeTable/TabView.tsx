/**
 * @name 表格区域视图
 * @description 可以区分固定列和活动列
 * @time 2020-03-13
 */
import * as React from "react";
import ParTree from './ParTree';
import TrItem from './TrItem';
type common = MyTreeTabSpace.common;
type Props={
    data:common['data'];
    config:common['config'];
    fixObj:common['fixObj'];
    viewIndex:number;
    changeState:common['changeState'];
    setTabBodyDom(dom:HTMLDivElement,index:number):void;
    changeScrollTop(top:number,viewIndex:number):void;
};
type States={

};
interface ITabView {
    getBody():JSX.Element;
}
class TabView extends React.PureComponent<Props,States> implements ITabView{

    colHeadRef:React.RefObject<HTMLDivElement> = React.createRef();
    tabBodyRef:React.RefObject<HTMLDivElement> = React.createRef();
    state:States={

    }; 
   
    scrollFn=(e:React.UIEvent<HTMLDivElement>)=>{
        if(!e.currentTarget.classList.contains('action-body')){
            return ;
        }
        const {changeScrollTop,viewIndex} = this.props; 
        const dom = e.currentTarget;
        const left = dom.scrollLeft;
        const colHead = this.colHeadRef.current!;
        colHead.scrollLeft = left;
        changeScrollTop(dom.scrollTop,viewIndex);
        
    }
    gethead(){
        const {config:{child:cols}} = this.props;
        const tds = cols.map(val=>{
            const {text,width,field} = val ;
            return (
                <th style={{width: width,}} className="td-border" key={field}>{text}</th>
            );
        });
        return (
            <div className="tab-head" >
                 <table>
                     <thead>
                         <tr>{tds}</tr>
                     </thead>
                </table>
            </div>
        );
    }
    createColgroup(){
        const {config:{child:cols}} = this.props;
        const arr = cols.map(val=>{
            const {width,field} = val ;
            const style = width ? {width} : undefined;
            return (
                <col style={style} key={field}/>
            );
        });
        return (
            <colgroup>
                {arr}
            </colgroup>
        );

    }
    componentDidMount(){
        const {setTabBodyDom,viewIndex,config} = this.props;
        if(!config.forzen){
            this.overBox();
        }
        
        const {current} = this.tabBodyRef;
        setTabBodyDom(current!,viewIndex);
    }
    //有滚动条的时候
    overBox(){

        const tbodyDom = this.tabBodyRef.current!;
        if(tbodyDom.scrollWidth > tbodyDom.clientWidth){
            //给自己的头部隐藏的滚动条占位
            const child = this.colHeadRef.current!.firstElementChild as HTMLDivElement;
            child!.style.paddingRight = "18px";
        }

    }
    createFixViewBottom(){
        const {config:{forzen}} = this.props;
        return forzen ? (
            <div className="fix-bottom"/>
        ):undefined;
    }
    wheelFn=(e:React.WheelEvent<HTMLDivElement>)=>{
        
        const {changeScrollTop,viewIndex} = this.props;
        const deltay  = e.deltaY; // 每滚动一下，滚动的距离
        const top = this.tabBodyRef.current!.scrollTop;
        const distance = top + deltay;
        this.tabBodyRef.current!.scrollTop = distance;
       
        changeScrollTop(distance,viewIndex);
    }
    makeSign=(e:React.MouseEvent<HTMLDivElement>)=>{
        e.preventDefault();
        const type = e.type;
        const dom = e.currentTarget;
        if(type === "mouseenter"){
            dom.classList.add('action-body');
        }else if(type === "mouseleave"){
            dom.classList.remove('action-body');
        }
        
        
    }
    getBody(){
        const {data,fixObj,fixObj:{idField,childField},config,viewIndex,changeState} = this.props;
        const {child:cols} = config;
        let order = {order:0} ;
        const trs = data.map((val,index)=>{
            const arr = val.get(childField);
            const id = val.get(idField);
            const isMainView= viewIndex === 0 ;
            if(arr && arr.size){
                return (
                    <ParTree
                        key={id}
                        order={order}
                        changeState={changeState}
                        lev={0}
                        index={`${index}`}
                        node={val}
                        cols={cols}
                        isMainView={isMainView}
                        fixObj={fixObj}
                    />
                );
            }else{
                return (
                    <TrItem
                        key={id}
                        order={order}
                        node={val}
                        index={`${index}`}
                        changeState={changeState}
                        cols={cols}
                        isMainView={isMainView}
                        lev={0}
                        fixObj={fixObj}
                    />
                );
            }
        });
        const colgroup = this.createColgroup();
        const fn = !config.forzen ? this.scrollFn : undefined;
        const wheel = config.forzen ? this.wheelFn :undefined;
        const makeSignFn = !config.forzen ? this.makeSign :undefined;

        return (
                <div className="tab-body-main" 
                    onScroll={fn} 
                    onWheel={wheel}
                    onMouseEnter={makeSignFn}
                    onMouseLeave={makeSignFn}
                    ref={this.tabBodyRef} 
                >
                    <table>
                        {colgroup}
                        <tbody>
                            {trs} 
                        </tbody>
                    </table>
                </div>
        );
    }

    render(){
        const {config:{width,forzen},config} = this.props;
        const styleObj = width && forzen ? {width} : undefined;

        const className = config.forzen ? "tab-view-fix" : "tab-view-scroll";
        return (
            <div className={`${className} tab-viewBody`} style={styleObj}>
                <div className="tab-head-wrap" ref={this.colHeadRef}>
                    {this.gethead()}
                </div>
                <div className="tab-body-wrap">
                    {this.getBody()}
                    {this.createFixViewBottom()}
                </div>
            </div>
        );
    }
}


export default TabView;