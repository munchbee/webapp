$(function() {
    $('form').submit(function(){

    	var data = [];
		$("#sortable li h3").each(function() { data.push($(this).text()) });

    	$('<input type="hidden" name="data" />').attr('value', data).appendTo(this);
	});
  });