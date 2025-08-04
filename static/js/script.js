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

function caching(task) {
    let list = [task]; 
    const cacheddata = JSON.parse(localStorage.getItem("list"));
    if (cacheddata != null){
      list = list.concat(cacheddata);
    }
    const index = list.indexOf(task)
    localStorage.setItem("list", JSON.stringify(list));
    return index;
  }

if (isAuthenticated == "false"){
  const cachedTask = JSON.parse(localStorage.getItem("list"));
  const list = document.getElementById("taskList");
  list.innerHTML = `<li>Sign Up/In :)</li>`;
  cachedTask.forEach(task => {
    let index = cachedTask.indexOf(task);
    list.innerHTML += `<li id="${index}">${task}<button onclick="checked(this)" class="done" value="${index}">√</button></li>` ;
  });
}

async function upload() {
    let task = document.getElementById("taskInput").value
    let index;
    document.getElementById("taskInput").value = "";
    if (isAuthenticated == "true"){
      try {
        let response = fetch(`/submit/`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({ task: task}),
        });
      } 
      catch (error) {
        console.error("Error sending data:", error);
        index = caching(task);
      }
    }
    else if (isAuthenticated == "false"){
      index = caching(task);
    }
    const tasks = document.getElementById("taskList");
    tasks.innerHTML = `<li id="${index}">${task}<button onclick="checked(this)" class="done" value="${index}">√</button></li>` + tasks.innerHTML;
}

async function checked(element) {
  const that_task = document.getElementById(element.value)
  if (isAuthenticated == "true"){
    try {
      let response = fetch(`/done/`, {
          method: "POST",
          headers: {
          "Content-Type": "application/json",
          'X-CSRFToken': csrftoken
          },
          body: JSON.stringify({ task: that_task.value}),
      });
    } 
    catch (error) {
      isAuthenticated = false;
      console.error("Error sending data:", error);
    }
  }
  else if (isAuthenticated == "false"){
    const cacheddata = JSON.parse(localStorage.getItem("list"));
    cacheddata.splice(element.value, 1);
    localStorage.setItem("list", JSON.stringify(cacheddata));
  }
  that_task.parentElement.removeChild(that_task);
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