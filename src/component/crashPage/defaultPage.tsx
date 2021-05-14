import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import  CrashPage  from "./CrashPage";
const DefaultPage:React.FunctionComponent<RouteComponentProps<{id:string}> & {defaultSrc?:string}> = ({history, location, defaultSrc = "/"}) => (
  <div className="default-page">
    <CrashPage type="noFind" msg={`请使用正确的页面地址，保证该【${location.pathname}】页面地址存在!`} reloadFn={() => {
      history.push(defaultSrc);
    }} />
  </div>
);
export default DefaultPage;
