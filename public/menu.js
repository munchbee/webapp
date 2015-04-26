$(function () {
	$('form').submit(function(){
    	var data = [];
		$("#order li div h3").each(function() { data.push($(this).text()) });
		console.log(data);
    	$('<input type="hidden" name="data" />').attr('value', data).appendTo(this);
	});
    $("#menu li").draggable({
    	revert: "invalid", // when not dropped, the item will revert back to its initial position
		containment: "document",
		helper: "clone",
		cursor: "move"
    });
    $("#cart").droppable({
	 	accept: "#menu > li",
		activeClass: "ui-state-highlight",
        drop: function (event, ui) {
                addToCart(ui.draggable);
        }
    });
    var cartCount = 0;
    //combo to cart
    function addToCart($item){
    	if( cartCount < 2 ){
        	$item.fadeOut(function() {
        		$item.find('p').css({display:'none'});
        		$item.prepend('<span class="btn-lg glyphicon glyphicon-remove col-md-2 removeFromCart" aria-hidden="true"></span>');
        		
        		$('.removeFromCart').click(function(){
        			$parent=$(this).parent();
        			console.log($parent);
        			$parent.fadeOut(function(){
						$parent.find('.removeFromCart').remove();
						$parent.find('p').css({display:'block'});
						$parent.addClass('combos thumbnail')
			        			.removeClass('order')
			        			.appendTo($('#menu')).fadeIn();
		        		});
        			cartCount--;
        		});

        		$item.addClass('order')
        			.removeClass('combos thumbnail')
        			.appendTo($('#cart ul')).fadeIn();
        		cartCount++;
        	});
        } else {
        	$('#info').html('already 2 options');
        }
    }
});