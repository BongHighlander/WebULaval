function changeTitleColorOnHover() {
  this.getElementsByClassName('title')[0].classList.add('has-text-primary');
}

function changeTitleColorOnMouseQuit() {
  this.getElementsByClassName('title')[0].classList.remove('has-text-primary');
}

function addListeners() {
  const artistHero = document.getElementById('artist-hero');
  const albumHero = document.getElementById('album-hero');
  const mainHero = document.getElementById('main-hero');

  artistHero.addEventListener('mouseover', changeTitleColorOnHover);
  artistHero.addEventListener('mouseout', changeTitleColorOnMouseQuit);
  albumHero.addEventListener('mouseover', changeTitleColorOnHover);
  albumHero.addEventListener('mouseout', changeTitleColorOnMouseQuit);
  mainHero.addEventListener('mouseover', changeTitleColorOnHover);
  mainHero.addEventListener('mouseout', changeTitleColorOnMouseQuit);

}

document.addEventListener('DOMContentLoaded', addListeners);

