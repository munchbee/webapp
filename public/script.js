$(function() {
$('.reorder-up').click(function(){
	var $current = $(this).closest('li');
	var $previous = $current.prev('li');
	if($previous.length !== 0){
		$current.insertBefore($previous);
	}
	return false;
});

$('.reorder-down').click(function(){
	var $current = $(this).closest('li');
	var $next = $current.next('li');
	if($next.length !== 0){
		$current.insertAfter($next);
	}
	return false;
});
/*
$( "#sortable" ).sortable();
$( "#sortable" ).disableSelection();
*/
});