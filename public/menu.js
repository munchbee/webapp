$(function() {
    $('form').submit(function(){
    	alert('in');
    	var data = [];
		$("#sortable li div h3").each(function() { console.log($(this).text());data.push($(this).text()) });
		console.log(data);
    	$('<input type="hidden" name="data" />').attr('value', data).appendTo(this);
	});
  });