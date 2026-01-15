// 控制台输出
console.log("Hello, World!");
// // 网页输出
// document.write("<h1>Welcome to JavaScript!</h1>");
// // 弹出警告框
// alert("JavaScript is working!");

// ---------------------------------------------------------------------------------------------------------------

// 基本变量和数据类型：
// 数字（number）、字符串（string）、布尔值（boolean）、对象（object）、未定义（undefined）
// js中变量、对象用var来声明，常量用const来声明，块级作用域变量用let来声明。
// 更推荐使用let，避免使用var，因为var声明的变量是全局变量，可能会引起变量污染和冲突
// （假如前面有个var a，后面有let a了，现在let a会覆盖前面的var a，但是脱离let作用域后，var a又会重新生效，容易引起混淆）
// 值得注意的是null的类型是object，和java不一样（java的null没有类型）

var a = 10; // 数字 number
console.log(typeof a);

var b = 3.14; // 数字 number
console.log(typeof b);

var c = "Hello"; // 字符串 string
console.log(typeof c);

var d = true; // boolean
console.log(typeof d);

var e = null; // 空 object
console.log(typeof e);

var f; // 未定义 undefined
console.log(typeof f);

let g = "Block scoped variable"; // 使用let声明临时变量
console.log(typeof g);

const h = "Constant variable"; // 常量
console.log(typeof h);


// ---------------------------------------------------------------------------------------------------------------

// 举例说明作用域的不同
// var 的函数作用域
function varExample() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 输出 10（变量泄露到函数作用域）
}
varExample();
// let 和 const 的块级作用域
function letConstExample() {
    if (true) {
        let y = 20;
        const z = 30;
        console.log(y); // 输出 20
        console.log(z); // 输出 30
    }
    // console.log(y); // 报错：b is not defined，因为被let声明的变量是块级作用域，脱离了if块就无法访问
    // console.log(z); // 报错：c is not defined，被const声明的变量也是块级作用域，脱离了if块就无法访问
}
letConstExample();

// 另一个问题是变量提升，var声明的变量，程序开始会先声明因此可以先使用再声明（虽然使用的时候是undefined），而let和const不会
function hoistingExample() {
    console.log(a); // 输出 undefined（变量提升）
    var a = 5;
    // console.log(b); // 报错：Cannot access 'b' before initialization
    let b = 10;
}
hoistingExample();

//var的值可以被重新赋值和重新声明，但let只能重新赋值不能重新声明
var m = 1;
var m = 2; // 重新声明没有问题
m = 3; // 重新赋值也没有问题
console.log(m); // 输出3

let n = 1;
// let n = 2; // 报错：Identifier 'n' has already been declared
n = 3; // 重新赋值没有问题
console.log(n); // 输出3


// ---------------------------------------------------------------------------------------------------------------

// 对象
var person = {
    name: "Alice",
    age: 25
};
console.log(person);
console.log(typeof person); // 对象类型

// 数组
var numbers = [1, 2, 3, 4, 5];
console.log(typeof numbers); // 数组在js中也是对象类型

// 函数 函数的入参和返回值也不用声明类型
function add(x, y) {
    return x + y;
}
console.log(add(2, 3));
console.log(typeof add); // 函数在js中也是对象类型

// 箭头函数
let multiply = (x, y) => x * y;
console.log(multiply(2, 3));
// 为啥箭头函数前面有个let？因为箭头函数本质上是一个匿名函数表达式，需要一个变量来引用它
// 箭头函数的生命周期和let作用域也是一样的

// ---------------------------------------------------------------------------------------------------------------

// 事件
// 一般js事件有三种：
// 1. 鼠标事件 悬停 点击 挪开
// 2. 键盘事件 按下 松开
// 3. 窗口事件 窗口的缩放、滚动 网页的加载...
function HelloWorld() {
    console.log("Hello, World!");
    let ele = document.querySelector("#box"); // 选择一个元素（通过id）
    let eles = document.querySelectorAll(".student"); // 选择一类元素
    console.log("box element:", ele);
    console.log("student elements:", eles);
}

// onload是窗口事件的一种，当网页加载完成后会自动触发
onload = function () {
    console.log("网页加载完成！");
    document.getElementById("box")
    console.log("box element:", document.getElementById("box"));
}

function SendRequest() {
    console.log("发送请求按钮被点击！");
    // fetch是js中发送http请求的API，返回一个Promise对象，promise表示一个异步操作的最终完成（或失败）及其结果值
    // .then()方法用于指定请求成功后的回调函数
    fetch("https://www.baidu.com")
        .then(response => {
        console.log("请求成功，响应状态码：", response.status);
    });
}