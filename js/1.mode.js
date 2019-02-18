// 发布订阅模式


//绑定的方法‘都有一个update’属性
function Dep() {
    this.subs = []
}

Dep.prototype.addSub = function (sub) { //订阅
    this.subs.push(sub)
}

Dep.prototype.notify = function() {
    this.subs.forEach(sub =>sub.update())
}

function Watcher(fn) { // 通过watcher类的实例都有update方法
    this.fn = fn;
}

Watcher.prototype.update = function() {
    this.fn();
}

let watcher = new Watcher(function() {
    console.log(1)
})

let dep = new Dep();
dep.addSub(watcher); //将watcher 放到了数组中
dep.addSub(watcher); //将watcher 放到了数组中
console.log(dep.subs)

dep.notify() //数组关系