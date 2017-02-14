/**
 * Created by Administrator on 17-2-11.
 */
//颜色选择器，用到了Classycolor插件
$(function(){
     var bgc = $('.colorpicker').ClassyColor({
         color: '#e5e5e5',
         colorSpace: 'rgb',
         displayColor: 'hex',
    })
    $(".colorpicker").on('newcolor',function(){
        console.log($(".colorpicker .output-wrapper").html());
        var selectColor = $(".colorpicker .output-wrapper").html();
        //改变背景色
        $("body").css({
            'background-color':selectColor
        });
    })
    //texcolor
    $('.colorpicker1').ClassyColor({
        color: '#e5e5e5',
        colorSpace: 'rgb',
        displayColor: 'hex',
    });
    $(".colorpicker1").on('newcolor',function(){
        var selectColor = $(".colorpicker1 .output-wrapper").html();
        $(".main").css({'color':selectColor});
        $('.footer li').css({'background':selectColor});
        $(".aside .folders").css({
            'background':selectColor,
            'color':selectColor
        })
        $(".otherinner div").css({'background':selectColor});
        $(".footer>div").css({'border-color':selectColor});
    })

});
