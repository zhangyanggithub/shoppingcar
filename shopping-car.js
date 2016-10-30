require(['zy_define'],function (my_alert) {
    var shopping_car = function () {
        //商店名称下的所有input
        this.shop_list_in_name = {};
    };
    shopping_car.prototype = {
        /**
         * 选中商品后看是否选中其父子元
         */
        select: function () {
            var that = this;
            var select_all = new my_alert.zy_define().$('.select-all-input');
            //获取商店list所在行
            var shop_select = new my_alert.zy_define().$('.store-in-list');
            for (var i = 0; i < shop_select.length; i++) {
                //商店名称所在行的input元素
                var shop_name;
                for (var p = 0; p < shop_select[i].parentNode.childNodes.length; p++) {
                    if (shop_select[i].parentNode.childNodes[p].nodeType != 3) {
                        shop_name = shop_select[i].parentNode.childNodes[p];
                        break;
                    }
                }
                //商店名称下面的具体商店
                var list = [];
                for (var p = 0; p < shop_select[i].childNodes.length; p++) {
                    if (shop_select[i].childNodes[p].nodeType != 3) {
                        list.push(shop_select[i].childNodes[p]);
                    }
                }
                this.shop_list_in_name[shop_name.id] = list;
            }
            for (var father_input in this.shop_list_in_name) {
                var in_input = new my_alert.zy_define().$('#' + father_input).getElementsByTagName('input')[0];
                (function (father_input) {
                    //根据店铺名称选中与否选中或不选其所有子元素
                    in_input.addEventListener('change', function () {
                        if (this.checked) {
                            that.select_all(0, that.shop_list_in_name[father_input]);
                        } else {
                            that.select_all(1, that.shop_list_in_name[father_input]);
                        }
                    });
                    that.select_father();
                })(father_input);
            }
            //所有input为checkbox的元素所在的div
            var all_select = new my_alert.zy_define().$('.select_con');
            /**
             * 全选按钮
             */
            for (var f = 0; f < select_all.length; f++) {
                (function (f) {
                    select_all[f].getElementsByTagName('input')[0].addEventListener('change', function () {
                        if (this.checked) {
                            that.select_all(0, all_select);
                        } else {
                            that.select_all(1, all_select);
                        }
                    });
                })(f);
            }
            /**
             * 若商品被一一选中，则选中两个全选input
             */
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var i = 0; i < all_select.length; i++) {
                (function (i) {
                    all_select[i].getElementsByTagName('input')[0].addEventListener('change', function () {
                        var sum = 0;
                        for (var p = 0; p < g_list.length; p++) {
                            if (g_list[p].getElementsByTagName('input')[0].checked) {
                                sum++;
                            }
                        }
                        if (sum == g_list.length) {
                            for (var t = 0; t < select_all.length; t++) {
                                select_all[t].getElementsByTagName('input')[0].checked = 1;
                            }
                        } else {
                            for (var t = 0; t < select_all.length; t++) {
                                select_all[t].getElementsByTagName('input')[0].checked = 0;
                            }
                        }
                    });
                })(i);
            }
        },
        /**
         * 通过全选按钮选择所有商品
         */
        select_all: function (flag, arr) {
            if (flag) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].getElementsByTagName('input')[0].checked = 0;
                }
            } else {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].getElementsByTagName('input')[0].checked = 1;
                }
            }
        },
        select_father: function () {
            var that = this;
            var a = new my_alert.zy_define();
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var i = 0; i < g_list.length; i++) {
                (function (i) {
                    g_list[i].getElementsByTagName('input')[0].addEventListener('change', function () {
                        a.c('ing');
                        that.select_father_detail(a.get_pre(a.get_pre(g_list[i].parentNode.parentNode)));
                    });
                })(i);
            }
        },
        /**
        *
        * @param lead 包含商店name的父元素的父元素
         */
        select_father_detail: function (lead) {
            var a = new my_alert.zy_define();
            var all_select = new my_alert.zy_define().$('.select_con');
            var sum = 0;
            var li = a.get_nxt(a.get_nxt(lead)).childNodes;
            var length = 0;
            for (var i = 0; i < li.length; i++) {
                if (li[i].nodeType == 1) {
                    length++;
                    if (li[i].getElementsByClassName('out-input')[0].getElementsByTagName('input')[0].checked) {
                        sum++;
                    }
                }
            }
            if (sum == length) {
                lead.getElementsByTagName('input')[0].checked = 1;
            } else {
                lead.getElementsByTagName('input')[0].checked = 0;
            }
            this.change_hook_bg(all_select);
        },
        /**
         * 删除商品
         */
        g_delete: function () {
            var that = this;
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var i = 0; i < g_list.length; i++) {
                (function (i) {
                    var delete_btn = g_list[i].parentNode.getElementsByClassName('item-delete')[0];
                    delete_btn.addEventListener('click', function () {
                        that.delete_detail(this.parentNode.parentNode);
                    });
                })(i);
            }
        },
        /**
         * 具体删除步骤
         * @param ele 商品所在的li
         */
        delete_detail: function (ele) {
            var a = new my_alert.zy_define();
            var ul = ele.parentNode;
            //具体商品li的pre和nxt
            var p = a.get_pre(ele);
            var n = a.get_nxt(ele);
            if (confirm('确定要删除此商品吗?')) {
                ele.remove(ele);
            }
            if (p.nodeType == 3 && n.nodeType == 3) {
                ul.parentNode.remove();
            }
        },
        /**
         * 监听所有checkbox变化，改变所选商品总数和总额，并改变input背景（红色对号）
         */
        all_check: function () {
            var that = this;
            var all_select = new my_alert.zy_define().$('.select_con');
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var s = 0; s < all_select.length; s++) {
                (function (s) {
                    all_select[s].getElementsByTagName('input')[0].addEventListener('change', function () {
                        that.change_hook_bg(all_select);
                        that.search_number(g_list);
                        that.calculate_all_pay(g_list);
                    });
                })(s);
            }
        },
        /**
         * 改变input背景（红色对号）
         * @param arr input元素
         */
        change_hook_bg: function (arr) {
            for (var p = 0; p < arr.length; p++) {
                var tmp = arr[p].getElementsByTagName('input')[0];

                if (tmp.checked) {
                    arr[p].getElementsByClassName('out-input')[0].style.cssText = 'background: url(images/red_right.png) no-repeat -4px;';
                } else {
                    arr[p].getElementsByClassName('out-input')[0].style.cssText = 'background: none';
                }
            }
        },
        /**
         * 提交按钮处理
         */
        submit_bg: function () {
            var submit = new my_alert.zy_define().$('#last-pay');
            var pay_all = new my_alert.zy_define().$('#g-pay-all').getElementsByTagName('span')[0];
            var all_select = new my_alert.zy_define().$('.select_con');
            for (var i = 0; i < all_select.length; i++) {
                (function (i) {
                    all_select[i].getElementsByTagName('input')[0].addEventListener('change', function () {
                        if (pay_all.innerHTML.substr(1) == "0") {
                            submit.style.backgroundColor = '#B0B0B0';
                        } else {
                            submit.style.backgroundColor = '#f40';
                        }
                    })
                })(i);
            }
            submit.addEventListener('mouseover', function () {
                if (pay_all.innerHTML.substr(1) == "0") {
                    submit.style.backgroundColor = '#B0B0B0';
                    submit.style.cssText = "cursor:not-allowed;"
                } else {
                    submit.style.cssText = "cursor:pointer;"
                    submit.style.backgroundColor = '#f40';
                }

            })
        },
        /**
         * 点击加减号增减所选商品
         */
        number_inc_dec: function () {
            var that = this;
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var i = 0; i < g_list.length; i++) {
                (function (i) {
                    var change_box = g_list[i].parentNode.getElementsByClassName('detail-number')[0];
                    var increase = change_box.getElementsByClassName('increase')[0];
                    var decrease = change_box.getElementsByClassName('decrease')[0];
                    var value = change_box.getElementsByTagName('input')[0];
                    var per_price = parseInt(g_list[i].parentNode.getElementsByClassName('item-price')[0].innerHTML.substr(1));
                    var sum_price = g_list[i].parentNode.getElementsByClassName('item-sum-price')[0];
                    sum_price.innerHTML = '￥' + value.value * per_price;
                    increase.addEventListener('click', function () {
                        value.value = parseInt(value.value) + 1;
                        sum_price.innerHTML = '￥' + value.value * per_price;
                        that.search_number(g_list);
                        that.calculate_all_pay(g_list);
                    });
                    decrease.addEventListener('click', function () {
                        value.value = parseInt(value.value) - 1;
                        if (value.value <= 0) {
                            value.value = 0;
                        }
                        sum_price.innerHTML = '￥' + value.value * per_price;
                        that.search_number(g_list);
                        that.calculate_all_pay(g_list);
                    });
                })(i);
            }
        },
        /**
         * 计算总额
         */
        calculate_all_pay: function (arr) {
            var that = this;
            var pay_ele = new my_alert.zy_define().$('#g-pay-all').getElementsByTagName('span')[0];
            var sum = 0;
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].getElementsByTagName('input')[0].checked) {
                    // console.log(j);
                    // var number = parseInt(arr[j].parentNode.getElementsByTagName('input')[1].value);
                    that.bg_change(arr[j].parentNode, '#FFF8E1');
                    var j_price = parseInt(arr[j].parentNode.getElementsByClassName('item-sum-price')[0].innerHTML.substr(1));
                    // console.log(j_price);
                    sum += j_price;
                } else {
                    that.bg_change(arr[j].parentNode, '#FCFCFC');
                }
            }
            pay_ele.innerHTML = '￥' + sum;
        },
        /**
         * 所选商品总数
         */
        search_number: function (arr) {
            var selected_sum = 0;
            for (var p = 0; p < arr.length; p++) {
                var tmp = arr[p].getElementsByTagName('input')[0];
                if (tmp.checked) {
                    tmp.style.cssText = 'background:url("images/red_right.png") no-repeat';
                    this.bg_change(arr[p].parentNode, '#FFF8E1');
                    //商品行对应的商品件数
                    var every_sum = parseInt(arr[p].parentNode.getElementsByClassName('every-sum')[0].value);
                    selected_sum += every_sum;
                } else {
                    this.bg_change(arr[p].parentNode, '#FCFCFC');
                }
            }
            var last_show = new my_alert.zy_define().$('#g-selected').getElementsByTagName('span')[0];
            last_show.innerHTML = selected_sum;
        },
        /**
         * 改变ele的背景颜色为color
         */
        bg_change: function (ele, color) {
            ele.style.backgroundColor = color;
        },
        /**
         * 删除图片进而取消对商品的选择
         */
        cancel_choose: function () {
            var that = this;
            var a = new my_alert.zy_define();
            var all_select = new my_alert.zy_define().$('.select_con');
            var pay_all = new my_alert.zy_define().$('#g-pay-all').getElementsByTagName('span')[0];
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            for (var j = 0; j < all_select.length; j++) {
                (function (j) {
                    all_select[j].addEventListener('change', function () {
                        if (pay_all.innerHTML != '￥0') {
                            var pic_delete = new my_alert.zy_define().$('.pic-delete');
                            for (var i = 0; i < pic_delete.length; i++) {
                                (function (i) {
                                    pic_delete[i].addEventListener('click', function () {
                                        var index = this.parentNode.getAttribute('index');
                                        var li_out = new my_alert.zy_define().$('#' + index).getElementsByClassName('out-input')[0];
                                        var li = li_out.getElementsByTagName('input')[0];
                                        li.checked = 0;
                                        that.change_hook_bg(all_select);
                                        that.search_number(g_list);
                                        that. calculate_all_pay(g_list);
                                        this.parentNode.parentNode.removeChild(this.parentNode);
                                        that.select_father_detail(a.get_pre(a.get_pre(a.$('#' + index).parentNode)));
                                    })
                                })(i);
                            }
                        }
                    });
                })(j);
            }
        },
        /**
         * 添加所选商品的图片
         */
        add_pic: function () {
            var all_select = new my_alert.zy_define().$('.select_con');
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            var show_pic = new my_alert.zy_define().$('#show-pic');
            var show_pic_tmp = '<div class="pic-item" index="{sequence}"><img src="{src}"><div class="pic-delete">取消选择</div></div>';
            var left_icon = '<div id="scroll-left-icon" class="scroll-icon"></div>';
            var right_icon = '<div id="scroll-right-icon"  class="scroll-icon"></div>';
            var close_icon = '<div id="close-icon"></div>';
            for (var j = 0; j < all_select.length; j++) {
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
                        _pic_html.push(close_icon);
                        show_pic.innerHTML = _pic_html.join('');
                        var pic_item = new my_alert.zy_define().$('.pic-item');
                        for (var t = 0; t < pic_item.length; t++) {
                            pic_item[t].style.left = 80 + t * 104 + 'px';
                        }
                    });
                })(j);
            }
        },
        /**
         * 展示所选商品的图片
         */
        show_pic: function () {
            var pay_all = new my_alert.zy_define().$('#g-pay-all').getElementsByTagName('span')[0];
            var show_btn = new my_alert.zy_define().$('#show-selected');
            var triangle = new my_alert.zy_define().$('#little-triangle');
            var show_pic = new my_alert.zy_define().$('#show-pic');
            var show_selected = new my_alert.zy_define().$('#show-selected').getElementsByTagName('a')[0];
            var index = 0;
            var close_icon;
            show_btn.addEventListener('click', function () {
                close_icon = new my_alert.zy_define().$('#close-icon');
                close_icon.addEventListener('click', function () {
                    hide_pic_fun(show_pic, show_selected);
                });
                if (pay_all.innerHTML != '￥0') {
                    index++;
                    if (index % 2) {
                        show_pic_fun(show_pic, show_selected);
                    } else {
                        hide_pic_fun(show_pic, show_selected);
                    }
                }
            });
            window.onscroll = function () {
                hide_pic_fun(show_pic, show_selected);
            };
            function show_pic_fun(show_pic, show_selected) {
                show_pic.style.display = triangle.style.display = 'block';
                show_selected.style.cssText = 'background: url("images/all_bg.png") no-repeat -60px -53px;'
            }

            function hide_pic_fun(show_pic, show_selected) {
                show_pic.style.display = triangle.style.display = 'none';
                show_selected.style.cssText = 'background: url("images/all_bg.png") no-repeat -60px -23px;'
            }
        },
        /**
         * 一键删除所选商品
         */
        delete_more: function () {
            var that = this;
            var delete_more = new my_alert.zy_define().$('#delete-more');
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            var pay_all = new my_alert.zy_define().$('#g-pay-all').getElementsByTagName('span')[0];
            var invalided = new my_alert.zy_define().$('#invalided');
            var new_g_list = [];
            for (var t = 0; t < g_list.length; t++) {
                new_g_list[t] = g_list[t];
            }
            /*    invalided.getElementsByTagName('a')[0].addEventListener('click',function () {
             if (confirm('确定要删除这些商品吗?')) {
             for(var i = 0; i<new_g_list.length; i++){
             if(new_g_list[i].parentNode.getAttribute('invalid')){
             var shop_name = new_g_list[i].parentNode.parentNode;
             new_g_list[i].parentNode.remove();
             if(shop_name.children.length == 0){
             shop_name.parentNode.remove();
             }
             }
             }
             }

             });*/
            delete_more.getElementsByTagName('a')[0].addEventListener('click', function () {
                if (pay_all.innerHTML != '￥0') {
                    if (confirm('确定要删除这些商品吗?')) {
                        for (var i = 0; i < new_g_list.length; i++) {
                            if (new_g_list[i].getElementsByTagName('input')[0].checked) {
                                var shop_name = new_g_list[i].parentNode.parentNode;
                                new_g_list[i].parentNode.remove();
                                if (shop_name.children.length == 0) {
                                    shop_name.parentNode.remove();
                                }
                            }
                        }
                        that.search_number(g_list);
                        that.calculate_all_pay(g_list);
                    }
                } else {
                    alert('请选择商品');
                }

            });
        },
        /**
         * 直接输入商品数量
         */
        input_number:function () {
            var that = this;
            var g_list = new my_alert.zy_define().$('.item-checkbox');
            var a = new my_alert.zy_define();
            var input_by_self = a.$('.every-sum');
            for(var i = 0;i<input_by_self.length; i++){
                (function (i) {
                    input_by_self[i].addEventListener('change',function () {
                        a.c(a.get_pre(this.parentNode.parentNode));
                        var per = parseInt(a.get_pre(this.parentNode.parentNode).innerHTML.substr(1));
                        a.get_nxt(this.parentNode.parentNode).innerHTML = '￥' + parseInt(this.value) * per;
                        that.search_number(g_list);
                        that.calculate_all_pay(g_list);
                    });
                })(i);
            }
        },
    };
        var shop = new shopping_car();
        shop.select();
        shop.number_inc_dec();
        shop.g_delete();
        shop.all_check();
        shop.submit_bg();
        shop.add_pic();
        shop.show_pic();
        shop.cancel_choose();
        shop.delete_more();
        shop.input_number();

});

