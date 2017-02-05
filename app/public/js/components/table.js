"use strict";

module.exports = function () {

    //-------------------------------------------------------------------------

    function http(url, method, data = null) {

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            xhr.onload = function () {

                if (this.status == 200) {

                    resolve(this.response);

                } else {

                    var error = new Error(this.statusText);

                    error.code = this.status;

                    reject(error);

                }

            };

            xhr.onerror = function () {

                reject(new Error("Network Error"));

            };

            xhr.send(data);

        });

    }

    //-------------------------------------------------------------------------

    http("/users", "GET")
        .then(response => showTableUsers(response), error => console.log(`Rejected: ${error}`))
        .then(response => addToUsersEvents(response), error => console.log(`Rejected: ${error}`))
        .catch(error => {console.log(`Rejected: ${error}`);});

    //-------------------------------------------------------------------------

    function showTableUsers(response) {

        return new Promise((resolve, reject) => {

            setTimeout(() => {

                try {

                    let users = JSON.parse(response);

                    users.forEach((currentUser, idUser) => {

                        if (currentUser !== null) {

                            let trElement = document.createElement('tr');

                            trElement.setAttribute("id", `${idUser}User`);

                            // console.log(currentUser + " = " + idUser);

                            trElement.innerHTML = `<td class="alert alert-success">${idUser}</td><td class="alert alert-success">${currentUser.name}</td><td class="alert alert-success"><input type="button" class="deleteUser" style="color: red" value="Удалить"> | <input type="button" style="color: blue" value="Изменить"</td><td class="alert alert-success"> <form action="" class="form-inline" style="display: "><div class="form-group"> <label for="update-user" class="sr-only">Имя </label> <input class="form-control update-user" id="${idUser}findNewValue" type="text" value=""> </div> &nbsp; <button type="" class="btn btn-primary updateUser">Изменить</button> </form></td>`

                            document.getElementById('users-body').appendChild(trElement);
                        }

                    });

                    resolve(true);

                } catch (e) {

                    reject(e);
                }

            }, 50);

        });
    }

    //-------------------------------------------------------------------------

    function addToUsersEvents(response) {

        // console.info(response);

        return new Promise(function (resolve, reject) {

            try {

                let itemsDelete = document.getElementsByClassName("deleteUser");

                for (let i = 0, len = itemsDelete.length; i < len; i++) {

                    itemsDelete[i].addEventListener('click', deleteUser(i), false);

                }

                let itemsUpdate = document.getElementsByClassName("updateUser");

                for (let i = 0, len = itemsDelete.length; i < len; i++) {

                    itemsUpdate[i].addEventListener('click', updateUser(i), false);

                }

                resolve(true);

            } catch (e) {

                reject(e);

            }

        });

    }

    //-------------------------------------------------------------------------

    function deleteUser(positionElement) {

        return function (e) {

            return new Promise(function (resolve, reject) {

                try {

                    // alert(e.currentTarget);

                    let usersBody = document.getElementById('users-body');

                    let usersTr = usersBody.getElementsByTagName('tr');

                    console.log(">> " + parseInt(usersTr[positionElement].getAttribute('id')) + " <<");

                    let idUser = parseInt(usersTr[positionElement].getAttribute('id'));

                    http(`/users/${idUser}`, 'DELETE')
                        .then(response => console.log(response), error => console.log(`Rejected: ${error}`))
                        .catch(error => {console.log(`Rejected: ${error}`);});

                    let blokedElement = document.getElementById(usersTr[positionElement].getAttribute('id'));

                    blokedElement.innerHTML = `<td class="alert alert-danger">X</td><td class="alert alert-danger">XXXXXXXXX</td><td class="alert alert-danger">XXXXXXXXXXXXXXXXXXXXXXXXX</td><td class="alert alert-danger"> </td>`;

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            });
        }
    }

    //-------------------------------------------------------------------------

    function updateUser(positionElement) {

        return function (e) {

            return new Promise(function (resolve, reject) {

                try {

                    // alert(e.currentTarget);

                    let usersBody = document.getElementById('users-body');

                    let usersTr = usersBody.getElementsByTagName('tr');

                    console.log(">> " + parseInt(usersTr[positionElement].getAttribute('id')) + " <<");

                    let idUser = parseInt(usersTr[positionElement].getAttribute('id'));

                    let newUserValue = document.getElementById(`${idUser}findNewValue`).value;

                    // alert(newUserValue);

                    let jsonData = JSON.stringify({

                        name: newUserValue

                    });

                   http(`/users/${idUser}`, "PUT", jsonData)
                        .then(response => console.log(response), error => console.log(`Rejected: ${error}`))
                        .catch(error => {console.log(`Rejected: ${error}`);});

                    usersBody.innerHTML = '';

                    http("/users", "GET")
                        .then(response => showTableUsers(response), error => console.log(`Rejected: ${error}`))
                        .then(response => addToUsersEvents(response), error => console.log(`Rejected: ${error}`))
                        .catch(error => {console.log(`Rejected: ${error}`);});

                    resolve(true);

                } catch (e) {

                    reject(e);

                }

            });
        }
    }


    //-------------------------------------------------------------------------

    document.getElementById('postName').onclick = function () {

        return new Promise(function (resolve, reject) {

            try {

                let jsonData = JSON.stringify({

                    name: document.getElementById('inputName').value

                });

                http("/users", "POST", jsonData)
                    .then(response => console.log(response), error => console.log(`Rejected: ${error}`))
                    .catch(error => {console.log(`Rejected: ${error}`);});

                let usersBody = document.getElementById('users-body');

                 usersBody.innerHTML = '';

                http("/users", "GET")
                    .then(response => showTableUsers(response), error => console.log(`Rejected: ${error}`))
                    .then(response => addToUsersEvents(response), error => console.log(`Rejected: ${error}`))
                    .catch(error => {console.log(`Rejected: ${error}`);});

                resolve(" Добавленно нового пользователя ! ");

            } catch (e) {

                reject(e);

            }
        });
    }

};