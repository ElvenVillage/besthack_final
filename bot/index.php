<!DOCTYPE html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Чат</title>
    <link rel="stylesheet" href="./buttons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.4.0/css/bulma.css" />
</head>

<body>
    <div class="hero" style="background-color: #26c6da; margin-left: 20%; margin-right: 20%;">
        <div class="hero-body">
            <h2 class="title is-size-2 " style=" color: white; text-align: center; margin-top: -5vh;"><b>Свяжитесь с нами!</h2>
				<h3 class="title is-size-5 " style=" color: white; text-align: center;margin: -2vh 0; ">Мы онлайн!</h3>
			
        </div>
    </div>
    <div class="box" style="margin-right: 20%;margin-left: 20%;">
        <div id="message-slider" style="width: 100%; height: 400px; overflow-y: scroll; overflow-x: hidden;">
            <div id='texter' style=' min-height:40vh; width:30vw; margin-left: 10%;'></div>

            <script src='../functions/fun.js'></script>
            <script>
                function b_send(text) {
                    texter.innerHTML += "<p>Вы: " + text + "</p><br>";
                    bot_send(text, func);
                }

                function func(text) {
                    texter.innerHTML += "<p>Бот: " + text + "</p><br>";
                }
            </script>
        </div>


    </div>
    <div style="margin-left: 30%; margin-right: 30%" class="columns">
        <div class="control column is-four-fifths">
            <input type="text" class="input" id='input'></div>
        <div class="control column">
            <input type="button" onclick='b_send(input.value)' class="input" id='submit' value="отправитьб"></div>
    </div>

    <script src="./chat.js"></script>
</body>