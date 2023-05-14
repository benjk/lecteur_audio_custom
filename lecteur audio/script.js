const pauseImg = "url(https://w7.pngwing.com/pngs/879/589/png-transparent-pause-logo-computer-icons-button-media-player-pause-button-rectangle-black-internet-thumbnail.png)";
const playImg = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Quk8H-smZwKezMxfMoB-pRA4gqYkIfi0funqmyRceA&s)";
const muteImg = "url(https://media.istockphoto.com/id/1305893663/vector/silent-sound-off-icon-vector-for-your-web-design-logo-ui-illustration.jpg?s=612x612&w=0&k=20&c=czrINWt2weKC3fLHU3KqI2eZBFdwhOuuCZxS5JNGpSU=)";
const unmuteImg = "url(https://winaero.com/blog/wp-content/uploads/2021/06/Windows-11-startup-sound-icon.png)";


var audioPlayer = document.getElementById("audio-player");
var playPauseButton = document.getElementById("play-pause-button");
var volumeSlider = document.getElementById("volume-slider");
var progressBar = document.getElementById("progress-bar");
var progressContainer = document.getElementById("progress-container");
var audioButtons = document.querySelectorAll(".audio-button");
var volumeButton = document.getElementById("volume-icon");
var currentTitle = document.getElementById("current-title");
var audioImg = document.getElementById("audio-image");

var playlist = [
  {
    "index": 0,
    "src": "./asset/audio/Happy Clappy 30sec.wav",
    "name": "Balbutiement",
    "img": "./asset/img/Balbutiements-1.png"
  },
  {
    "index": 1,
    "src": "./asset/audio/Funny.wav",
    "name": "Piste 2",
    "img": "./asset/img/Balbutiements-2.png"
  },
  {
    "index": 2,
    "src": "./asset/audio/NikiN - Comedy Curiosity (Intro).wav",
    "name": "Piste 3",
    "img": "./asset/img/Balbutiements-3.png"
  }
]

// var pour save la valeur du volume lorsqu'on appuie sur mute, pour pouvoir la redonner lors du demute
var currentVolumeValue = 50;

// Index du track pour gestion de la playlist
var currentTrackIndex = 0;
setTrack(currentTrackIndex);


// Gestion des clicks sur audioButtons
audioButtons.forEach(function(button) {
  button.addEventListener("click", function(event) {
    const index = Array.from(audioButtons).indexOf(button);
    setTrack(index);
    playTrack();
  });
});

// Préparation d'un track dans le lecteur
function setTrack(index) {
  var track = playlist[index]
  currentTrackIndex = track.index;

  // Mettre à jour le titre et l'image de la piste dans le lecteur
  var currentTitle = document.getElementById("current-title");
  currentTitle.textContent = track.name;
  audioImg.style.backgroundImage = `url(${track.img})`;

  // Charger la piste
  audioPlayer.src = track.src;
}

// Jouer la piste préchargée et mettre à jour le bouton Play
function playTrack(){
  audioPlayer.play();

  // Mettre à jour le bouton play/pause
  playPauseButton.style.backgroundImage = pauseImg;
}

playPauseButton.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.style.backgroundImage = pauseImg;
  } else {
    audioPlayer.pause();
    playPauseButton.style.backgroundImage = playImg;
  }
});

// Déplacement dans l'audio au clic sur la ProgressBar
progressContainer.addEventListener("click", function (event) {
  var clickPosition = event.offsetX;
  var progressContainerWidth = progressContainer.offsetWidth;
  var progressPercentage = (clickPosition / progressContainerWidth) * 100;

  var audioDuration = audioPlayer.duration;
  var targetTime = (progressPercentage / 100) * audioDuration;

  audioPlayer.currentTime = targetTime;
});

// Met à jour la progressBar en fonction du player
audioPlayer.addEventListener("timeupdate", function () {
  updateTrackSlider();
});

// Quand le track est terminé, on passe au suivant ou on arrête et on affiche le bouton Play pour recommencer
audioPlayer.addEventListener("ended", function () {
  // Vérifier si la piste actuelle n'est pas la dernière de la playlist
  if (currentTrackIndex < playlist.length - 1) {
    currentTrackIndex++;
    setTrack(currentTrackIndex);
    playTrack();
  } else {
    // Si c'est la dernière piste, arrêter la lecture et réinitialiser l'index
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    currentTrackIndex = 0;
    setTrack(currentTrackIndex);
    updateTrackSlider();
    // Mettre à jour le bouton play/pause
    playPauseButton.style.backgroundImage = playImg;
  }
});

// Ajouter un gestionnaire d'événements au clic sur le bouton de volume
volumeButton.addEventListener("click", function () {
  // Vérifier si la fonction de sourdine est activée
  if (audioPlayer.muted) {
    // Désactiver la fonction de sourdine
    audioPlayer.muted = false;

    // Mettre à jour l'icône du bouton de volume pour refléter l'état actuel
    volumeButton.style.backgroundImage = muteImg;

    // Mise à jour du volumeslider
    volumeSlider.value = currentVolumeValue;
    updateVolumeSlider();
  } else {
    // Activer la fonction de sourdine
    audioPlayer.muted = true;

    // Mettre à jour l'icône du bouton de volume pour refléter l'état actuel
    volumeButton.style.backgroundImage = unmuteImg;

    // Mise à jour du volumeslider
    currentVolumeValue = volumeSlider.value;
    volumeSlider.value = 0;
    updateVolumeSlider();
  }
});

// Contrôle du volume du player en fonction du slider
volumeSlider.addEventListener("input", function () {
  audioPlayer.volume = volumeSlider.value / 100;
  updateVolumeSlider();
});


// Mise à jour visuel des barre de volume et du track
function updateVolumeSlider() {
  var progress = (volumeSlider.value / volumeSlider.max) * 100;
  volumeSlider.style.background = `linear-gradient(to right, var(--bar-color) 0%, var(--bar-color) ${progress}%, #333 ${progress}%, #333 100%)`;
}

function updateTrackSlider(){
  if (audioPlayer.currentTime != 0) {
    var progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + "%";
  } else {
    progressBar.style.width = 0;
  }
}
