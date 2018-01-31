function addBurgerListener() {
  const menuDiv = document.getElementsByClassName('navbar-menu')[0];
  const burger = document.getElementById('the-burger');
  menuDiv.classList.toggle('is-active');
  burger.classList.toggle('is-active');
  const welcome = document.getElementById('welcome-msg');

  if (burger.classList.contains('is-active')) {
    welcome.style.display = 'none';
  } else {
    welcome.style.display = 'flex';
  }
}

function addDropdownListener() {
  const dropdown = document.getElementsByClassName('navbar-item has-dropdown')[0];
  dropdown.classList.toggle('is-active');
}


function removeDropdownListener() {
  const dropdown = document.getElementsByClassName('navbar-item has-dropdown')[0];
  dropdown.classList.remove('is-active');
}

function addListeners() {
  const burger = document.getElementById('the-burger');
  const dropdown = document.getElementsByClassName('navbar-item has-dropdown')[0];
  burger.addEventListener('mousedown', addBurgerListener);
  dropdown.addEventListener('mouseenter', addDropdownListener);
  dropdown.addEventListener('mouseleave', removeDropdownListener);
}

document.addEventListener('DOMContentLoaded', addListeners);
