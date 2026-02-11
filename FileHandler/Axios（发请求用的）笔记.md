# Axios简介
Axios是一个基于Promise的HTTP客户端，用于浏览器和Node.js环境中发送HTTP请求。它提供了一种简洁且易于使用的API，使得与服务器进行通信变得更加方便。
通过axios就可以**调用后端接口**。

# 使用
## 安装
```bash
npm install axios
```

## 引入
在mian.js中引入Axios：
```js
import axios from "axios";
```

## 发送请求

### GET请求
类似于springboot的getmapping  
方法中还有一些配置项可以看[官方文档](https://axios-http.com/zh/docs/req_config)
```js
axios.get('https://localhost:8080/test?ID=12345')
    // 如果get成功了会执行.then的代码
    // .then中传入了回调函数，服务器响应回来的数据被包装进入response的data属性中（是个array，每个元素是json）
  .then(function (response) {
    console.log('Data fetched successfully:', response.data);
  })
    // 如果get失败了会执行.catch的代码，如果失败了error参数中会包含错误信息
  .catch(function (error) { 
    console.error('Error fetching data:', error);
  })
  .then(function () {
    // 无论请求成功或失败，都会执行这里的代码
  });
```
如果参数比较多，`.get('https://localhost:8080/test?ID=12345')`也可写作下面这种形式，他会自动拼接回去。
```js
axios.get('https://localhost:8080/test', { 
    params: { 
        ID: 12345
    } 
})
```
此时发现无法访问，为什么呢？因为**跨域访问**问题，这就需要在后端controller接口上添加`@CrossOrigin`注解来允许跨域访问。

当然，后端端口可能会有变化，这样写起来修改不方便，因此可以在`根组件App.vue`中设定BaseURL：
```js
axios.defaults.baseURL = 'https://localhost:8080';
Vue.prototype.$http = axios
```
然后在其他组件中就可以直接使用相对路径：
```js
this.$http.get('/test', { 
    params: { 
        ID: 12345
    } 
})
```
还有一个问题就是**回调函数中`this`的作用域问题**，可以使用**箭头函数**来解决：
```js
// 接上面代码
.then((response) => {
    this.tableData = response.data; // 这里的this指向Vue实例
})
```
**这样就可以把this.tableData渲染到前端组件上了。**


### POST请求
类似于springboot的postmapping，应该注意，axios在发送post请求时，`默认会将数据转换为JSON格式发送到服务器`。
```js
axios.post('https://localhost:8080/test', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log('Data posted successfully:', response.data);
  })
  .catch(function (error) {
    console.error('Error posting data:', error);
  });
```

### async/Await语法 (不常用)
使用async/await语法可以使代码更简洁易读：
```js
async function fetchData() {
  try {
    const response = await axios.get('https://localhost:8080/test?ID=12345');
    console.log('Data fetched successfully:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
```
```js
async fucntion postData() {
  try {
    const response = await axios.post('https://localhost:8080/test', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    });
    console.log('Data posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting data:', error);
  }
}
```
