$(function() {
    $('form').submit(function(){
    	var data = [];
		$("#sortable li div h3").each(function() { data.push($(this).text()) });
		console.log(data);
    	$('<input type="hidden" name="data" />').attr('value', data).appendTo(this);
	});
  });