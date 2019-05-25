document.addEventListener('DOMContentLoaded', () => {

  var closebtns = document.getElementsByClassName("closebtn");
  for (var i = 0; i < closebtns.length; i++) {
    closebtns[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
    };
  }

  var protectedbtns = document.getElementsByClassName("protectedbtn");
  for (var i = 0; i < protectedbtns.length; i++) {
    protectedbtns[i].onclick = function(){
      this.style.borderStyle = "inset";
      window.location.href = this.dataset.href;
    };
  }

});
