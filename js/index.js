//打字机效果
var typeWriter = {
    msg: function(msg){
        return msg;
    },
    len: function(){
        return this.msg.length;
    },
    seq: 0,
    speed: 75,//打字时间(ms)
    speed1: 2,//按键一次打出多少字，此属性实现打字速度。
    type: function(){

        var _this = this;
         //console.log(_this.seq%3);
        var str = _this.msg.substring(0, _this.seq);
        //碰到<BR/>则跳过打印>
        if (str.substring(str.length-1,str.length)=='<'&&_this.msg.substr(_this.seq,1)=='b')
        {
            _this.seq = _this.msg.indexOf('>',_this.seq)+1;
             $(".main").html(_this.msg.substring(0, _this.seq)+"_");
             console.log($('.main').height());
            //当内容铺满页面时，调用 window.scrollBy();将页面向上移动。
             window.scrollBy(0,200);
        }
        //碰到&nbsp则跳过打印
        else if (str.substring(str.length-1,str.length)=='&'&&_this.msg.substr(_this.seq,1)=='n')
        {
            _this.seq = _this.msg.indexOf('p',_this.seq)+1;
        }
        else{
            //三元选择符实现光标效果
        $(".main").html(_this.msg.substring(0, _this.seq)+(this.seq & 1 ? '_' : ''));
    }
        //  seq%_this.speed1;按一下走speed1次。
        if (_this.seq%_this.speed1==0) {
            // console.log(_this.seq);
            _this.seq++;
            clearTimeout(t);
        }
        else {
            _this.seq++;
            var t = setTimeout(function(){_this.type()}, this.speed);
        }
    }
}
//唤出底部菜单
$(function () {
    $("#imgbtn").on("click",function () {
        $(".footer").slideToggle(500);
    })
    //按键即开始打字
    $(window).keyup(function(event){
        if(event.keyCode>=65&&event.keyCode<=95){
            // console.log('c');
            typeWriter.msg=data;
            //console.log($(document).height());
            typeWriter.type();
            //console.log(data.substr(20,1))
        }
    })
})

