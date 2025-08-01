"use strict";
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const logInBtn = document.querySelector(".log_in");
const signUpBtn = document.querySelector(".sign_up");
const container = document.querySelector(".container");
const submit = document.querySelectorAll(".submit");
const logInWindow = document.querySelector(".log_in-window");
const signUpWindow = document.querySelector(".sign_up-window");
const closeBtn = document.querySelectorAll(".closeBtn");
const nameInput = document.getElementById("Name");
const lastNameInput = document.getElementById("lastName");
const passwordInput = document.getElementById("password");
const isAuthenticated = document.getElementById("authenticated").value

function getCookie(name) {
  let value = null;
  if (document.cookie) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      if (cookie.trim().startsWith(name + '=')) {
        value = decodeURIComponent(cookie.trim().substring(name.length + 1));
        break;
      }
    }
  }
  return value;
}

const csrftoken = getCookie('csrftoken');

if (isAuthenticated == false){
  const task = JSON.parse(localStorage.getItem("list")) || []
  const list = document.getElementById("taskList");
  list.innerHTML = `<li>${task}<button class="done">√</button></li>` + list.innerHTML;
}

function getLocalStorage() {
  const data = JSON.parse(localStorage.getItem("list")) || []
  if (!data) return;
}

console.log(isAuthenticated);
async function upload() {
    console.log(1);
    let task = document.getElementById("taskInput").value
    document.getElementById("taskInput").value = "";
    if (isAuthenticated == true){
      console.log(2);
      try {
        let response = fetch(`/submit/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(task),
        });
      } 
      catch (error) {
        console.error("Error sending data:", error);
      }
    }
    else{
      console.log(3);
      localStorage.setItem("list", task);
    }
    const list = document.getElementById("taskList");
    list.innerHTML = `<li>${task}<button class="done">√</button></li>` + list.innerHTML;
}

logInBtn.addEventListener("click", () => {
  logInWindow.classList.remove("hide");
  container.style.display = "none";
});

signUpBtn.addEventListener("click", () => {
  signUpWindow.classList.remove("hide");
  container.style.display = "none";
});

closeBtn.forEach((ele) => {
  ele.addEventListener("click", () => {
    logInWindow.classList.add("hide");
    signUpWindow.classList.add("hide");
    container.style.display = "block";
  });
});

console.log("updated");