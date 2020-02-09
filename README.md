# antd-demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

xMessage类型
1、triggerScope:触发XScopeGateway发出scope消息
2、scope消息：触发根节点向内调用recursionHandler


常量参数：scopeMes

数据赋值
a=1     //赋值数值
a="1"       //赋值字符串
a=:b        //赋值变量

a=[users]       //赋值远程变量
a=[users,scopeMes]      //赋值远程变量带参数????

result=[+users,user]
result=[-users/{user.id}]
result=[>users/{user.id},user]

....
[+users]=scopeMes   //新增
[-users]=scopeMes   //删除
[>users]=scopeMes   //修改

分页、排序

$p表示当前参数
$v表示当前value
$rp表示根节点参数
$rv表示根节value

$s表示系统参数，在特定场景由系统生成,类似于java的局部变量：
如table行中的按钮会生成$s.record



