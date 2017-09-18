
module RongIMLib {

    export class PublicServiceMap {
        publicServiceList: Array<any>;
        constructor() {
            this.publicServiceList = [];
        }
        get(publicServiceType: ConversationType, publicServiceId: string): PublicServiceProfile {
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (this.publicServiceList[i].conversationType == publicServiceType && publicServiceId == this.publicServiceList[i].publicServiceId) {
                    return this.publicServiceList[i];
                }
            }
        }
        add(publicServiceProfile: PublicServiceProfile) {
            var isAdd: boolean = true, me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.unshift(this.publicServiceList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.publicServiceList.unshift(publicServiceProfile);
            }
        }
        replace(publicServiceProfile: PublicServiceProfile) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == publicServiceProfile.conversationType && publicServiceProfile.publicServiceId == me.publicServiceList[i].publicServiceId) {
                    me.publicServiceList.splice(i, 1, publicServiceProfile);
                    break;
                }
            }
        }
        remove(conversationType: ConversationType, publicServiceId: string) {
            var me = this;
            for (let i = 0, len = this.publicServiceList.length; i < len; i++) {
                if (me.publicServiceList[i].conversationType == conversationType && publicServiceId == me.publicServiceList[i].publicServiceId) {
                    this.publicServiceList.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 会话工具类。
     */
    export class ConversationMap {
        conversationList: Array<Conversation>;
        constructor() {
            this.conversationList = [];
        }
        get(conversavtionType: number, targetId: string): Conversation {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType == conversavtionType && this.conversationList[i].targetId == targetId) {
                    return this.conversationList[i];
                }
            }
            return null;
        }
        add(conversation: Conversation): void {
            var isAdd: boolean = true;
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.unshift(this.conversationList.splice(i, 1)[0]);
                    isAdd = false;
                    break;
                }
            }
            if (isAdd) {
                this.conversationList.unshift(conversation);
            }
        }
        /**
         * [replace 替换会话]
         * 会话数组存在的情况下调用add方法会是当前会话被替换且返回到第一个位置，导致用户本地一些设置失效，所以提供replace方法
         */
        replace(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1, conversation);
                    break;
                }
            }
        }
        remove(conversation: Conversation) {
            for (let i = 0, len = this.conversationList.length; i < len; i++) {
                if (this.conversationList[i].conversationType === conversation.conversationType && this.conversationList[i].targetId === conversation.targetId) {
                    this.conversationList.splice(i, 1);
                    break;
                }
            }
        }
    }

    export class CheckParam {
        static _instance: CheckParam;
        static getInstance(): CheckParam {
            if (!CheckParam._instance) {
                CheckParam._instance = new CheckParam();
            }
            return CheckParam._instance;
        }

        logger(code: any, funcName: string, msg: string) {
            RongIMClient.logger({
                code: code,
                funcName: funcName,
                msg: msg
            });
        }

        check(f: any, position: string, d?: any, c?:any) {
            if (RongIMClient._dataAccessProvider || d) {
                for (var g = 0, e = c.length; g < e; g++) {
                    if (!new RegExp(this.getType(c[g])).test(f[g])) {
                        // throw new Error("The index of " + g + " parameter was wrong type " + this.getType(c[g]) + " [" + f[g] + "] -> position:" + position);
                        var msg = "第" + (g + 1) + "个参数错误, 错误类型：" + this.getType(c[g]) + " [" + f[g] + "] -> 位置:" + position;
                        this.logger("-3", position, msg);
                    }
                }
            } else {
                var msg = "该参数不正确或尚未实例化RongIMClient -> 位置:" + position;
                this.logger("-4", position, msg);
                // throw new Error("The parameter is incorrect or was not yet instantiated RongIMClient -> position:" + position);
            }
        }
        getType(str: string): string {
            var temp = Object.prototype.toString.call(str).toLowerCase();
            return temp.slice(8, temp.length - 1);
        }
        checkCookieDisable(): boolean {
            document.cookie = "checkCookie=1";
            var arr = document.cookie.match(new RegExp("(^| )checkCookie=([^;]*)(;|$)")), isDisable = false;
            if (!arr) {
                isDisable = true;
            }
            document.cookie = "checkCookie=1;expires=Thu, 01-Jan-1970 00:00:01 GMT";
            return isDisable;
        }
    }
    export class LimitableMap {
        map: any;
        keys: any;
        limit: number;
        constructor(limit?: number) {
            this.map = {};
            this.keys = [];
            this.limit = limit || 10;
        }
        set(key: string, value: any): void {
            if (this.map.hasOwnProperty(key)) {
                if (this.keys.length === this.limit) {
                    var firstKey = this.keys.shift();
                    delete this.map[firstKey];
                }
                this.keys.push(key);
            }
            this.map[key] = value;
        }
        get(key: string): number {
            return this.map[key] || 0;
        }
        remove(key: string): void {
            delete this.map[key];
        }
    }

    export class RongAjax {
        options: any;
        xmlhttp: any;
        constructor(options: any) {
            var me = this;
            me.xmlhttp = null;
            me.options = options;
            var hasCORS = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
            if ("undefined" != typeof XMLHttpRequest && hasCORS) {
                me.xmlhttp = new XMLHttpRequest();
            } else if ("undefined" != typeof XDomainRequest) {
                me.xmlhttp = new XDomainRequest();
            } else {
                me.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        send(callback: any): void {
            var me = this;
            me.options.url || (me.options.url = "http://upload.qiniu.com/putb64/-1");
            me.xmlhttp.onreadystatechange = function() {
                if (me.xmlhttp.readyState == 4) {
                    if (me.options.type) {
                        callback();
                    } else {
                        callback(JSON.parse(me.xmlhttp.responseText.replace(/'/g, '"')));
                    }
                }
            };
            me.xmlhttp.open("POST", me.options.url, true);
            me.xmlhttp.withCredentials = false;
            if ("setRequestHeader" in me.xmlhttp) {
                if (me.options.type) {
                    me.xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
                } else {
                    me.xmlhttp.setRequestHeader("Content-type", "application/octet-stream");
                    me.xmlhttp.setRequestHeader('Authorization', "UpToken " + me.options.token);
                }
            }

            me.xmlhttp.send(me.options.type ? "appKey=" + me.options.appKey + "&deviceId=" + me.options.deviceId + "&timestamp=" + me.options.timestamp + "&deviceInfo=" + me.options.deviceInfo + "&privateInfo=" + JSON.stringify(me.options.privateInfo) : me.options.base64);
        }
    }

    export class RongUtil {
        static noop(){}
        static isEmpty(obj: any): boolean {
            var empty: boolean = true;
            for (var key in obj) {
                empty = false;
                break;
            }
            return empty;
        }
        static MD5(str: string, key?:string, raw?:string){
            return md5(str, key, raw);
        }
        static isObject(obj: any){
            return Object.prototype.toString.call(obj) == '[object Object]';
        }
        static isArray(array: any){
            return Object.prototype.toString.call(array) == '[object Array]';
        }
        static isFunction(fun: any){
            return Object.prototype.toString.call(fun) == '[object Function]';
        };
        static stringFormat(tmpl:string, vals:any){
            for (var i = 0, len = vals.length; i < len; i++) {
                var val = vals[i], reg = new RegExp("\\{" + (i) + "\\}", "g");
                tmpl = tmpl.replace(reg, val);
            }
            return tmpl;
        }
        static forEach(obj:any, callback:Function){
            callback = callback || RongUtil.noop;
            var loopObj = function(){
                for(var key in obj){
                    callback(obj[key], key);
                }
            };
            var loopArr = function(){
                for(var i = 0, len = obj.length; i < len; i++){
                    callback(obj[i], i);
                }
            };
            if (RongUtil.isObject(obj)) {
                loopObj();
            }
            if (RongUtil.isArray(obj)) {
                loopArr();
            }
        }
        static extends(source:any, target:any, callback?:any, force?: boolean){
            RongUtil.forEach(source, function(val:any, key:string){
                var hasProto = (key in target);
                if (force && hasProto) {
                    target[key] = val;
                }
                if (!hasProto) {
                   target[key] = val;
                }
            });
            return target;
        }
        static createXHR(){
            var item:{[key: string]: any} = {
                XMLHttpRequest: function(){
                    return new XMLHttpRequest();
                },
                XDomainRequest: function(){
                    return new XDomainRequest();
                },
                ActiveXObject: function(){
                    return new ActiveXObject('Microsoft.XMLHTTP');
                }
            };
            var isXHR = (typeof XMLHttpRequest == 'function');
            var isXDR = (typeof XDomainRequest == 'function');
            var key = isXHR ? 'XMLHttpRequest' : isXDR ? 'XDomainRequest' : 'ActiveXObject'
            return item[key]();
        }
        static request(opts: any){
            var url = opts.url;
            var success = opts.success;
            var error = opts.error;
            var method = opts.method || 'GET';
            var xhr = RongUtil.createXHR();
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        success();
                    }else{
                        error();
                    }
                }
            };
            xhr.open(method, url, true);
            xhr.send(null);
        }
        static formatProtoclPath(config: any){
            var path = config.path;
            var protocol = config.protocol;
            var tmpl = config.tmpl || '{0}{1}';
            var sub = config.sub;
            
            var flag = '://';
            var index = path.indexOf(flag);
            var hasProtocol = (index > -1);
            
            if (hasProtocol) {
                index += flag.length;
                path = path.substring(index);
            }
            if (sub) {
                index = path.indexOf('/');
                var hasPath = (index > -1);
                if (hasPath) {
                    path = path.substr(0, index);
                }
            }
            return RongUtil.stringFormat(tmpl, [protocol, path]);
        };

        static supportLocalStorage(): boolean {
            var support = false;
            if(typeof localStorage == 'object'){
                try {
                    var key = 'RC_TMP_KEY', value = 'RC_TMP_VAL';
                    localStorage.setItem(key, value);
                    var localVal = localStorage.getItem(key);
                    if(localVal == value){
                        support = true;
                    }
                } catch (err) {
                    console.log('localStorage is disabled.');
                }
                
            }
            return support;
        }

    }
}
