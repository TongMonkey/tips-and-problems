const host = document.querySelector("#host");
const shadow = host.attachShadow({ mode: "closed" });
const span = document.createElement("span");
span.textContent = "I'm In The Shadow DOM";
shadow.appendChild(span);

const upper = document.querySelector("button#upper");
upper.addEventListener("click", () => {
  const spans = Array.from(document.querySelectorAll("span"));
  for (const span of spans) {
    span.textContent = span.textContent.toUpperCase();
  }
});

const lower = document.querySelector("button#lower");
lower.addEventListener("click", () => {
  const spans = Array.from(host.shadowRoot.querySelectorAll("span")); // host.shadowRoot
  for (const span of spans) {
    span.textContent = span.textContent.toLowerCase();
  }
});

const reload = document.querySelector("#reload");
reload.addEventListener("click", () => document.location.reload());
