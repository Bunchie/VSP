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
        .then(response => showTableUsers(response), error => alert(`Rejected: ${error}`))
        .then(response => addToUsersDeleteEvent(), error => alert(`Rejected: ${error}`))
        .catch(error => {
            alert(`Rejected: ${error}`);
        });

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

                            trElement.innerHTML = `<td>${idUser}</td><td>${currentUser.name}</td><td><a href="#delete${idUser}" class="deleteUser"><span>Удалить</span></a> | <a href="#update${idUser}">Изменить</a></td><td> <form action="" class="form-inline"><div class="form-group"> <label for="updateName" class="sr-only">Имя </label> <input class="form-control" type="text" id="${idUser}updateName" value=""> </div> &nbsp; <button id="${idUser}sendUpdate" type="submit" class="btn btn-primary updateUser">Изменить</button> </form></td>`

                            document.getElementById('users-body').appendChild(trElement);
                        }
                    });

                    resolve();

                } catch (e) {

                    reject(e);
                }

            }, 500);

        });
    }

    //-------------------------------------------------------------------------

    function addToUsersDeleteEvent() {

        return new Promise(function (resolve, reject) {

            try {

                let itemsDelete = document.getElementsByClassName("deleteUser");

                for (let i = 0, len = itemsDelete.length; i < len; i++) {

                    itemsDelete[i].addEventListener('click', deleteUser(i), false);

                }

                resolve();

            } catch (e) {

                reject(e);

            }

        });

    }

    //-------------------------------------------------------------------------

    function setDeletedElement(deletedElement, elems){

        let blokedElement = document.getElementById(elems[deletedElement].getAttribute('id'));

        blokedElement.innerHTML = `<td>X</td><td>XXXXXXXXX</td><td>XXXXXXXXXXXXXXXXXXXXXXXXX</td><td> </td>`;
    }

    //-------------------------------------------------------------------------

    function deleteUser(positionElement) {

        return function (e) {

            return new Promise(function (resolve, reject) {

                try {

                    // alert(e.currentTarget);

                    let usersAttribute = document.getElementById('users-body');

                    let elems = usersAttribute.getElementsByTagName('tr');

                    console.log(">> " + parseInt(elems[positionElement].getAttribute('id')) + " <<");

                    let idUser = parseInt(elems[positionElement].getAttribute('id'));

                    http(`/users/${idUser}`, 'DELETE')
                        .then(response => alert(response), error => alert(`Rejected: ${error}`))
                        .catch(error => {
                            alert(error);
                        });

                    let blokedElement = document.getElementById(elems[positionElement].getAttribute('id'));

                    blokedElement.innerHTML = `<td>X</td><td>XXXXXXXXX</td><td>XXXXXXXXXXXXXXXXXXXXXXXXX</td><td> </td>`;

                } catch (e) {

                    reject(e);

                }

            });
        }
    }

    document.getElementById('postName').onclick = function () {

        return new Promise(function (resolve, reject) {

            try {

                let jsonData = JSON.stringify({

                    name: document.getElementById('inputName').value

                });

                http("/users", "POST", jsonData)
                    .then(response => alert(response), error => alert(`Rejected: ${error}`))
                    .catch(error => {
                        alert(error);
                    });

            } catch (e) {

                reject(e);

            }
        });
    }
};