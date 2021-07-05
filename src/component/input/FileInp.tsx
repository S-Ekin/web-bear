/**
 * @author: SEKin
 * @Date: 2021-06-19 09:02:51
 * @description:
 * @Last Modified time: 2021-06-19 09:02:51
 */
import * as immutable from "immutable";
import * as React from "react";
import {Button} from "../button/index";
import {SvgIcon} from "../my-icon/index";
import {IImmutalbeList} from "../util/immutableUtil";
let createId = 0;
type props<T>={
  dataSet?:string;
  disabled?:boolean;
  hasFiles?:T[];
  hasFilesTextField?:string;
  hasFilesIdField?:string;
  hasFilesUrlField?:string;
  name?:string;
  width?:number;
  multiply?:boolean;
  className?:string;
  norequire?:boolean ;
  fileTypeMatch?:string;
  changeFn?:(files: states<T>["upFiles"], name:string | undefined, dataSet?:string)=>void;
  removeFIleFn?:(files: states<T>["upFiles"], name:string | undefined, type:string)=>void;
  bindGetUpAndHasFiles?:(fn:()=>{
    upFiles: File[],
    hasFile: T[],
  })=>void;
};
type states<T>={
  upFiles: IImmutalbeList<{id:number;file:File}>;
  hasFile: IImmutalbeList<T>;
  preHasFiles: props<T>["hasFiles"];
};
interface IInput {
  getInpTit():JSX.Element |"";
}
class FileInp<T extends AnyObj>
  extends React.PureComponent<props<T>, states<T>>
  implements IInput {
  static defaultProps = {
    styleName: "normal",
    hasFilesTextField: "text",
    hasFilesIdField: "id",
    hasFilesUrlField: "url"
  };

  static  getDerivedStateFromProps (nextProps:props<AnyObj>, preState:states<AnyObj>):Partial<states<AnyObj>> | null {
    if (nextProps.hasFiles !== preState.preHasFiles) {
      return {
        preHasFiles: nextProps.hasFiles,
        hasFile: immutable.List(nextProps.hasFiles ? nextProps.hasFiles : []),
        upFiles: immutable.List()
      };
    }
    return null;
  }

  constructor (prop: props<T>) {
    super(prop);
    const { bindGetUpAndHasFiles } = prop;
    bindGetUpAndHasFiles && bindGetUpAndHasFiles(this.getFiles);
    this.state = {
      upFiles: immutable.fromJS([]),
      hasFile: immutable.List(prop.hasFiles ? prop.hasFiles : []),
      preHasFiles: prop.hasFiles
    };
  }

  getFiles = () => {
	  const obj =  {
      upFiles: this.state.upFiles.map((val) => val.file).toArray(),
      hasFile: this.state.hasFile.toArray()
    };
    return obj;
  };

  getInpTit () {
    const { children } = this.props;
    const lab = children ? <span className="lab-tit">{children}</span> : "";
    return lab;
  }
  changeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { fileTypeMatch, multiply } = this.props;
    const dom = e.currentTarget;
    const file = dom.files!;
    const fileName = file[0].name.split(".");
    const type = fileName[fileName.length - 1];
    if (fileTypeMatch && !fileTypeMatch.split(",").includes(type)) {
      return;
    }
    const item = {
      id: createId++,
      file: file[0],
    };
    this.setState(
      (pre) => ({
        upFiles: multiply
          ? pre.upFiles.push(item)
          : pre.upFiles.clear().push(item),
      }),
      () => {
        dom.value = "";
        const { upFiles } = this.state;
        const { dataSet, name, changeFn } = this.props;
        changeFn && changeFn(upFiles, name, dataSet);
      }
    );
  };

  removeFileItem = (e: React.MouseEvent<HTMLSpanElement>) => {
    const dom = e.currentTarget;
    const type = dom.dataset.type;
    const index = +dom.dataset.index!;
    const {removeFIleFn} = this.props;
    if (type === "upFile") {
      this.setState((pre) => ({
        upFiles: pre.upFiles.delete(index),
      }), () => {
        const {upFiles} = this.state;
        const {name} = this.props;
        removeFIleFn && removeFIleFn(upFiles, name, type);
      });
    } else {
      this.setState((pre) => ({
        hasFile: pre.hasFile.delete(index),
      }), () => {
        const {upFiles} = this.state;
        const {name} = this.props;
        removeFIleFn && removeFIleFn(upFiles, name, type!);
      });
    }
  };

  getHasFile () {
    const {hasFile} = this.state;
    const { hasFilesIdField, hasFilesTextField, width, hasFilesUrlField } = this.props;
    const style = width ? { width: width } : undefined;
    return (
      <div className="has-files" style={style}>
        {hasFile!.map((val, index) => (
          <span className="file-item" key={val[hasFilesIdField!]}>
            <a style={{color: "#536ec2"}}  download={val[hasFilesTextField!]} href={val[hasFilesUrlField!]} rel="noreferrer">
              {val[hasFilesTextField!]}
            </a>
            <span
              className="j-del"
              onClick={this.removeFileItem}
              data-type="hasFile"
              data-index={index}
            >
              <SvgIcon className="close" />
            </span>
          </span>
        ))}
      </div>
    );
  }
  render () {
    const {
      name,
      dataSet,
      className,
      width,
      norequire,
      disabled,
      multiply,
      hasFiles
    } = this.props;
    const { upFiles } = this.state;
    const style = width ? { width: width } : undefined;
    const noFill = norequire || disabled ? false : !upFiles.size;
    const requireName = noFill ? "no-fill" : "";
    return (
      <div className={`g-file-box ${className!}`}>
        {this.getInpTit()}
        <div>
          {hasFiles ? this.getHasFile() : null}
          <div className="j-file">
            <Button disabled={disabled}>文件上传</Button>
            <input
              className="file-inp"
              name={name}
              type="file"
              disabled={disabled}
              data-set={dataSet}
              onChange={this.changeFn}
            />
          </div>
          <div
            className={`up-files ${requireName}`}
            style={style}
            data-tit={multiply ? "多文件..." : "单文件..."}
          >
            {upFiles.map((val, index) => (
              <span className="file-item" key={val.id}>
                <span>{val.file.name}</span>
                <span
                  className="j-del"
                  onClick={this.removeFileItem}
                  data-type="upFile"
                  data-index={index}
                >
                  <SvgIcon className="close" />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}


export default FileInp;
