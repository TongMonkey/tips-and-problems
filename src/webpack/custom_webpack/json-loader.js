// 10.
export default function (source){
    // loader包是可以被引用后使用的，所以导出
    return `export default ${JSON.stringify(source)}`;
}