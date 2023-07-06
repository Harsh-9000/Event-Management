let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});


const radios = document.querySelectorAll('.city-filter');
radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const budget_radios = document.querySelectorAll('.budget-filter');
budget_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            budget_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const rating_radios = document.querySelectorAll('.rating-filter');
rating_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            rating_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const venue_budget_radios = document.querySelectorAll('.venue_budget-filter');
venue_budget_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            venue_budget_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const venue_rating_radios = document.querySelectorAll('.venue_rating-filter');
venue_rating_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            venue_rating_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const venue_food_radios = document.querySelectorAll('.venue-food-filter');
venue_food_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            venue_food_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});

const venue_capacity_radios = document.querySelectorAll('.venue-capacity-filter');
venue_capacity_radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            venue_capacity_radios.forEach((otherRadio) => {
                if (otherRadio !== radio) {
                    otherRadio.checked = false;
                }
            });
        }
    });
});