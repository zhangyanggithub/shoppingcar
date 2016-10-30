require(['my_main'],function (m) {
    var ma = {a:'a'};
    var mb = {b:'b'};
    var ca = m.extend(ma,mb);
    console.log(ca);
    var my_cfg = {width:'300',height:'200',content_head:'删除商品',content_body:'确定要删除该商品吗？'};
    new m.zy_define().zy_handle();
   /* var a = new m.zy_define();
    var my_cfg = {width:'300',height:'200',content_head:'删除商品',content_body:'确定要删除该商品吗？'};
    a.my_alert(my_cfg);*/
});
/*
require.config({
    paths: {
        "my_main": "my_main",
    },
});*/
