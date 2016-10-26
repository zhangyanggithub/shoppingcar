/**
 * 通过类名或者id获取元素
 * @param ele元素名，包括# 或者 .
 * @returns {*}element
 */
function $(ele) {
    var s = ele.substr(1);
    if(ele[0] == "#"){
        return document.getElementById(s);
    }if(ele[0] == "."){
        return document.getElementsByClassName(s);
    }else{
        return document.getElementsByTagName(ele);

    }
    
}
function c(s) {
    console.log(s);
}
function get_pre(ele) {
    var element = ele.previousSibling;
    while(element.nodeType == 3){
        var temp = element;
        element = element.previousSibling;
        if(element == null){
            element = temp;
            break;
        }
    }
    return element;
}
function get_nxt(ele) {
    var element = ele.nextSibling;
    while(element.nodeType == 3){
        var temp = element;
        element = element.nextSibling;
        if(element == null){
            element = temp;
            break;
        }
    }
    return element;
}
function select() {
    var select_all = $('.select-all-input');
    //获取商店list所在行
    var shop_select = $('.store-in-list');
    //商店名称下的所有input
    var shop_list_in_name = {};
    for(var i = 0; i<shop_select.length; i++){
        //商店名称
        var shop_name;
        for(var p = 0;p<shop_select[i].parentNode.childNodes.length;p++){
            if(shop_select[i].parentNode.childNodes[p].nodeType != 3){
                shop_name = shop_select[i].parentNode.childNodes[p];
                break;
            }
        }
        //商店名称下面的具体商店
        var list = [];
        for(var p = 0;p<shop_select[i].childNodes.length;p++){
            if(shop_select[i].childNodes[p].nodeType != 3){
                list.push(shop_select[i].childNodes[p]);
            }
        }
        shop_list_in_name[shop_name.id] = list;
    }
    for(var father_input in shop_list_in_name){
        var in_input = $('#'+father_input).getElementsByTagName('input')[0];
        (function (father_input) {
            //根据店铺名称选中与否选中或不选其所有子元素
            in_input.addEventListener('change',function () {
                if(this.checked){
                    selet_all(0,shop_list_in_name[father_input]);
                }else{
                    selet_all(1,shop_list_in_name[father_input]);
                }
            });

            for(var r = 0; r<shop_list_in_name[father_input].length; r++){
                /**
                 * flag[r] = true表示此checkbox被选中
                 * @type {boolean}
                 */

                (function (r) {
                    var shop_li = shop_list_in_name[father_input][r].getElementsByTagName('input')[0];
                    //监听每个商店的选中状态
                    shop_li.addEventListener('change',function () {
                        var flag = [];
                        var flag1 = [];
                        for(var s = 0; s<shop_list_in_name[father_input].length; s++){
                            flag[s] = 0;//未被选中
                            flag1[s] = 1;//选中
                        }

                        for(var w = 0; w<shop_list_in_name[father_input].length; w++){
                            var li = shop_list_in_name[father_input][w].getElementsByTagName('input')[0];
                            if(li.checked){
                                flag[w] = 1;
                            }else{
                                flag1[w] = 0;
                            }
                        }
                        var flag2 = 0;//标记全未选中
                        var flag3 = 1;//标记全选中
                        for(var f = 0; f<flag.length; f++){
                            if(flag[f]){//
                                flag2 = 1;//存在被选中元素
                            }else{
                                flag3 = 0;//存在未被选中元素
                            }
                        }
                       var parent = get_pre(shop_list_in_name[father_input][r].parentNode);
                        if(!flag2){
                            parent.getElementsByTagName('input')[0].checked = 0;
                        }else{
                            parent.getElementsByTagName('input')[0].checked = 1;
                        }
                        if(flag3){
                            parent.getElementsByTagName('input')[0].checked = 1;
                        }else{
                            parent.getElementsByTagName('input')[0].checked = 0;
                        }
                    });
                })(r);
            }


        })(father_input);

    }
    //所有input为checkbox的元素所在的div
    var all_select = $('.select_con');
    /**
     * 全选按钮
     */
    for(var f = 0; f<select_all.length;f++){
        (function (f) {
            select_all[f].getElementsByTagName('input')[0].addEventListener('change',function () {
                if(this.checked){
                    selet_all(0,all_select);
                }else{
                    selet_all(1,all_select);
                }
            });
        })(f);
    }
}
/**
 * 删除商品 未添加恢复功能
 */
function g_delete() {
    var g_list = $('.item-checkbox');
    for (var i = 0; i < g_list.length; i++) {
        (function (i) {
            var delete_btn = g_list[i].parentNode.getElementsByClassName('item-delete')[0];
            delete_btn.addEventListener('click', function () {
                //商店名称
                var p_name = get_pre(this.parentNode.parentNode.parentNode);
                //具体商品li的pre和nxt
                var p = get_pre(this.parentNode.parentNode);
                var n = get_nxt(this.parentNode.parentNode);
                if (confirm('确定要删除此商品吗?')) {
                    this.parentNode.parentNode.remove(this.parentNode);
                }
                if (p.nodeType == 3 && n.nodeType == 3) {
                    p_name.parentNode.remove(p_name);
                }
            });
        })(i);
    }
}
/**
 * 增减商品数量
 */
function number_inc_dec() {
    var g_list = $('.item-checkbox');
    for(var i = 0; i<g_list.length; i++){
        (function (i) {
            var change_box = g_list[i].parentNode.getElementsByClassName('detail-number')[0];
            var increase = change_box.getElementsByClassName('increase')[0];
            var decrease = change_box.getElementsByClassName('decrease')[0];
            var value = change_box.getElementsByTagName('input')[0];
            var per_price = parseInt(g_list[i].parentNode.getElementsByClassName('item-price')[0].innerHTML.substr(1));
            var sum_price = g_list[i].parentNode.getElementsByClassName('item-sum-price')[0];
            sum_price.innerHTML = '￥'+value.value*per_price;
            increase.addEventListener('click',function () {
                value.value = parseInt(value.value)+1;
                sum_price.innerHTML = '￥'+value.value*per_price;
            });
            decrease.addEventListener('click',function () {
                value.value = parseInt(value.value)-1;
                if(value.value <= 0){
                    value.value = 0;
                }
                sum_price.innerHTML = '￥'+value.value*per_price;
            });
        })(i);

    }

}
/**
 * 价格总额计算
 */
function show_price() {
    var g_list = $('.item-checkbox');
    var all_select = $('.select_con');
    for(var i = 0; i<all_select.length; i++){
        (function (i) {
            all_select[i].getElementsByTagName('input')[0].addEventListener('change',function () {
                var pay_ele = $('#g-pay-all').getElementsByTagName('span')[0];
                var sum = 0;
                for(var j = 0; j<g_list.length; j++){
                    if(g_list[j].getElementsByTagName('input')[0].checked){
                        var j_price = parseInt(g_list[j].parentNode.getElementsByClassName('item-sum-price')[0].innerHTML.substr(1));
                        sum += j_price;
                    }
                }
                pay_ele.innerHTML = '￥'+sum;
            })
        })(i);
    }
}
/**
 * 通过选择父元素来全选子元素
 * @param flag input父元素的标记，若为true，则将子元素的input checked也设为true；
 * @param arr 所有子元素
 */
function selet_all(flag,arr) {
    if(flag){
        for(var i=0; i<arr.length; i++){
            arr[i].getElementsByTagName('input')[0].checked = 0;
        }
    }else{
        for(var i=0; i<arr.length; i++){
            arr[i].getElementsByTagName('input')[0].checked = 1;
        }
    }


}
function g_num_show() {
    //所有可选按钮
    var all_select = $('.select_con');
    //所有商品按钮
    var g_list = $('.item-checkbox');
    for(var t = 0;t<all_select.length; t++){
        (function (t) {
            all_select[t].addEventListener('change',function () {
                var selected_sum = 0;
                for(var p = 0; p<g_list.length; p++){
                    if(g_list[p].getElementsByTagName('input').checked) {
                        //商品行对应的商品件数
                        var every_sum = parseInt(g_list[p].parentNode.getElementsByClassName('every-sum').value);
                        c(every_sum);
                        selected_sum += every_sum;
                        c(selected_sum);

                    }
                }
                var last_show = $('#g-selected').getElementsByTagName('span');
                last_show.innerHTML = selected_sum;
            })
        })(t);
    }
}
select();
show_price();
number_inc_dec();
g_delete();
g_num_show();