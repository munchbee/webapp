$(function() {
    $('form').submit(function(){
    	var data = [];
		$("#sortable li div h3").each(function() { data.push($(this).text()) });
		alert($("#sortable li div h3").first().text() + ' has been set as your first preference !');
		console.log(data);
    	$('<input type="hidden" name="data" />').attr('value', data).appendTo(this);
	});
  });