

const authBox = document.getElementById("auth");
const appBox = document.getElementById("app");
const authMsg = document.getElementById("auth-msg");
const greetingEl = document.getElementById("greeting");

function signup() {
  const u = username.value.trim();
  const p = password.value.trim();

  if (!u || !p) {
    authMsg.textContent = "Please enter username and password";
    return;
  }

  localStorage.setItem("user", JSON.stringify({ u, p }));
  authMsg.textContent = "Signup successful! Please sign in.";
}

function signin() {
  const saved = JSON.parse(localStorage.getItem("user"));
  if (!saved) {
    authMsg.textContent = "No user found. Sign up first.";
    return;
  }

  if (username.value === saved.u && password.value === saved.p) {
    localStorage.setItem("session", saved.u);
    loadApp();
  } else {
    authMsg.textContent = "Invalid username or password";
  }
}

function logout() {
  localStorage.removeItem("session");
  appBox.classList.add("hidden");
  authBox.classList.remove("hidden");
}

function loadApp() {
  authBox.classList.add("hidden");
  appBox.classList.remove("hidden");
  greetingEl.textContent = `👋 Welcome ${localStorage.getItem("session")}!`;
}

if (localStorage.getItem("session")) loadApp();

const setupEl = document.getElementById("setup");
const punchEl = document.getElementById("punchline");
const jokeBtn = document.getElementById("joke-btn");
const category = document.getElementById("category");
const sound = document.getElementById("sound");

const likesEl = document.getElementById("likes");
const dislikesEl = document.getElementById("dislikes");

let likes = localStorage.getItem("likes") || 0;
let dislikes = localStorage.getItem("dislikes") || 0;

likesEl.textContent = likes;
dislikesEl.textContent = dislikes;

async function getJoke() {
  jokeBtn.disabled = true;
  jokeBtn.textContent = "Loading...";
  punchEl.classList.remove("show");

  let url = "https://official-joke-api.appspot.com/jokes/random";
  if (category.value !== "random") {
    url = `https://official-joke-api.appspot.com/jokes/${category.value}/random`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    const joke = Array.isArray(data) ? data[0] : data;

    setupEl.textContent = joke.setup;
    punchEl.textContent = joke.punchline || joke.punch;

    setTimeout(() => {
      punchEl.classList.add("show");
      sound.play();
      jokeBtn.disabled = false;
      jokeBtn.textContent = "Get Joke";
    }, 600);
  } catch {
    setupEl.textContent = "Why do programmers love JavaScript?";
    punchEl.textContent = "Because it always callbacks 😄";
    punchEl.classList.add("show");
    jokeBtn.disabled = false;
    jokeBtn.textContent = "Get Joke";
  }
}

jokeBtn.onclick = getJoke;

document.getElementById("like").onclick = () => {
  likes++;
  likesEl.textContent = likes;
  localStorage.setItem("likes", likes);
};

document.getElementById("dislike").onclick = () => {
  dislikes++;
  dislikesEl.textContent = dislikes;
  localStorage.setItem("dislikes", dislikes);
};

