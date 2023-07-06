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
const dateInput = document.querySelector('input[name="eventDate"]');
const nameInput = document.querySelector('input[name="name"]');
const numberInput = document.querySelector('input[name="number"]');
const emailInput = document.querySelector('input[name="mail"]');
const cityInput = document.querySelector('select[name="eventCity"]');
const eventInput = document.querySelector('select[name="eventType"]');

// Array of Input Elements
const inputs = [eventInput, cityInput, nameInput, numberInput, emailInput, dateInput];


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

const validateInput = () => {
    if (!isValidationOn) {
        return;
    }

    isFormValid = true;
    resetElement(dateInput);
    resetElement(nameInput);
    resetElement(numberInput);
    resetElement(emailInput);
    resetElement(cityInput);
    resetElement(eventInput);

    if (!cityInput.value) {
        isFormValid = false;
        invalidateElement(cityInput);
    }

    if (!eventInput.value) {
        isFormValid = false;
        invalidateElement(eventInput);
    }

    if (!dateInput.value) {
        isFormValid = false;
        invalidateElement(dateInput);
    }

    if (!nameInput.value) {
        isFormValid = false;
        invalidateElement(nameInput);
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