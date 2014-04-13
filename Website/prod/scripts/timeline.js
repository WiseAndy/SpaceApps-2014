define(function(){
  return function() {
    $(document).ready(function(){

      $(".timeline-mission").hover(function() {
         //need the following to toggle
         $(".timeline-popout").hide();
         $(".timeline-mission").css("background","white");
         $(this).css("background","#3D9970");
         $(this).children("div").show();
      }, function() {
        clearPopups();
      });

      function clearPopups(){
        $(".timeline-popout").hide();
        $(".timeline-mission").css("background","white");
      }

      $(".timeline-popout").click(function() {
         return false;
      });
    });
  };
});
