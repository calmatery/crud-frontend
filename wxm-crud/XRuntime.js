import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8081/'
axios.defaults.headers['Content-Type'] = 'application/json;charse=UTF-8'
axios.defaults.crossDomain = true
axios.defaults.withCredentials = true


class XVariable{
    constructor(def,xRuntime,xItem,env){
        this.def = def
        let pathArr = def.split('.')
        if(pathArr.length>1){
            this.type = pathArr[0]
            pathArr.shift()
            this.pathArr = pathArr
        }
        this.xRuntime = xRuntime
        this.xItem= xItem
        this.env = env
        this.prop = null
    }
    setValue(val){
        if(this.type=="$v"){
            this.xItem.$set(this.xItem.value,this.pathArr[0],val)
        }
        else if(this.type=="$rv"||this.type=="$rp"||this.type=="$s"){
            let parentObj = this.getParentObject()
            this.xItem.$set(parentObj,this.prop,val)
        }
        else if(this.type=="$p"){
            this.xItem.$set(this.xItem.parameter,this.pathArr[0],val)
        }
    }
    getValue(){
        if(this.type=="$v"){
            return this.xItem.value[this.def.substr(3)]
        }
        else if(this.type=="$rv"||this.type=="$rp"||this.type=="$s"){
            return this.getParentObject()[this.prop]
        }
        else if(this.type=="$p"){
            return this.xItem.parameter[this.def.substr(3)]
        }
    }
    getParentObject(){
        let obj = null
        this.prop = this.pathArr.pop()

        if(this.type=="$s"){
            let obj = this.env
            this.pathArr.forEach(function(pathItem){
                obj = obj[pathItem]
            })
            return obj
        }

        if(this.type=="$rv"){
            obj = this.xItem.root.value
            this.pathArr.forEach(function(pathItem){
                obj = obj[pathItem]
            })
            return obj
        }
        if(this.type=="$rp"){
            if(this.pathArr.length>0&&this.pathArr[0].startsWith('[')&&this.pathArr[0].endsWith(']')){
                obj = this.xItem.root
            }
            else {
                obj = this.xItem.root.parameter
            }
            let results = []
            results.push(obj)
            let me = this
            this.pathArr.forEach(function(pathItem){
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
                        throw me.def+'不存在!'
                    results = tmpResults
                }
                else {
                    if(results&&results.length!=1)
                        throw  me.def+'存在多个!'
                    if(results&&results.length==1){
                        obj = results[0].parameter
                        results=null
                    }
                    obj = obj[pathItem]
                }
            })
            if(results&&results.length!=1)
                throw me.def+'存在多个!'
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
        this.remoteUrl=""
        this.remoteMethod=""
        this.remoteParams=null
        if(arr.length==1){
            this.isFun=true
        }
        this.left=arr[0].trim()
        if(!this.isFun) {
            this.right = arr[1].trim()
            this.isRemote = this.whetherRemote(this.right)
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
    exec(xItem,env){
        this.initRemote(xItem,env)
        let me = this
        let promise = new Promise(function(resolve,reject){
            if(me.isRemote){
                if(me.remoteMethod=='get'){
                    axios.get(me.remoteUrl)
                        .then(resolve)
                        .catch(reject)
                }
                if(me.remoteMethod=='post'){
                    axios.post(me.remoteUrl,me.remoteParams)
                        .then(resolve)
                        .catch(reject)
                }
                if(me.remoteMethod=='put'){
                    axios.put(me.remoteUrl,me.remoteParams)
                        .then(resolve)
                        .catch(reject)
                }
                if(me.remoteMethod=='delete'){
                    axios.delete(me.remoteUrl)
                        .then(resolve)
                        .catch(reject)
                }
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
                let xVar = new XVariable(me.left,me.xRuntime,xItem,env)
                xVar.setValue(res.data)
            }
            else {
                if(me.right.startsWith(':')){
                    let leftVar = new XVariable(me.left,me.xRuntime,xItem,env)
                    let rightVar = new XVariable(me.right.substr(1),me.xRuntime,xItem,env)
                    let rightVal = rightVar.getValue()
                    leftVar.setValue(rightVal)
                }
                else {
                    let xVar = new XVariable(me.left,me.xRuntime,xItem,env)
                    let val = me.getJsonVal(me.right)
                    xVar.setValue(val)
                }
            }
            me.nextCommand&&me.nextCommand.exec(xItem,env)
        },function(){
        })
    }
    initRemote(xItem,env){
        if(!this.isRemote)
            return
        let url = this.right.substr(1,this.right.length-2)
        let urlArr = url.split(",")
        url = urlArr[0]
        if(url.startsWith("+")){
            this.remoteMethod = 'post'
            url = url.substr(1)
        }
        else if(url.startsWith("-")){
            this.remoteMethod = 'delete'
            url = url.substr(1)
        }
        else if(url.startsWith(">")){
            this.remoteMethod = 'put'
            url = url.substr(1)
        }
        else {
            this.remoteMethod = 'get'
        }
        // eslint-disable-next-line
        let varReg = /\{[^\{\}]*\}/g
        let urlMatches = url.matchAll(varReg)
        let urlParts = []
        let next
        while((next = urlMatches.next()).value){
            urlParts.push(next.value)
        }

        for (let i = 0; i < urlParts.length; i++) {
            let urlPart = urlParts[i][0]
            let xVar = new XVariable(urlPart.substr(1,urlPart.length-2),this.xRuntime,xItem,env)
            url = url.replace(urlPart,xVar.getValue())
        }
        this.remoteUrl = url
        if(urlArr.length>=2){
            let xVar = new XVariable(urlArr[1],this.xRuntime,xItem,env)
            this.remoteParams = xVar.getValue()
        }
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
    rootEnv={}
    constructor(root){
        this.root = root
        this.pageEnv={}
    }
    // constructor(content,xItem,runtimeEnv){
    //     this.content = content
    //     this.xItem = xItem
    //     this.commands=[]
    //     this.root = xItem.root
    //     this.runtimeEnv=runtimeEnv||{}
    // }
    validate(content){
        let commands = []
        let me = this
        if(content){
            let commandStrs=content.split(/;|\n/)
            commandStrs = commandStrs.filter(function(command){
                return command&&command.trim()
            })

            commandStrs.forEach(function(commandStr){
                let command =new XCommand(commandStr,me)
                commands.push(command)
            })
            let tmpCommand = null
            commands.forEach(function(command){
                if(tmpCommand){
                    tmpCommand.nextCommand=command
                }
                tmpCommand=command
            })
        }
        return commands
    }
    exec(xItem,content,env){
        let commands = this.validate(content)
        if(commands.length>0){
            commands[0].exec(xItem,env||{})
        }
    }

}
