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
    initComputed.call(this);
    new Complie(options.el, this);
}

function initComputed () { //具有缓存功能
    let vm = this;
    let computed = this.$options.computed;
    Object.keys(computed).forEach(function(key){
        Object.defineProperty(vm,key,{
            //如果是函数直接调用，否则调用.get方法
            get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
            set() { }
        })
    })
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
                new Watcher(vm, RegExp.$1,function(newVal) { //函数需要接收一个新值
                    node.textContent = text.replace(/\{\{(.*)\}\}/, newVal);
                });
                node.textContent = text.replace(/\{\{(.*)\}\}/,val);
            }
            if (node.nodeType === 1){
                //元素节点
                let nodeAttrs = node.attributes; //获取当前dom节点的属性
                console.log(nodeAttrs)
                Array.from(nodeAttrs).forEach(function(attr){
                    console.log(attr.name, attr.value, attr)
                    let name = attr.name;
                    let exp = attr.value;
                    if(name.indexOf('v-')==0){
                        node.value = vm[exp]; 
                    }
                    new Watcher(vm,exp,function(newVal) {
                        node.value = newVal; //当watcher触发时会自动将内容放入输入框内
                    })
                    node.addEventListener('input',function(e){
                        let newVal = e.target.value;
                        vm[exp] = newVal;
                    })
                })
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
    let dep = new Dep();//将需要观察的放进watcher中
    for (let key in data) {
        let val = data[key]
        observe(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            get() {
                Dep.target&&dep.addSub(Dep.target);//[watcher]
                return val;
            },
            set(newVal) {
                if (newVal === val) return
                val = newVal;
                observe(newVal)
                dep.notify(); //让所有的watcher的update方法执行即可
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
function Watcher(vm,exp,fn) { // 通过watcher类的实例都有update方法
    this.fn = fn;
    this.vm = vm;
    this.exp = exp; //添加到订阅中
    Dep.target = this;
    let val = vm;
    let arr = exp.split(".");
    arr.forEach(function(k){
        val = val[k]
    })
    Dep.target = null;
}
// 每当设置值的时候都会触发set方法，一旦触发，即可替换
Watcher.prototype.update = function() {
  let val = this.vm;
    let arr = this.exp.split(".");
    arr.forEach(function (k) {
        val = val[k]
    })
  this.fn(val); // newVal
};


