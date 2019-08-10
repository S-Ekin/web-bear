declare namespace MyTabSpace{

    export interface columnItem  {
        text: string;
        width?: number | string;
        field: string;
        formatter?: (node:any,index:string,tabField:string) => React.ReactChild;
        renderTit?: (tabField:string) => React.ReactChild;
        rowSpanField?:boolean;
    }
}