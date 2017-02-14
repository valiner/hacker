//隐藏所有的动画
function hideAlldiv () {
    $("#dl").slideUp(500);
    $("#sdpaly").slideUp(500);
    $("#anpaly").slideUp(500);
    $("#lopaly").slideUp(500);
    $("#firepaly").slideUp(500);
    $("#map").slideUp(500);
    $("#other").slideUp(500);
    $("#helppaly").slideUp(500);
    $("#enter").slideUp(500);
}

$(document).keyup(function(event) { 
 if(event.which == 27) { 
   hideAlldiv();
   console.log("esc");
 }
 //数字1键
  else if(event.which == 97) {
        $("#dl").slideToggle(500);
    
   }
 //数字2键
    else if(event.which == 98) {

   $("#sdpaly").slideToggle(500);
   }
 //数字3键
    else if(event.which == 99) {

   $("#anpaly").slideToggle(500);
   }
 //数字4键
    else if(event.which == 100) {

   $("#lopaly").slideToggle(500);
   }
 //数字5键
    else if(event.which == 101) {

    $("#firepaly").slideToggle(500);
   }
 //数字6键
    else if(event.which == 102) {

    $("#map").slideToggle(500);
   }
 //数字1键
    else if(event.which == 96) {

   $("#other").slideToggle(500);
   }
  //ctrl键呼出设置界面
    else if(event.which == 17) {

    $(".footer").slideToggle(500);
   }
   //shift呼出帮助界面
    else if(event.which == 16) {

     $(".helppaly").slideToggle(500);
 }
    //enter呼出 enter界面
     else if(event.which == 13) {

     $("#enter").slideDown(500);
 }

})