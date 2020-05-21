var listElm = document.getElementById('container');
var users = [];

var pos = 0;
var loadFromApi = function(pos) {
    ///ТУ УТ УУ ТУ
    return fetch('https://besthack.newpage.xyz/ajax_api/get_all_users.php?lid=' + pos)
}

var loadMore = function() {
    loadFromApi(pos)
        .then(response => response.json())
        .then(user_ids => {
              for (let i = 0; i < user_ids.length; i++) {
                pos++;
                fetch('https://besthack.newpage.xyz/ajax_api/user_info.php?id='+user_ids[i])
                    .then(res => 
                      res.json()
                    )
                    .then(response => {
                      var div = document.createElement('div');
                      div.className = 'columns';
                      var div1 = document.createElement('div')
                      div1.className = 'column is-2';
                      var imgFigure = document.createElement('figure');
                      imgFigure.className = 'image is-64x64';
                      imgFigure.style.paddingLeft = "20px";
                      var img = document.createElement('img');
                      img.style.style = "padding-left:40px";
                      img.className = 'is-rounded';
                      img.src = 'https://besthack.newpage.xyz/img/user_icon/' + response.image;
                      imgFigure.appendChild(img);
                      div1.appendChild(imgFigure);
                      var div2 = document.createElement('div');
                      div2.className = 'column is-8';
                      var username = document.createElement('div');
                      username.innerText = response.name;
                      div2.appendChild(username);
                      var profileDiv = document.createElement('div');
                       profileDiv.className = 'column is-1';
                       var profileLink = document.createElement('a');
                       profileLink.style.color = 'black';
                       profileLink.href = '#';
                       profileLink.innerText = 'Профиль'
                       var chatDiv = document.createElement('div');
                       chatDiv.className = 'column is-1';
                       var chatLink = document.createElement('a');
                       chatLink.style.color = 'black'
                       chatLink.href = '#';
                       chatLink.innerText = 'Чат'
                       chatDiv.appendChild(chatLink);
                       profileDiv.appendChild(profileLink);
           
                       div.appendChild(div1); div.appendChild(div2);
                       div.appendChild(profileDiv); div.appendChild(chatDiv);
           
                       listElm.appendChild(div);
           
                    })
              }
        })}


listElm.addEventListener('scroll', function() {
  if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
    loadMore();
  }
});


loadMore();