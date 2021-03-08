document.addEventListener("DOMContentLoaded", () => {

    function openModal() {
        $('.modal').removeClass('hidden');
    }

    function closeModal() {
        $('.modal').addClass('hidden');
    }

    function passwordToggle() {
        const password = document.querySelectorAll('.password')
        const togglePassword = document.querySelectorAll('.password + i.fas')
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';

        password.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash')
    }

    function toggleForgottenPassword() {
        $('.forgotten-password').removeClass('hidden');
        $('.login').addClass('hidden')
        $('.signup').addClass('hidden')
    }

    function toggleSignUp() {
        $('.forgotten-password').addClass('hidden');
        $('.login').addClass('hidden')
        $('.signup').removeClass('hidden')
    }

    function toggleLogIn() {
        $('.forgotten-password').addClass('hidden');
        $('.login').removeClass('hidden')
        $('.signup').addClass('hidden')
    }
})