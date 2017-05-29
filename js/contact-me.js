$(document).ready(function() {

	$('#send_mail').click(function() {

		$('#send_mail').prop('disabled', true);

		$.post('https://postmail.invotes.com/send', {
			"access_token": "ea8yqywkunupp4tdb4foqv2p",
			"subject": 'Mail from "' + $('#name' ).val() + '" via github page.',
			"text": 'From: "' + $('#name' ).val() + '" <' + $('#email').val() + '>\n\n\n' + $('#message').val()
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
