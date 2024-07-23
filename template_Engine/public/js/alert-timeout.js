function showAlert(duration) {
    var alertBox = document.getElementById('edit-blog-alert');
    alertBox.style.display = 'block';
    

    setTimeout(function() {
      alertBox.style.display = 'none';
    }, duration);
  }

  function addEventListenerIfExists(selector, event, callback) {
    var element = document.querySelector(selector);
    if (element) {
      element.addEventListener(event, callback);
    } else {
      console.log('Element not found: ' + selector);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    
    addEventListenerIfExists('#edit-blog-alert', 'mouseover', function() {
        showAlert(3000);
    });


    
  });