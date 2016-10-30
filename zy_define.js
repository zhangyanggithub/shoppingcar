define(function () {
    function zy_define() {
        this.cfg = {
            min_width:300,
            width:500,
            height:300,
            content_head:'删除',
            content_body:'确定要删除吗？',
            has_cancel:'1',//表示是否有取消按钮
            content_handle_sure:'<input type="button" value="确定" class="alert_btn yes">',
            content_handle_cancel:'<input type="button" value="取消" class="alert_btn no">',
        };
    };
    zy_define.prototype = {
        zy_alert:function (cfg) {
            var new_cfg = extend(cfg,this.cfg);
            var div = document.createElement('div');
            var div_content_head = '<div class="alert_content_head">'+new_cfg.content_head+'</div>';
            var div_content_body = '<div class="alert_content_body">'+new_cfg.content_body+'</div>';
            var div_close = '<div class="alert_close"></div>';
            var top = (window.innerHeight - new_cfg.height)/3;
            var left= (window.innerWidth- new_cfg.width)/2;
            div.setAttribute('class','alert-attr');
            div.style.cssText = 'position:fixed;top:'+top+'px;left:'+left+'px;'+'min-width:'+new_cfg.min_width+'px;';
            document.body.appendChild(div);
            div.innerHTML += div_content_head;
            div.innerHTML += div_content_body;
            div.innerHTML += new_cfg.content_handle_sure;
            if(parseInt(new_cfg.has_cancel)){
                div.innerHTML += new_cfg.content_handle_cancel;
            }
            div.innerHTML += div_close;
            document.body.style.backgroundColor = '#666';
        },
        zy_handle:function (class_name) {
            var my_cfg = {width:'300',height:'200',content_head:'删除商品',content_body:'确定要删除该商品吗？'};
            this.zy_alert(my_cfg);
            var div = this.$('.'+class_name)[0];
            var sure = div.getElementsByClassName('yes')[0];
            var cancel = div.getElementsByClassName('no')[0];
            var close = div.getElementsByClassName('alert_close')[0];
            sure.addEventListener('click',function () {
                this.parentNode.remove();
                document.body.style.backgroundColor = '#FFF';
                return true;
            });
            cancel.addEventListener('click',function () {
                document.body.style.backgroundColor = '#FFF';
                this.parentNode.remove();
                return false;
            });
            close.addEventListener('click',function () {
                document.body.style.backgroundColor = '#FFF';
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
  /*  return{
        zy_define:zy_define,
        extend:extend,
    };*/
    var alert_zy = new zy_define();
    alert_zy.zy_alert({has_cancel:'1'});
});
