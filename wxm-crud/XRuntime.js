import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8081/'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true


class XVariable{
    constructor(def,xRuntime){
        this.def = def
        this.xRuntime = xRuntime
        this.prop = null
    }
    setValue(val){
        if(this.def.startsWith("$v.")){
            this.xRuntime.xItem.$set(this.xRuntime.xItem.value,this.def.substr(3),val)
        }
        else if(this.def.startsWith("$rv.")||this.def.startsWith("$rp.")){
            let parentObj = this.getParentObject()
            this.xRuntime.xItem.$set(parentObj,this.prop,val)
        }
        else if(this.def.startsWith("$p.")){
            this.xRuntime.xItem.$set(this.xRuntime.xItem.parameter,this.def.substr(3),val)
        }
        // else{
        // }
    }
    getValue(){
        if(this.def.startsWith("$v.")){
            return this.xRuntime.xItem.value[this.def.substr(3)]
        }
        else if(this.def.startsWith("$rv.")||this.def.startsWith("$rp.")){
            return this.getParentObject()[this.prop]
        }
        else if(this.def.startsWith("$p.")){
            return this.xRuntime.xItem.parameter[this.def.substr(3)]
        }
        else if(this.def.startsWith("$s.")){
            let obj = this.xRuntime.runtimeEnv
            let pathStr = this.def.substr(3)
            let pathArr = pathStr.split(".")
            pathArr.forEach(function(pathItem){
                obj = obj[pathItem]
            })
            return obj
        }
    }
    getParentObject(){
        let obj = null
        let pathStr = this.def.substr(4)
        let pathArr = pathStr.split(".")
        this.prop = pathArr.pop()
        if(this.def.startsWith("$rv.")){
            obj = this.xRuntime.xItem.root.value
            pathArr.forEach(function(pathItem){
                obj = obj[pathItem]
            })
            return obj
        }
        if(this.def.startsWith("$rp.")){
            if(pathArr.length>0&&pathArr[0].startsWith('[')&&pathArr[0].endsWith(']')){
                obj = this.xRuntime.xItem.root
            }
            else {
                obj = this.xRuntime.xItem.root.parameter
            }
            let results = []
            results.push(obj)
            pathArr.forEach(function(pathItem){
                if(pathItem.startsWith('[')&&pathItem.endsWith(']')){
                    pathItem = pathItem.substr(1,pathItem.length-2)
                    let tmpResults = []
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i]
                        for (let j = 0; j < result.$refs.children.length; j++) {
                            let item = result.$refs.children[j]
                            if(item.parameter.key==pathItem){
                                tmpResults.push(item)
                            }
                        }
                    }
                    if(tmpResults.length==0)
                        throw pathStr+'不存在!'
                    results = tmpResults
                }
                else {
                    if(results&&results.length!=1)
                        throw pathStr+'存在多个!'
                    if(results&&results.length==1){
                        obj = results[0].parameter
                        results=null
                    }
                    obj = obj[pathItem]
                }
            })
            if(results&&results.length!=1)
                throw pathStr+'存在多个!'
            if(results&&results.length==1)
                obj = results[0].parameter
        }
        return obj
    }
}

class XCommand{
    constructor(commandStr,xRuntime) {
        this.xRuntime = xRuntime
        this.nextCommand = null
        let arr = commandStr.split('=')
        this.isFun = false
        this.isRemote = false
        if(arr.length==1){
            this.isFun=true
        }
        this.left=arr[0].trim()
        this.leftIsRemote = this.whetherRemote(this.left)
        if(!this.isFun) {
            this.right = arr[1].trim()
            this.rightIsRemote = this.whetherRemote(this.right)
            this.isRemote = this.leftIsRemote||this.rightIsRemote
        }
    }
    whetherRemote(expression){
        return expression.startsWith('[')&&expression.endsWith(']')
    }
    execFun(){
        let tmpArr = this.left.split('(')
        let funName = tmpArr[0]
        let params=[]
        if(tmpArr[1].length>1){
            tmpArr[1]=tmpArr[1].substr(0,tmpArr[1].length-1)
            params=tmpArr[1].split(',')
            for (let i = 0; i < params.length; i++) {
                params[i]=this.getJsonVal(params[i])
            }
        }
        this["__"+funName].apply(this,params)
    }
    exec(){
        let me = this
        let promise = new Promise(function(resolve,reject){
            if(me.isRemote){
                axios.get(me.getRemoteUrl())
                    .then(resolve)
                    .catch(reject)
            }
            else {
                resolve()
            }
        })
        promise.then(function(res){
            if(me.isFun){
                me.execFun()
            }
            else if(me.isRemote){
                if(me.leftIsRemote){
                    console.log(1)
                }
                else {
                    let xVar = new XVariable(me.left,me.xRuntime)
                    xVar.setValue(res.data)
                }
            }
            else {
                if(me.right.startsWith(':')){
                    let leftVar = new XVariable(me.left,me.xRuntime)
                    let rightVar = new XVariable(me.right.substr(1),me.xRuntime)
                    let rightVal = rightVar.getValue()
                    leftVar.setValue(rightVal)
                }
                else {
                    let xVar = new XVariable(me.left,me.xRuntime)
                    let val = me.getJsonVal(me.right)
                    xVar.setValue(val)
                }
            }
            me.nextCommand&&me.nextCommand.exec()
        },function(){
        })
    }
    getRemoteUrl(){
        if(!this.isRemote)
            return
        if(this.leftIsRemote){
            return this.replaceParamUrl(this.left)
        }
        else{
            return this.replaceParamUrl(this.right)
        }
    }
    replaceParamUrl(urlWithParam){
        urlWithParam = urlWithParam.substr(1,urlWithParam.length-2)
        return urlWithParam
    }
    getJsonVal(val){
        let tmp = JSON.parse('{"t":'+val+'}')
        return tmp.t
    }
    __test(param1,param2){
        console.log(param1,param2)
    }
    __scopeMessage(scopeName){
        if(scopeName){
            this.xRuntime.root.recursionHandler(
                {
                    type:'scopeMessage',scopeName:scopeName
                })
        }
    }
}

export default class{
    constructor(content,xItem){
        this.content = content
        this.xItem = xItem
        this.commands=[]
        this.root = xItem.root
        this.runtimeEnv={}
    }
    validate(me){
        if(this.content){
            let commandStrs=this.content.split(/;|\n/)
            commandStrs = commandStrs.filter(function(command){
                return command&&command.trim()
            })
            me = this
            commandStrs.forEach(function(commandStr){
                let command =new XCommand(commandStr,me)
                me.commands.push(command)
            })
            let tmpCommand = null
            this.commands.forEach(function(command){
                if(tmpCommand){
                    tmpCommand.nextCommand=command
                }
                tmpCommand=command
            })
        }
    }
    exec(params){
        this.runtimeEnv = params
        if(this.commands.length>0){
            this.commands[0].exec(params)
        }
    }

}
