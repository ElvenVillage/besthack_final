var container = document.getElementById("requests-list");



var pos = 0;
function more(problems) {
    for (let i = 0; i < problems.length; i++) {
        fetch('https://besthack.newpage.xyz/ajax_api/user_info.php?id=' + problems[i]["user_id"])
            .then(res => res.json())
            .then(user => {
                var problem = problems[i];

                var div = document.createElement('div');
                div.className = 'columns';

                var profile = document.createElement('div');
                profile.className = 'column columns is-3';

                var imgFigure = document.createElement('figure');
                imgFigure.className = "image is-64x64";
                var img = document.createElement('img');
                img.src = 'https://besthack.newpage.xyz/img/user_icon/' + user.image;
                img.className = 'is-rounded';
                imgFigure.appendChild(img);

                var username = document.createElement('div');
                username.style.paddingTop = '20px';
                var userSpan = document.createElement('span');
                userSpan.innerText = user.name + ' ' + user.surname + '\n';
                userSpan.style.fontWeight = 'bold';
                username.appendChild(userSpan);
                username.innerHTML += problem["create_date"];
                username.className = 'column';
    
                username.appendChild(imgFigure);
                profile.appendChild(username);

                textProblem = document.createElement('div');
                textProblem.className = 'column is-8';
                textProblemSpan = document.createElement('span');
                textProblemSpan.style.fontWeight = 'bold';
                textProblemSpan.innerText = problem.subject + ':\n';
                textProblem.style = 'padding-top: 20px'
                textProblem.appendChild(textProblemSpan);
                textProblem.innerHTML +=  problem.data;

                statusProblem = document.createElement('div');
                statusProblem.className = 'column';
                statusFigure = document.createElement('figure');
                statusFigure.className = "image is-64x64";
                statusImg = document.createElement('img');
                if (problem.status == 0) {
                    statusImg.src = "g.png";
                } else {
                    statusImg.src = "kr.png";
                }
                statusFigure.appendChild(statusImg);
                statusProblem.appendChild(statusFigure);
                statusProblem.style = 'padding-top: 20px';

                div.appendChild(profile); div.appendChild(textProblem); div.appendChild(statusProblem);
                container.appendChild(div);
    })
}    pos += problems.length;
}



function loadTasks(pos) {
    var tasks = [];
    fetch('https://besthack.newpage.xyz/ajax_api/last_tasks.php?lid='+pos)
        .then(res => 
            res.json()
        )
        .then(response => {
            for (let i = 0; i < response.length; i++) {
                pos++;
                fetch('https://besthack.newpage.xyz/ajax_api/task_info.php?id=' + response[i])
                    .then(response2 => response2.json())
                    .then(response2 => more([response2]))
            }
        })
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