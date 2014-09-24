// function send_mail() {

// 	var url = 'https://mandrillapp.com/api/1.0/messages/send.json';

// 	var xhr = new XMLHttpRequest();
// 	if ("withCredentials" in xhr) {
// 		// XHR for Chrome/Firefox/Opera/Safari.
// 		xhr.open(method, url, true);
// 	} else if (typeof XDomainRequest != "undefined") {
// 		// XDomainRequest for IE.
// 		xhr = new XDomainRequest();
// 		xhr.open(method, url);
// 	} else {
// 		// CORS not supported.
// 		xhr = null;
// 	}

// 	if (!xhr) {
// 		console.log('CORS is not supported.');
// 		return;
// 	}

// 	// Response handlers.

// 	xhr.onload = function() {
// 		var text = xhr.responseText;
// 		console.log('Response from CORS request to ' + url + ': ' + text);
// 	};

// 	xhr.onerror = function() {
// 		console.log('Woops, there was an error making the request.');
// 	};

// 	data = {
// 		'key'		: '5wl3MmeEtKB4rE9QY6uhdQ',
// 		'message'	: {
// 			'from_email'	: 'hamid.azimy@ut.ac.ir',
// 			'to'			: [
// 				{
// 					'email'	: 'hamid.azimy+github.io@gmail.com',
// 					'name'	: 'Hamid Azimy',
// 					'type'	: 'to'
// 				}
// 			],
// 			'autotext'	: 'true',
// 			'subject'	: 'YOUR SUBJECT HERE!',
// 			'html'		: 'YOUR EMAIL CONTENT HERE! <br /> YOU CAN USE HTML!'
// 		}
// 	}

// 	xhr.send(JSON.stringify(data));

// }

$(document).ready(function() {

	$('#send_mail').click(function() {

		// send_mail();

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
			$('#success_modal').modal();
		}).fail(function(response) {
			console.log(response);
			$('#failure_modal').modal();
		}).always(function() {
			$('#send_mail').prop('disabled', false);
		});

	});

});
