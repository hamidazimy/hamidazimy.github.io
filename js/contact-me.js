$(document).ready(function() {

	$('#send_mail').click(function() {

		$('#send_mail').prop('disabled', true);
		
		$.ajax({
			type	: "POST",
			url		: 'https://mandrillapp.com/api/1.0/messages/send.json',
			data	: {
				'key'		: '5wl3MmeEtKB4rE9QY6uhdQ',
				'message'	: {
					'from_email'	: $('#email').val(),
					'from_name'		: $('#name' ).val(),
					'to'			: [
						{
							'email'	: 'hamid.azimy+github.io@gmail.com',
							'name'	: 'Hamid Azimy',
							'type'	: 'to'
						}
					],
					'autotext'	: 'true',
					'subject'	: 'Mail from "' + $('#name' ).val() + '" via github page.' ,
					'html'		: $('#message').val()	
				}
			}

		}).done(function(response) {
			console.log(response); // if you're into that sorta thing
			$('body').append(' \
				<div id="success_modal" style="display: none;">\
					Thank you!<br>Your message has been sent.\
				</div>');
			$('#success_modal').modal();
		}).fail(function(response) {
			console.log(response);
			$('body').append(' \
				<div id="failure_modal" style="display: none;">\
					Oops! There was a problem sending your message.\
				</div>');
			$('#failure_modal').modal();
		}).always(function() {
			$('#send_mail').prop('disabled', false);
		});

	});

});
