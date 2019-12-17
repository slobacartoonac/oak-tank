function sendScore(name,score,game,div){
        name=name.replace(/[^a-zA-Z0-9]/g,' ');
        score=score.replace(/[^0-9]/g,'0');
      var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
             div.innerHTML= xhttp.responseText;
        }
    };
        xhttp.open("POST", "../scores/savescore.1.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("name="+name+"&score="+score+"&game_id="+game);
    }