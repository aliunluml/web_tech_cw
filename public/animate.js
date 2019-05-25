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
    contentTextarea.addEventListener('input', function () {
      autoExpand(contentTextarea);
    }, false);
  }

});
