var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    grabCursor: true,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// Email Format
const isValidEmail = (email) => {
    const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
    return re.test(String(email).toLowerCase());
};

// Number Format
const isValidPhone = (phone) => {
    const re = /^\d{10}$/im;
    return re.test(String(phone).toLowerCase());
};

// Getting Form Element
const form = document.querySelector('form');

// Getting Input Elements
const serviceInput = document.querySelector('select[name="vendorService"]');
const cityInput = document.querySelector('select[name="city"]');
const nameInput = document.querySelector('input[name="ownerName"]');
const numberInput = document.querySelector('input[name="ownerNumber"]');
const emailInput = document.querySelector('input[name="ownerMail"]');
const businessInput = document.querySelector('input[name="businessName"]');
const addressInput = document.querySelector('input[name="businessAddress"]');
const passwordInput = document.querySelector('input[name="ownerPassword"]');

// Array of Input Elements
const inputs = [passwordInput, cityInput, addressInput, businessInput, serviceInput, nameInput, numberInput, emailInput];


let isFormValid = false; // To Check if Form is Valid
let isValidationOn = false; // To prevent all input from getting invalid in the start

const resetElement = (element) => {
    element.classList.remove("invalid");
    element.nextElementSibling.classList.add('hidden');
}

const invalidateElement = (element) => {
    element.classList.add("invalid");
    element.nextElementSibling.classList.remove('hidden');
}

const invalidateElement_2 = (element) => {
    element.classList.add("invalid");
    element = element.nextElementSibling
    element.nextElementSibling.classList.remove('hidden');
}

const validateInput = () => {
    if (!isValidationOn) {
        return;
    }

    isFormValid = true;
    resetElement(serviceInput);
    resetElement(nameInput);
    resetElement(numberInput);
    resetElement(emailInput);
    resetElement(cityInput);
    resetElement(addressInput);
    resetElement(businessInput);
    resetElement(passwordInput);

    if (passwordInput.value.length < 8 && passwordInput.value) {
        isFormValid = false;
        invalidateElement_2(passwordInput);
    }

    if (!passwordInput.value) {
        isFormValid = false;
        invalidateElement(passwordInput);
    }

    if (!addressInput.value) {
        isFormValid = false;
        invalidateElement(addressInput);
    }

    if (!businessInput.value) {
        isFormValid = false;
        invalidateElement(businessInput);
    }

    if (!cityInput.value) {
        isFormValid = false;
        invalidateElement(cityInput);
    }

    if (!nameInput.value) {
        isFormValid = false;
        invalidateElement(nameInput);
    }

    if (!serviceInput.value) {
        isFormValid = false;
        invalidateElement(serviceInput);
    }

    if (!isValidPhone(numberInput.value)) {
        isFormValid = false;
        invalidateElement(numberInput);
    }

    if (!isValidEmail(emailInput.value)) {
        isFormValid = false;
        invalidateElement(emailInput);
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    isValidationOn = true;

    validateInput();

    if (isFormValid) {
        form.submit();
    }
});

// Check if right value is entered
inputs.forEach((input) => {

    input.addEventListener("input", () => {
        validateInput();
    });

});