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

  function autoExpand(field){

  	// Reset field height
  	field.style.height = 'inherit';

  	// Get the computed styles for the element
  	var computed = window.getComputedStyle(field);

  	// Calculate the height
  	var height = parseInt(computed.getPropertyValue('border-top-width'), 10)
  	             + parseInt(computed.getPropertyValue('padding-top'), 10)
  	             + field.scrollHeight
  	             + parseInt(computed.getPropertyValue('padding-bottom'), 10)
  	             + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

  	field.style.height = height + 'px';

  }

  var contentTextarea = document.getElementById('contentTextarea');
  if (contentTextarea) {
    contentTextarea.oninput = function () {
      autoExpand(contentTextarea);
    };
  }

  var terminatebtn = document.getElementById('terminate');
  if (terminatebtn) {
    terminatebtn.onclick = function(){
      if (window.confirm("Terminate My Account:\nIf you would like to permanently terminate you account, please confirm by clicking OK.  Once your account is terminated, you would not be able to reactivate it or retrieve any related content.")) {
        var url = "/user/" + this.value;
        var request = new XMLHttpRequest();
        request.open('DELETE', url);
        request.responseType = 'json';

        request.onload = function() {
          alert(request.response.message);
          window.location.href = '/';
        };

        request.send();
      }
    };
  }

  var deletebtns = document.querySelectorAll("article > .delete_button");
  if (deletebtns) {
    deletebtns.forEach(function(deletebtn){
      deletebtn.onclick = function(){
        var article = this.parentElement;
        var li = article.parentElement;
        var ol = li.parentElement;

        var url = "/post/" + this.value;
        var request = new XMLHttpRequest();
        request.open('DELETE', url);
        request.responseType = 'json';

        request.onload = function() {
          ol.removeChild(li);
          alert(request.response.message);
        };

        request.send();
      };
    });
  }

});
