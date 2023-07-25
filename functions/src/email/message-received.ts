export const getMessageReceivedEmail = (name: string) => `
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Lunga BROS</title>
		<style>
			body {
				margin: 0;
				padding: 0;
				font-family: Arial, sans-serif;
				line-height: 1.6;
				background-color: #f5f5f5;
			}
			.container {
				max-width: 600px;
				margin: 40px auto;
				padding: 40px;
				border-radius: 5px;
				overflow: hidden;
				border: 1px solid #eaeaea;
			}
			.logo {
				display: block;
				width: 100px;
				margin: 0 auto 20px;
			}
			h1 {
				font-size: 1em;
				color: rgb(99, 102, 241);
				text-align: left;
				margin: 0;
			}
			p {
				color: #333333;
			}
			footer {
				padding: 30px;
				text-align: center;
				border-top: 1px solid #eaeaea;
			}
			.footer-logo {
				width: 100px;
				display: block;
				margin-bottom: 15px;
				margin-left: auto;
				margin-right: auto;
			}
			.footer-info {
				display: inline-block;
				margin: 0 10px;
				font-size: 0.8em;
				color: #888;
			}
			a {
				color: rgb(99, 102, 241);
				text-decoration: none;
			}
			a:hover {
				text-decoration: underline;
			}
			main {
				background-color: #f5f5f5;
				padding: 0 10px;
			}
		</style>
	</head>
	<body>
			<main>
				<div class="container">
					<img class="logo" src="https://lungabros.it/assets/logo/lungabros_dark_minimal.svg" alt="Lungabros Logo">
					<h1>Ciao ${name}!</h1>
					<p>Che piacere vederti galleggiare nella nostra casella di posta! 📬</p>
					<p>Abbiamo ricevuto la tua richiesta e stiamo "nuotando" 🏊‍♀️ verso una risposta il più velocemente possibile. Di solito riusciamo a rispondere prima che tu possa dire "Murena!" (entro 24-48 ore, per essere precisi).</p>
					<p>Grazie per averci scritto! Non vediamo l'ora di vedere il tuo OK subacqueo 👌 sott'acqua,</p>
					<p>I tuoi istruttori <b>LungaBros</b>!</p>
				</div>
				<footer>
					<img class="footer-logo" src="https://lungabros.it/assets/logo/lungabros_dark.svg" alt="Lungabros Logo">
					<p style="color: #888"><span class="footer-info"><a href="http://www.lungabros.it">www.lungabros.it</a></span>|<span class="footer-info"><a href="mailto:info@lungabros.it">info@lungabros.it</a></span></p>
				</footer>
			</main>
	</body>
</html>
`.trim();