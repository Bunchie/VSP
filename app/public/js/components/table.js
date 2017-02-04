"use strict";

module.exports = function () {

    function http(url, method, data = null) {

        return new Promise(function (resolve, reject) {

            var xhr = new XMLHttpRequest();

            xhr.open(method, url, true);

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

    http("/users", "GET")
        .then(response => showTableUsers(response), error => alert(`Rejected: ${error}`)
            .catch(error => {
                alert(error);
            }));

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

                            trElement.innerHTML = `<td>${idUser}</td><td>${currentUser.name}</td><td><a href="#delete${idUser}" ><span class="deleteUser">Удалить</span></a> | <a href="#update${idUser}">Изменить</a></td><td> <form action="" class="form-inline"><div class="form-group"> <label for="updateName" class="sr-only">Имя </label> <input class="form-control" type="text" id="${idUser}updateName" value=""> </div> &nbsp; <button id="${idUser}sendUpdate" type="submit" class="btn btn-primary updateUser">Изменить</button> </form></td>`

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

};