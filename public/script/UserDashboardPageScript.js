let dispval = document.querySelectorAll(".count");
let interval = 3000;
dispval.forEach((dispval) => {
    let val = 0;
    let valn = parseInt(dispval.getAttribute("data-val"));
    let time = Math.floor(interval / valn);
    let count = setInterval(function () {
        val += 1;
        dispval.textContent = val;
        if (val == valn) {
            clearInterval(count);
        }
    }, time);
});