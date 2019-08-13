declare module "react-scrollbar" {

    type props = {
        speed?:Number;
        className?:String;
        style?:Object;
        contentClassName?:String;
        contentStyle?:Object;
        horizontal?:Boolean;
        horizontalContainerStyle?:Object;
        horizontalScrollbarStyle?:Object;
        vertical?:Boolean;
        verticalContainerStyle?:Object;
        verticalScrollbarStyle?:React.CSSProperties;
        onScroll?:(value:any) => void;
        contentWindow?:Object;
        ownerDocument?:Object;
        smoothScrolling?:Boolean;
        minScrollSize?:Number;
        swapWheelAxes?:Boolean;
        stopScrollPropagation?:Boolean;
        focusableTabIndex?:Number;
    }

    

    
    export default class  extends React.Component<props>{

    }
} 