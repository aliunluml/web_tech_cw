document.addEventListener('DOMContentLoaded', () => {

  var closebtns = document.getElementsByClassName("closebtn");
  for (var i = 0; i < closebtns.length; i++) {
    closebtns[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
    };
  }
  
});
