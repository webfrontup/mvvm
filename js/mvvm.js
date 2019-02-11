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
    return new Observe(data)
}

// vue特点不能新增不存在的属性 不能存在的属性没有get和set
// 深度响应 因为每次赋予一个新对象时会给这个新对象增加数据劫持


