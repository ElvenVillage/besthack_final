const mainContainer = document.getElementById('message-slider');

let currentChatId = -1;

let latestTimestamp = Date.parse('March 7, 2014');

function lastSeenedId(messages) {
    let maxi = 30000;
    for (let i = 0; i < messages.length; i++) {
        if (parseInt(messages[i].id) < maxi) {
            maxi = parseInt(messages[i].id);
        }
    }
    return maxi;
}

//Функция дял ajax-get запросов, вводится адрес и функция для возврата(необязательно);
function ajax(url, fun = false) {
    var xmlhttp = new XMLHttpRequest();
    var func = fun;
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                if (func != undefined & func != false) {
                    func(xmlhttp.responseText);
                } else {
                    console.log(xmlhttp.responseText);
                }
            } else {
                if (func != undefined & func != false) {
                    func(xmlhttp.status + ': ' + xmlhttp.statusText);
                } else {
                    console.log(xmlhttp.status + ': ' + xmlhttp.statusText);
                }
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

//Функция запроса чатов пользователя (авторизация через cookie)
function get_chats(fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/get_chats.php", fun);
}

function get_users(c, fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/get_all_users.php", fun);
}

function push_message(c, text, fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/add__message.php?id=" + c + "&text=" + text, fun);
}

function get_messages(c, fun, last = false) {
    if (last) {
        ajax("https://besthack.newpage.xyz/ajax_api/get_messages.php?id=" + c + "&lid=" + last, fun);
    } else {
        ajax("https://besthack.newpage.xyz/ajax_api/get_messages.php?id=" + c, fun);
    }
}

function new_invite_link(c, fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/new_invite_link.php?chat=" + c, fun);
}

function drop_user(c, uid, fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/drop_user.php?chat=" + c + "&uid=" + uid, fun);
}

function user_info_quick(uid, fun) {
    ajax("https://besthack.newpage.xyz/ajax_api/user_info.php?id=" + uid, fun);
}


class Message {
    constructor(owner, text, timestamp, id) {
        this.owner = owner;
        this.text = text;
        this.timestamp = timestamp;
        this.id = id;
    }
}

class User {
    constructor(id, name, surname, avatar) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.avatar = avatar;
    }
}

let users = [];

class RecyclerView {

    createNewDivs(maxMessages) {
        for (let i = 0; i < maxMessages; i++) {
            const delimiter = document.createElement('div');
            const username = document.createElement('b');
            delimiter.append(username);
            const div = document.createElement('div');
            div.className = 'columns';

            const firstColumn = document.createElement('div');
            firstColumn.className = 'column is-4 columns';
            const firstSubColumn = document.createElement('div');
            firstSubColumn.className = 'column is-6';
            const figure = document.createElement('figure');
            figure.className = 'image is-64x64'
            const avatar = document.createElement('img');
            figure.append(avatar);
            avatar.className = 'is-rounded';
            
            const timestamp = document.createElement('div');
            timestamp.className = 'column';
            timestamp.style = "padding-top:15px"
            //firstSubColumn.append(username);
            firstSubColumn.append(figure);
            firstColumn.append(firstSubColumn);
            firstColumn.append(timestamp);

            const thirdColumn = document.createElement('div');
            thirdColumn.className = 'column';
            const text = document.createElement('div');
            thirdColumn.append(text);

            this.divs.push(div);
            this.avatars.push(avatar);
            this.texts.push(text);
            this.usernames.push(username);
            this.timestamps.push(timestamp);

            div.append(firstColumn);
            div.append(thirdColumn);

            this.container.prepend(div);
            this.container.prepend(delimiter);
        }
    }

    constructor(container, maxMessages) {
        this.container = container;
        this.maxMessages = maxMessages;
        this.messages = [];
        this.pos = 0;

        this.divs = [];
        this.usernames = [];
        this.avatars = [];
        this.texts = [];
        this.timestamps = [];

        this.createNewDivs(maxMessages);
    }


    render() {
        for (let i = 0; i < Math.min(this.maxMessages-1, this.messages.length); i++) {
            const ownerId = this.messages[this.pos + i].owner;
            let owner = {};
            let index = 0;
            for (let j = 0; j < users.length; j++) {
                if (users[j].id === ownerId) {
                    owner = users[j];
                    index = j;
                    break;
                }
            }
            if (!(owner.name)) {
                user_info_quick(ownerId, (userdata) => {
                    userdata = JSON.parse(userdata);
                    const user = new User(ownerId, userdata.name, userdata.surname, userdata.image);
                    users[index] = user;
                    this.avatars[this.pos + i].src = 'https://besthack.newpage.xyz/img/user_icon/' + userdata['image'];
                    this.texts[this.pos + i].innerText = this.messages[this.pos + i].text;
                    this.usernames[this.pos + i].innerText = userdata.name;
                    this.timestamps[this.pos + i].innerText = this.messages[this.pos + i].timestamp;
                })
            } else {
                this.avatars[this.pos + i].src = 'https://besthack.newpage.xyz/img/user_icon/' + users[index].avatar;
                this.texts[this.pos + i].innerText = this.messages[this.pos + i].text;
                this.usernames[this.pos + i].innerText = owner.name;
                this.timestamps[this.pos + i].innerText = this.messages[this.pos + i].timestamp;
            }
        }
    }



    init() {
        this.container.addEventListener('click', () => {
            this.pos += this.maxMessages - 1;
            loadMoreMessages(this.pos);
            return;
        });
    }
}

function loadUsers() {
    users = [];
    get_users(currentChatId, (res) => {
        res = JSON.parse(res);
        res.forEach(id => {
            users.push(new User(id, null, null, null))
        });
        loadMessages();
    });
}


function loadDialogs() {
    currentChatId = window.location.href.slice(window.location.href.length-3, window.location.href.length);
    if (currentChatId[0] == "0") currentChatId = currentChatId.slice(currentChatId.length-2,currentChatId.length);
    loadUsers();

}


let myRecyclerView = new RecyclerView(mainContainer, 10);
myRecyclerView.init();

function loadMoreMessages(pos) {
    get_messages(currentChatId, (res) => {
        res = JSON.parse(res);
        res.forEach(msg => {
            const message = new Message(msg["owner_id"], msg.data, msg.date, msg.id);
            if (!wasAlreadyTaken(myRecyclerView.messages, msg.id))
                myRecyclerView.messages.unshift(message);
        });

        myRecyclerView.createNewDivs(myRecyclerView.maxMessages);
        myRecyclerView.render();
        myRecyclerView.divs[myRecyclerView.divs.length - 1].scrollIntoView(true);
    }, lastSeenedId(myRecyclerView.messages));
}

function wasAlreadyTaken(messages, id) {
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
            return true;
        }
    }
    return false;
}

function loadMessages(render = true) {
    get_messages(currentChatId, (res) => {
        res = JSON.parse(res);
        myRecyclerView.messages = [];
        res.forEach(msg => {
            const message = new Message(msg["owner_id"], msg.data, msg.date, msg.id);
            if (!wasAlreadyTaken(myRecyclerView.messages, msg.id))
                myRecyclerView.messages.push(message);
        });
        if (render) {
            myRecyclerView.render();
        } else {
            myRecyclerView.messages.forEach(msg => {
                const date = Date.parse(msg.timestamp.replace(' ', 'T'));
                if (date >= latestTimestamp) {
                    myRecyclerView.render();
                    latestTimestamp = date;
                }
            })
        }
    });
}

function reloadMessages() {
    loadMessages(true);
}


function initUi() {
    const submitButton = document.getElementById('submit');
    submitButton.addEventListener('click', () => {
        const textarea = document.getElementById('textarea');
        push_message(currentChatId, textarea.value, () => {
            reloadMessages();
            textarea.value = '';
        });
    })
    fetch('https://besthack.newpage.xyz/ajax_api/full_user_info.php?id=2')
        .then(res => res.json())
        .catch(() => { //ЗАМЕНИТЬ НА CATСH
             //нам не дали значит не админ
             document.getElementById('status').style = 'display:inline'
             document.getElementById('status').addEventListener('click', () => {
                 fetch('https://besthack.newpage.xyz/ajax_api/change_status.php?id=' + currentChatId)
                     .then(alert('Закрыто'))
             })
        })
}


loadDialogs();
initUi();


let timer = setInterval(() => {
    loadMessages(false);
},2000);
