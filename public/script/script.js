const menu = document.querySelector(".menu");
const menuMain = document.querySelector(".menu-main");
const closeMenu = menu.querySelector(".mobile-menu-close");
const goBack = document.querySelector(".go-back");
const menuTrigger = document.querySelector(".mobile-menu-trigger");

let subMenu;

menuMain.addEventListener("click", (e) => {
    if (!menu.classList.contains("active")) {
        return;
    }

    if (e.target.closest(".menu-item-with-children")) {
        const hasChildren = e.target.closest(".menu-item-with-children");
        showSubMenu(hasChildren);
    };
});

goBack.addEventListener("click", () => {
    hideSubMenu();
});

menuTrigger.addEventListener("click", () => {
    toggleMenu();
});

closeMenu.addEventListener("click", () => {
    toggleMenu();
});

document.querySelector(".menu-overlay").addEventListener("click", () => {
    toggleMenu();
});

function toggleMenu() {
    menu.classList.toggle("active");
    document.querySelector(".menu-overlay").classList.toggle("active");
}

function showSubMenu(hasChildren) {
    subMenu = hasChildren.querySelector(".sub-menu");
    subMenu.classList.add("active");
    subMenu.style.animation = "slideLeft 0.5s ease forwards";
    const menuTitle = hasChildren.querySelector('i').parentNode.childNodes[0].textContent;

    menu.querySelector(".current-menu-title").innerHTML = menuTitle;
    menu.querySelector(".mobile-menu-head").classList.add("active");
}

function hideSubMenu() {
    subMenu.style.animation = "slideRight 0.5s ease forwards"

    setTimeout(() => {
        subMenu.classList.remove("active");
    }, 300);

    menu.querySelector(".current-menu-title").innerHTML = "";
    menu.querySelector(".mobile-menu-head").classList.remove("active");
}

window.onresize = function () {
    if (this.innerWidth > 1210) {
        if (menu.classList.contains("active")) {
            toggleMenu();
        }
    }
}

function profileToggle() {
    const toggleProfile = document.querySelector('.profile-menu');
    toggleProfile.classList.toggle('active');
}