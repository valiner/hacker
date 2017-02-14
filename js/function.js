/**
 * Created by Administrator on 17-2-9.
 */
//底部菜单的功能
$(function() {

    //改变背景
    $(".changebg").delegate("li", "click", function () {

        switch ($(this).text()) {
            case 'grad1':
                $("body").css({
                    'background-color': '#789'

                });

                break;
            case "green":
                $("body").css({
                    'background-color': '#189'
                });
                break;
            case "grad2":
                $("body").css({
                    'background-color': '#557a86'

                });
                break;
            case "bg3":
                $("body").css({
                    'background': 'url(images/' + $(this).text() + '.gif) no-repeat',
                    '-webkit-background-size': 'cover',
                    'background-size': 'cover',
                    'background-color': $("body").css("background-color"),
                    'background-attachment': 'fixed',
                    'background-attachment': 'fixed',
                    'background-position': 'center center'

                });
                break;
            default :
                //console.log($("body").css("background-color"));
                $("body").css({
                    'background': 'url(images/' + $(this).text() + '.png) no-repeat',
                    '-webkit-background-size': 'cover',
                    'background-size': 'cover',
                    'background-color': $("body").css("background-color"),
                    'background-attachment': 'fixed',
                    'background-attachment': 'fixed',
                    'background-position': 'center center'
                });


        }


    })
    //改变LOGO
    $('.changelogo').delegate("li", "click", function () {

        $(".logo").css({
            'background-image': 'url(images/logo/'+$(this).text()+'.png)'
        });
    })

   $('#fz').change(function (argument) {
       console.log($(this).val());
       $(".main").css({'font-size':$(this).val()+'px',
            'line-height': $(this).val()*2+'px'});
   });
   $('#speed').change(function (argument) {
         typeWriter.speed1 = $(this).val();
   })
   $("#changeff").change(function (argument) {

        console.log($(this).children('option:selected').val());
       $(".main").css({'font-family':$(this).children('option:selected').val()});
   })
    $("#foldercheckbox").change(function(){
        $(".aside").fadeToggle(100);
    })
    var settime = setInterval(gettime,1000);
    function gettime(){
        var time = new Date();
        $(".time span").html(time.toLocaleTimeString());
        //console.log(time.toLocaleTimeString());
    }
    $(".world").click(function(){
        $(".number img").slideToggle(1000);
        console.log("123");
    })
    $('.aside').click(function(ev){
        var ev = ev || window.event;
        ev.stopPropagation();
        var target = ev.target || ev.srcElement;
           switch (target.dataset.fun) {
               case 'help':
                   $(".helppaly").slideToggle(500);
                   break;
               case 'setting':
                   $(".footer").slideToggle(500);
                   console.log("ddd");
                   break;
               case 'map':
                   $('#map').slideToggle(500);
                   break;
               case 'other':
                   $("#other").slideToggle(500);
                   break;
           }

    });
    //展示other
    $(".dld").click(function (argument) {
       $("#dl").slideToggle(500);
       $("#other").hide();
    })
    $(".sd").click(function (argument) {
       $("#sdpaly").slideToggle(500);
       $("#other").hide();
    })
    $(".an").click(function (argument) {
       $("#anpaly").slideToggle(500);
       $("#other").hide();
    })
   $(".lo").click(function (argument) {
       $("#lopaly").slideToggle(500);
       $("#other").hide();
    })
    $(".fire").click(function (argument) {
       $("#firepaly").slideToggle(500);
       $("#other").hide();
    })

    // $('#dlimg1').click(function (argument) {
    //     console.log($(this));
    // })
    
    
    $(".dlimg1").on("click",function (argument) {
          // console.log($(this).parent());
          $(this).parent().slideUp(500);
    })

})