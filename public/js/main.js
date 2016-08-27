$(document).ready(function() {
  "use strict";

  console.log('I am being loaded');
  var dataFileButton = document.getElementById('dataFile');
  var dataFileDiv = document.getElementById('dataFileDiv');
  if (dataFileButton) {
    dataFileButton.addEventListener('change', function(){
      var realFileName = dataFileButton.value.split('\\');
      dataFileDiv.innerHTML = realFileName[realFileName.length - 1];
    });
  }

});