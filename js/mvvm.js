function Yyccqqu(options = {}) {
    this.$options = options //将所有属性挂载在了$options上;
    var data = this._data = this.$options.data
    observe(data);
    // this代理了this._data
    for (let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key]
            },
            set(newVal) {
                this._data[key] = newVal
            }
        })
    }
    new Complie(options.el, this);
}

function Complie(el,vm) {
    // el表示替换的范围
    vm.$el = document.querySelector(el);
    //创建文档碎片 放如内存中
    let fragment = document.createDocumentFragment();
    while (child = vm.$el.firstChild) { //将app内容 放入内存中
        fragment.appendChild(child)
    }
    replace(fragment);
    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(function (node) {
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/
            //http://www.runoob.com/jsref/prop-node-nodetype.html
            if (node.nodeType === 3 && reg.test(text)) {
                console.log(RegExp.$1)
                let arr = RegExp.$1.split(".");
                let val = vm;
                arr.forEach(function(k){ //取this.a.a
                    val = val[k];
                })
                node.textContent = text.replace(/\{\{(.*)\}\}/,val);
            }
            if (node.childNodes) {
                replace(node)
            }

        });
    }
    
    vm.$el.appendChild(fragment);
}


// vm.$options
// 观察对象给对象增加ObjectDefineProperty
function Observe(data) {
    for (let key in data) {
        let val = data[key]
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                return val;
            },
            set(newVal) {
                if (newVal === val) return
                val = newVal;
                observe(newVal)
            }
        })
    }

}

function observe(data) {
    if(typeof data !=='object') return
    return new Observe(data)
}

// vue特点不能新增不存在的属性 不能存在的属性没有get和set
// 深度响应 因为每次赋予一个新对象时会给这个新对象增加数据劫持



//发布订阅

//绑定的方法‘都有一个update’属性
function Dep() {
    this.subs = []
}

Dep.prototype.addSub = function (sub) { //订阅
    this.subs.push(sub)
}

Dep.prototype.notify = function () {
    this.subs.forEach(sub => sub.update())
}

// watcher
function Watcher(fn) { // 通过watcher类的实例都有update方法
    this.fn = fn;
}

Watcher.prototype.update = function () {
    this.fn();
}


