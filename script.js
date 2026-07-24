let currentScene = 0;
let userCharType = '';
let visitedSalons = [false, false, false, false, false, false];

const dialogTexts = [
  "Les vamos a presentar nuestra academia.", // 0: Escena 1 (Logo)
  "Este es el póster oficial de nuestra academia.", // 1: Escena 2 (Póster)
  "Por favor, inspecciona cada uno de nuestros salones.", // 2: Escena 3 (Salones intro)
  "Gracias por ver nuestra academia." // 3: Escena 4 (Final)
];

function updateCharacterExpression(expr) {
  const imgEl = document.getElementById('character-img');
  imgEl.src = `skyns/${userCharType}_${expr}.svg`;
}

function startApp() {
  // Reproducir música tras la interacción del usuario
  const bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.4;
  bgMusic.play().catch(e => console.log("Audio autoplay prevented", e));

  // Cambiar a la escena de selección de personajes (Scene 0)
  document.getElementById('scene-start').classList.add('hidden');
  document.getElementById('scene-start').classList.remove('active');
  
  const scene0 = document.getElementById('scene-0');
  scene0.classList.remove('hidden');
  scene0.classList.add('active');
}

function selectCharacter(charType) {
  userCharType = charType;
  updateCharacterExpression('neutral');
  document.getElementById('character-container').classList.remove('hidden');

  switchScene(0, 1);
}

function switchScene(from, to) {
  document.getElementById(`scene-${from}`).classList.add('hidden');
  document.getElementById(`scene-${from}`).classList.remove('active');
  
  const toScene = document.getElementById(`scene-${to}`);
  toScene.classList.remove('hidden');
  toScene.classList.add('active');

  handleSceneLogic(to);
}

function handleSceneLogic(sceneNum) {
  currentScene = sceneNum;
  const characterDiv = document.getElementById('character-container');

  if (sceneNum === 1) {
    // Escena del logo
    characterDiv.style.transform = 'translate(100px, -50px) scale(1.2)';
    updateCharacterExpression('speaking');
    showDialog(0, () => {
      updateCharacterExpression('neutral');
      const logoImg = document.getElementById('logo-img');
      logoImg.classList.add('zoom-in');
      setTimeout(() => {
        switchScene(1, 2);
      }, 2500);
    });
  } 
  else if (sceneNum === 2) {
    // Escena del poster
    characterDiv.style.transform = 'translate(50px, -20px) scale(1)';
    updateCharacterExpression('speaking');
    showDialog(1, () => {
      updateCharacterExpression('neutral');
      switchScene(2, 3);
    });
  }
  else if (sceneNum === 3) {
    // Escena de salones (obligatorio)
    characterDiv.style.transform = 'translate(50px, -20px) scale(1)';
    updateCharacterExpression('speaking');
    showDialog(2, () => {
      updateCharacterExpression('neutral');
      hideDialog();
    });
  }
  else if (sceneNum === 4) {
    // Escena final
    characterDiv.style.transform = 'translate(150px, -50px) scale(1.5)';
    updateCharacterExpression('happy');
    showDialog(3, () => {
      hideDialog();
    });
  }
}

function showDialog(step, nextCallback) {
  const overlay = document.getElementById('dialog-overlay');
  const textEl = document.getElementById('dialog-text');
  const btn = document.getElementById('next-action-btn');

  textEl.innerText = dialogTexts[step];
  overlay.classList.remove('hidden');

  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  newBtn.addEventListener('click', () => {
    hideDialog();
    nextCallback();
  });
}

function hideDialog() {
  document.getElementById('dialog-overlay').classList.add('hidden');
}

// Lógica de Salones
function visitSalon(num, imageSrc) {
  visitedSalons[num - 1] = true;
  document.getElementById(`salon-${num}`).classList.add('visited');
  updateCharacterExpression('happy');

  const modal = document.getElementById('salon-modal');
  const title = document.getElementById('modal-title');
  const imgContainer = document.getElementById('modal-image-container');

  title.innerText = `Salón ${num}`;
  if (imageSrc) {
    imgContainer.innerHTML = `<img src="${imageSrc}" alt="Salón ${num}">`;
  } else {
    imgContainer.innerHTML = `<p class="placeholder-text">Aún no hay descubrimientos en este salón...</p>`;
  }

  modal.classList.remove('hidden');
  checkAllVisited();
}

function closeSalonModal() {
  document.getElementById('salon-modal').classList.add('hidden');
  updateCharacterExpression('neutral');
}

function checkAllVisited() {
  // Ya no ocultamos el botón, así que esta función puede quedar vacía o usarse para otro efecto visual
}

function finishSalons() {
  if (visitedSalons.every(val => val === true)) {
    switchScene(3, 4);
  } else {
    // Show custom alert via dialog
    updateCharacterExpression('speaking');
    
    const overlay = document.getElementById('dialog-overlay');
    const textEl = document.getElementById('dialog-text');
    const btn = document.getElementById('next-action-btn');

    textEl.innerText = "¡Espera! Aún te faltan salones por visitar. Explóralos todos para continuar.";
    overlay.classList.remove('hidden');

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    
    newBtn.addEventListener('click', () => {
      hideDialog();
      updateCharacterExpression('neutral');
    });
  }
}

// (El oyente global de clics fue eliminado a favor de la pantalla de inicio 'startApp')
