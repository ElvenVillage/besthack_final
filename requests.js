var container = document.getElementById("requests-list");


function loadTasks(pos) {
    var tasks = [];
    fetch('https://besthack.newpage.xyz/ajax_api/last_tasks.php')
        .then(response => response.json())
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                fetch('https://besthack.newpage.xyz/ajax_api/task_info.php?id=' + response[i])
                    .then(response2 => response2.json())
                    .then(response2 => tasks.push(response2))
            }
        })
        .then(() => more(tasks))
}


var pos = 0;
function more(problems) {
    for (let i = 0; i < problems.length; i++) {
        fetch('https://besthack.newpage.xyz/ajax_api/user_info.php?id=' + problems[i]["user_id"])
            .then(response => response.json())
            .then(user => {
                var problem = problems[i];

                var div = document.createElement('div');
                div.className = 'columns';

                var profile = document.createElement('div');
                profile.className = 'column columns';

                var imgFigure = document.createElement('figure');
                imgFigure.className = "image is-64x64";
                var img = document.createElement('img');
                img.src = user.image;
                img.className = 'is-rounded';
                imgFigure.appendChild(img);

                var username = document.createElement('div');
                username.innerText = user.name + ' ' + user.surname;
                username.className = 'column';
    
                username.appendChild(imgFigure);
                profile.appendChild(username);

                textProblem = document.createElement('div');
                textProblem.className = 'column';
                textProblem.innerText = problem.theme + ':\n' + problem.text;
                textProblem.style = 'padding-top: 20px'

                statusProblem = document.createElement('div');
                statusProblem.className = 'column';
                statusProblem.innerText = true;
                statusProblem.style = 'padding-top: 20px';

                div.appendChild(profile); div.appendChild(textProblem); div.appendChild(statusProblem);
                container.appendChild(div);
    })
}    pos += problems.length;
}


container.addEventListener('scroll', function() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      loadTasks(pos);
    }
  });
loadTasks(pos);

document.getElementById('gg').onclick = () => {
    loadTasks(pos);
}