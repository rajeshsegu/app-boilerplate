

var Util = {

    noOp: function(){
        return this;
    },

    extendMethod: function(target, methodName, func){

        //Save the super method
        func.base = target[methodName] || emptyMethod;

        //Replace Method with new one
        target[methodName] = func;

    },

    getByPath: function(obj, keyPath){

        var keys, keyLen, i=0, key;

        obj = obj || window;
        keys = keyPath && keyPath.split(".");
        keyLen = keys && keys.length;

        while(i < keyLen && obj){

            key = keys[i];
            obj = (typeof obj.get == "function")
                ? obj.get(key)
                : obj[key];
            i++;
        }

        if(i < keyLen){
            obj = null;
        }

        return obj;
    },

    prettyPrint: function(obj){
        var toString = Object.prototype.toString,
            newLine = "<br>",
            buffer = "",
            indent = arguments.pop() || 0,
            indentStr = (function(n){
                var str = "";
                while(n--){
                    str += "&nbsp;";
                }
                return str;
            })(indent);

        if(!obj || typeof obj != "object"){
            //any non-object ( Boolean, String, Number ), null, undefined, NaN
            buffer += obj;
        }else if(toString.call(obj) == "[object Date]"){
            buffer += "[Date] " + obj;
        }else if(toString.call(obj) == "[object RegExp"){
            buffer += "[RegExp] " + obj;
        }else if(toString.call(obj) == "[object Function]"){
            buffer += "[Function]";
        }else if(toString.call(obj) == "[object Array]"){
            var idx = 0, len = obj.length;
            buffer += "["+newLine;
            while(idx < len){
                buffer += [indentStr, idx, ": ", prettyPrint(obj[idx], indent+8)].join("");
                buffer += "<br>";
                idx++;
            }
            buffer += indentStr + "]";
        }else {
            var prop;
            buffer += "{"+newLine;
            for(prop in obj){
                buffer += [indentStr, prop, ": ", prettyPrint(obj[prop], indent+8)].join("");
                buffer += newLine;
            }
            buffer += indentStr + "}";
        }

        return buffer;
    },

    clone: function(src, deep) {

        var toString = Object.prototype.toString;
        if(!src && typeof src != "object"){
            //any non-object ( Boolean, String, Number ), null, undefined, NaN
            return src;
        }

        //Honor native/custom clone methods
        if(src.clone && toString.call(src.clone) == "[object Function]"){
            return src.clone(deep);
        }

        //DOM Elements
        if(src.nodeType && toString.call(src.cloneNode) == "[object Function]"){
            return src.cloneNode(deep);
        }

        //Date
        if(toString.call(src) == "[object Date]"){
            return new Date(src.getTime());
        }

        //RegExp
        if(toString.call(src) == "[object RegExp]"){
            return new RegExp(src);
        }

        //Function
        if(toString.call(src) == "[object Function]"){
            //Wrap in another method to make sure == is not true;
            //Note: Huge performance issue due to closures, comment this :)
            return (function(){
                src.apply(this, arguments);
            });

        }

        var ret, index;
        //Array
        if(toString.call(src) == "[object Array]"){
            //[].slice(0) would soft clone
            ret = src.slice();
            if(deep){
                index = ret.length;
                while(index--){
                    ret[index] = clone(ret[index], true);
                }
            }
        }
        //Object
        else {
            ret = src.constructor ? new src.constructor() : {};
            for (var prop in src) {
                ret[prop] = deep
                    ? clone(src[prop], true)
                    : src[prop];
            }
        }

        return ret;
    }
};

//Extend Base JS functionality
(function(){

    //Override getByPath()
    Util.extendMethod(Object.prototype, "getByPath", Util.getByPath);
    Util.extendMethod(Array.prototype, "getByPath", Util.getByPath);

    //Override prettyPrint()
    Util.extendMethod(Object.prototype, "prettyPrint", Util.prettyPrint);


}());

// Avoid `console` errors in browsers that lack a console
if (!(window.console && console.log)) {
    (function() {
        //var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = Util.noOp;
        }
    }());
}