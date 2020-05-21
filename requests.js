var container = document.getElementById("requests-list");

function loadFromApi(pos) {
    return fetch("https://raw.githubusercontent.com/ElvenVillage/besthack_final/master/test");
}

var pos = 0;
function more() {
    loadFromApi(pos)
        .then(response => response.json())
        .then(problems => {
            for (let i = 0; i < problems.length; i++) {
                var problem = problems[i];

                var div = document.createElement('div');
                div.className = 'columns';

                var profile = document.createElement('div');
                profile.className = 'column columns';

                var imgFigure = document.createElement('figure');
                imgFigure.className = "image is-64x64";
                var img = document.createElement('img');
                img.src = problem.avatar;
                img.className = 'is-rounded';
                imgFigure.appendChild(img);

                var username = document.createElement('div');
                username.innerText = problem.username;
                username.className = 'column';
    
                username.appendChild(imgFigure);
                profile.appendChild(username);

                textProblem = document.createElement('div');
                textProblem.className = 'column';
                textProblem.innerText = problem.theme + ':\n' + problem.text;
                textProblem.style = 'padding-top: 20px'

                statusProblem = document.createElement('div');
                statusProblem.className = 'column';
                statusProblem.innerText = problem.status;
                statusProblem.style = 'padding-top: 20px';

                div.appendChild(profile); div.appendChild(textProblem); div.appendChild(statusProblem);
                container.appendChild(div);}
                pos += problems.length;
})}


container.addEventListener('scroll', function() {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      more();
    }
  });
more();

document.getElementById('gg').onclick = () => {
    more();
}