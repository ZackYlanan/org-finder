const dots = document.querySelectorAll('.dot');
const colors = ['#460000', '#781E10', '#A82505', '#C13810'];
let index = 0;

const interval = setInterval(() => {
  if (index < dots.length) {
    for (let i = 0; i <= index; i++) {
      dots[i].style.backgroundColor = colors[i];
    }
    index++;
  } else {
    clearInterval(interval); // stop after 4 dots
  }
}, 1000);
