define(function () {
    function zy_define() {
        this.cfg = {
            min_width:300,
            width:500,
            height:300,
            alert_head:'删除',
            alert_body:'确定要删除吗？',
            has_cancel:'1',//表示是否有取消按钮
            content_handle_sure:'<input type="button" value="确定" class="alert_btn yes">',
            content_handle_cancel:'<input type="button" value="取消" class="alert_btn no">',
        };
    };
    zy_define.prototype = {
        zy_alert:function (cfg) {
            this.cfg.has_cancel = cfg.has_cancel;
            var new_cfg = extend(cfg,this.cfg);
            var div = document.createElement('div');
            var div_content_head = '<div class="alert_content_head">'+new_cfg.alert_head+'</div>';
            var div_content_body = '<div class="alert_content_body">'+new_cfg.alert_body+'</div>';
            var div_close = '<div class="alert-close"></div>';
            var div_bg = '<div class="alert_bg"></div>';
            var top = (window.innerHeight - new_cfg.height)/3;
            var left= (window.innerWidth- new_cfg.width)/2;
            var s_width = document.body.offsetWidth;
            var s_height = document.body.offsetHeight;
            div.setAttribute('class','alert-attr');
            div.style.cssText = 'position:fixed;top:'+top+'px;left:'+left+'px;'+'min-width:'+new_cfg.min_width+'px;';
            document.body.innerHTML += div_bg;
            document.body.appendChild(div);
            div.innerHTML += div_content_head;
            div.innerHTML += div_content_body;
            div.innerHTML += new_cfg.content_handle_sure;
            if(parseInt(new_cfg.has_cancel)){
                div.innerHTML += new_cfg.content_handle_cancel;
            }
            div.innerHTML += div_close;
            this.$('.alert_bg')[0].style.cssText = 'opacity:.5;position:fixed;top:0;left:0;width:'+s_width+'px;height:'+s_height+'px;' +
                'background-color:#8b8b8b';
            /*  var that = this;
          var sure = div.getElementsByClassName('yes')[0];
            var cancel = div.getElementsByClassName('no')[0];
            var close = div.getElementsByClassName('alert_close')[0];
            sure.addEventListener('click',function () {
                // this.cfg.result = 1;
                this.parentNode.remove();
                that.$('.alert_bg')[0].remove();
                return 1;
            });
            if(parseInt(this.cfg.has_cancel)){
                cancel.addEventListener('click',function () {
                    this.cfg.result = 0;
                    that.$('.alert_bg')[0].remove();
                    this.parentNode.remove();
                });
            }
            close.addEventListener('click',function () {
                this.cfg.result = 0;
                that.$('.alert_bg')[0].remove();
                this.parentNode.remove();
            });*/
        },
        zy_handle:function (class_name) {
            var that = this;
            var div = this.$('.'+class_name)[0];
            var sure = div.getElementsByClassName('yes')[0];
            var cancel = div.getElementsByClassName('no')[0];
            var close = div.getElementsByClassName('alert_close')[0];
            sure.addEventListener('click',function () {
                this.parentNode.remove();
                that.$('.alert_bg')[0].remove();
                return true;
            });
            if(parseInt(this.cfg.has_cancel)){
                cancel.addEventListener('click',function () {
                    that.$('.alert_bg')[0].remove();
                    this.parentNode.remove();
                    return false;
                });
            }
            close.addEventListener('click',function () {
                that.$('.alert_bg')[0].remove();
                this.parentNode.remove();
                return false;
            });

        },
        $:function (ele) {
            var s = ele.substr(1);
            if(ele[0] == "#"){
                return document.getElementById(s);
            }if(ele[0] == "."){
                return document.getElementsByClassName(s);
            }else{
                return document.getElementsByTagName(ele);

            }

        },
        c: function (s) {
            console.log(s);
        },
        get_pre: function (ele) {
            var element = ele.previousSibling;
            while (element.nodeType != 1) {
                var temp = element;
                element = element.previousSibling;
                if (element == null) {
                    element = temp;
                    break;
                }
            }
            return element;
        },
        get_nxt: function (ele) {
            var element = ele.nextSibling;
            while (element.nodeType != 1) {
                var temp = element;
                element = element.nextSibling;
                if (element == null) {
                    element = temp;
                    break;
                }
            }
            return element;
        },
    };
    function extend(target,source) {
        for(var s in source){
          if(!target.hasOwnProperty(s)){
                target[s] = source[s];
            }
        }
        return target;
    };
    return{
        zy_define:zy_define,
        extend:extend,
    };
  /*  var alert_zy = new zy_define();
    alert_zy.zy_alert({has_cancel:'1'});
    alert_zy.zy_handle('alert-attr');*/
});
