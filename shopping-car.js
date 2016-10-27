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
/**
 * 选中商品后看是否选中其父子元
 */
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
                        var parent = get_pre(get_pre(shop_list_in_name[father_input][r].parentNode));
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
    /**
     * 若商品被一一选中，则选中两个全选input
     */
    var g_list = $('.item-checkbox');
    for (var i = 0; i < all_select.length; i++) {
        (function (i) {
            all_select[i].getElementsByTagName('input')[0].addEventListener('change',function () {
                var sum = 0;
                for (var p = 0; p < g_list.length; p++) {
                    if(g_list[p].getElementsByTagName('input')[0].checked){
                        sum++;
                    }
                }
                if(sum == g_list.length){
                    for(var t = 0; t<select_all.length; t++){
                        select_all[t].getElementsByTagName('input')[0].checked = 1;
                    }
                }else{
                    for(var t = 0; t<select_all.length; t++){
                        select_all[t].getElementsByTagName('input')[0].checked = 0;
                    }
                }
            });
        })(i);
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
                delete_detail(this.parentNode);
            });
        })(i);
    }
}
/**
 * 具体删除步骤
 * @param ele 要删除的行内的“删除”所在的div的父元素
 */
function delete_detail(ele){
//商店名称
    var p_name = get_pre(ele.parentNode.parentNode);
    //具体商品li的pre和nxt
    var p = get_pre(ele.parentNode);
    var n = get_nxt(ele.parentNode);
    if (confirm('确定要删除此商品吗?')) {
        ele.parentNode.remove(ele);
    }
    if (p.nodeType == 3 && n.nodeType == 3) {
        p_name.parentNode.remove(p_name);
    }
}
/**
 * 监听所有checkbox，计算总pay和总number
 */
function all_check() {
    var all_select = $('.select_con');
    var g_list = $('.item-checkbox');
    for(var s = 0; s<all_select.length;s++){
        (function (s) {
            all_select[s].getElementsByTagName('input')[0].addEventListener('change',function () {
                change_hook_bg(all_select);
                search_number(g_list);
                calculat_all_pay(g_list);
            });
        })(s);
    }
}
/**
 * 改变input的背景图片
 * @param arr所有商品所在的list
 */
function change_hook_bg(arr) {
    for(var p = 0; p<arr.length; p++){
        var tmp = arr[p].getElementsByTagName('input')[0];

        if(tmp.checked) {
            arr[p].getElementsByClassName('out-input')[0].style.cssText = 'background: url(images/red_right.png) no-repeat -4px;';
        }else{
            arr[p].getElementsByClassName('out-input')[0].style.cssText = 'background: none';
        }
    }
}
function submit_bg() {
    var submit = $('#last-pay');
    var pay_all = $('#g-pay-all').getElementsByTagName('span')[0];
    var all_select = $('.select_con');
    for(var i = 0; i<all_select.length; i++){
        (function (i) {
            all_select[i].getElementsByTagName('input')[0].addEventListener('change',function () {
                if(pay_all.innerHTML.substr(1) == "0"){
                    submit.style.backgroundColor = '#B0B0B0';
                }else{
                    submit.style.backgroundColor = '#f40';
                }
            })
        })(i);
    }
    submit.addEventListener('mouseover',function () {
        if(pay_all.innerHTML.substr(1) == "0"){
            submit.style.backgroundColor = '#B0B0B0';
            submit.style.cssText = "cursor:not-allowed;"
        }else{
            submit.style.cssText = "cursor:pointer;"
            submit.style.backgroundColor = '#f40';
        }

    })
}
/**
 * 增减商品数量，同时计算最终所选商品数量之和search_number,计算应付总额calculat_all_pay
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
                search_number(g_list);
                calculat_all_pay(g_list);
            });
            decrease.addEventListener('click',function () {
                value.value = parseInt(value.value)-1;
                if(value.value <= 0){
                    value.value = 0;
                }
                sum_price.innerHTML = '￥'+value.value*per_price;
                search_number(g_list);
                calculat_all_pay(g_list);
            });
        })(i);
    }
}
function calculat_all_pay(arr) {
    var pay_ele = $('#g-pay-all').getElementsByTagName('span')[0];
    var sum = 0;
    for(var j = 0; j<arr.length; j++){
        if(arr[j].getElementsByTagName('input')[0].checked){
            bg_change(arr[j].parentNode,'#FFF8E1');
            var j_price = parseInt(arr[j].parentNode.getElementsByClassName('item-sum-price')[0].innerHTML.substr(1));
            sum += j_price;
        }else{
            bg_change(arr[j].parentNode,'#FCFCFC');
        }
    }
    pay_ele.innerHTML = '￥'+sum;
}
/**
 * 价格总额计算，这里监听每个商品是否被选中计算总价格和所有商品选到的总数
 */
function show_price() {
    var g_list = $('.item-checkbox');
    var all_select = $('.select_con');
    for(var i = 0; i<all_select.length; i++){
        (function (i) {
            all_select[i].getElementsByTagName('input')[0].addEventListener('change',function () {
                calculat_all_pay(g_list);
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
/**
 * 统计所有商品所在的li中商品所选数量之和
 * @param arr所有商品所在的li
 */
function search_number(arr) {
    var selected_sum = 0;
    for(var p = 0; p<arr.length; p++){
        var tmp = arr[p].getElementsByTagName('input')[0];
        if(tmp.checked) {
           tmp.style.cssText = 'background:url("images/red_right.png") no-repeat';
            bg_change(arr[p].parentNode,'#FFF8E1');
            //商品行对应的商品件数
            var every_sum = parseInt(arr[p].parentNode.getElementsByClassName('every-sum')[0].value);
            selected_sum += every_sum;
        }else{
            bg_change(arr[p].parentNode,'#FCFCFC');
        }
    }
    var last_show = $('#g-selected').getElementsByTagName('span')[0];
    last_show.innerHTML = selected_sum;
}
function bg_change(ele,color){
    ele.style.backgroundColor = color;
}
/**
 * 删除图片进而取消对商品的选择
 * @param ele
 */
function cancel_choose() {
    var all_select = $('.select_con');
    var pay_all = $('#g-pay-all').getElementsByTagName('span')[0];
    for(var j = 0; j<all_select.length; j++){
        (function (j) {
            all_select[j].addEventListener('change',function () {
                if(pay_all.innerHTML != '￥0'){
                    var pic_delete = $('.pic-delete');
                    for(var i = 0; i<pic_delete.length; i++){
                        (function (i) {
                            pic_delete[i].addEventListener('click',function () {
                                var index = this.parentNode.getAttribute('index');
                                var li_out = $('#'+index).getElementsByClassName('out-input')[0];
                                var li = li_out.getElementsByTagName('input')[0];
                                li.checked = 0;
                                change_hook_bg(all_select);
                                c(this.parentNode.parentNode);
                                c(this.parentNode);
                                this.parentNode.parentNode.removeChild(this.parentNode);
                            })
                        })(i);
                    }
                }
            });
        })(j);
    }
}
/**
 * 商品被选中后将图片添加到pay中的加号内
 */
function add_pic() {
    var all_select = $('.select_con');
    var g_list = $('.item-checkbox');
    var show_pic = $('#show-pic');
    var show_pic_tmp = '<div class="pic-item" index="{sequence}"><img src="{src}"><div class="pic-delete">取消选择</div></div>';
    var left_icon = '<div id="scroll_left_icon" class="scroll_icon"></div>';
    var right_icon = '<div id="scroll_right_icon"  class="scroll_icon"></div>';
    for(var j = 0; j<all_select.length; j++) {
        (function (j) {
            all_select[j].addEventListener('change', function () {
                var _pic_html = [];
                _pic_html.push(left_icon);
                for (var s = 0; s < g_list.length; s++) {
                    if (g_list[s].getElementsByTagName('input')[0].checked) {
                        var li_id = g_list[s].parentNode.id;
                        var image = g_list[s].parentNode.getElementsByClassName('item-show')[0].getElementsByTagName('img')[0];
                        var new_tmp = show_pic_tmp
                            .replace(/\{sequence\}/g, li_id)
                            .replace(/\{src\}/g, image.src);
                        _pic_html.push(new_tmp);
                    }
                }
                _pic_html.push(right_icon);
                show_pic.innerHTML = _pic_html.join('');
                var pic_item = $('.pic-item');
                for (var t = 0; t < pic_item.length; t++) {
                    pic_item[t].style.left = 80 + t * 104 + 'px';
                }
                c('length:'+$('.pic-item'));
                c('length:'+$('.pic-item').length);
            });
        })(j);
    }
}
/**
 * 点击加号后展示其图片
 */
function show_pic() {
    var pay_all = $('#g-pay-all').getElementsByTagName('span')[0];
    var show_btn = $('#show-selected');
    var triangle = $('#little-triangle');
    var show_pic = $('#show-pic');
    show_btn.addEventListener('click',function () {
        if(pay_all.innerHTML != '￥0'){
            show_pic.style.display = triangle.style.display ='block';
        }

    });


}
window.onload = function () {
    select();
    show_price();
    number_inc_dec();
    g_delete();
    all_check();
    submit_bg();
    add_pic();
    show_pic();
    cancel_choose();
};
