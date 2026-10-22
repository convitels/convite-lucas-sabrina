/*
  ============================================================
  CONFIGURAÇÃO DO CONVITE
  ============================================================
  1) Coloque suas 7 fotos em:
     assets/fotos/foto1.jpg ... foto7.jpg

  2) Troque PIX_KEY pela chave Pix real.

  3) Google Forms:
     - crie um Google Form com as perguntas do RSVP;
     - depois me envie o link do formulário;
     - com o link eu consigo te devolver este arquivo já configurado
       com os "entry IDs" corretos para gravar automaticamente.
  ============================================================
*/

const WEDDING_DATE = new Date("2026-12-12T17:00:00-03:00");

// PIX — código Pix Copia e Cola, sem valor definido.
const PIX_KEY = "00020126580014BR.GOV.BCB.PIX013679df1c72-e1f2-493a-945a-a453ba21d9cc5204000053039865802BR5925Sabrina Soares Nascimento6009SAO PAULO62140510ojDY1WeqGJ6304529F";

// Google Forms — deixe assim por enquanto.
// Quando você tiver o formulário, substitua pela URL de envio e IDs.
const GOOGLE_FORM = {
  enabled: true,
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfAsYKYq-1DK9y0AZJCbP_rNnaQdJWXhFOKtVFh-Ie_JMLjnw/formResponse",
  entries: {
    // Ordem usada para este teste: as cinco perguntas do formulário.
    nome: "entry.2068642048",
    presenca: "entry.647039986",
    acompanhantes: "entry.817963827",
    nomes_acompanhantes: "entry.849035358",
    mensagem: "entry.1811299348"
  }
};

// ------------------------------------------------------------
// Navegação horizontal
// ------------------------------------------------------------
const pages = [...document.querySelectorAll(".page")];
let currentPage = 0;
// O restaurante só fica disponível depois que a pessoa confirma a cerimônia.
let ceremonyConfirmed = false;
const restaurantPageIndex = pages.indexOf(document.querySelector("#restaurant"));

function showPage(index, direction = 1) {
  if (index < 0 || index >= pages.length || index === currentPage) return;
  if (index === restaurantPageIndex && !ceremonyConfirmed) return;

  pages.forEach((page, i) => {
    page.classList.remove("active", "previous");

    if (i === index) {
      page.classList.add("active");
    } else if (i < index) {
      page.classList.add("previous");
    }
  });

  currentPage = index;
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => showPage(currentPage + 1, 1));
});

document.querySelectorAll("[data-prev]").forEach(btn => {
  btn.addEventListener("click", () => showPage(currentPage - 1, -1));
});

// ------------------------------------------------------------
// Swipe no celular
// ------------------------------------------------------------
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;

  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) showPage(currentPage + 1, 1);
    else showPage(currentPage - 1, -1);
  }
}, { passive: true });

// ------------------------------------------------------------
// Countdown
// ------------------------------------------------------------
const countdownParts = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    Object.values(countdownParts).forEach(el => { if (el) el.textContent = "00"; });
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownParts.days.textContent = String(days).padStart(2, "0");
  countdownParts.hours.textContent = String(hours).padStart(2, "0");
  countdownParts.minutes.textContent = String(minutes).padStart(2, "0");
  countdownParts.seconds.textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ------------------------------------------------------------
// Fotos — 7 posições + cópia para looping contínuo
// ------------------------------------------------------------
const photoTrack = document.querySelector("#photoTrack");

const photos = [
  "assets/fotos/foto1.jpeg",
  "assets/fotos/foto2.jpeg",
  "assets/fotos/foto3.jpeg",
  "assets/fotos/foto4.jpeg",
  "assets/fotos/foto5.jpeg"
];

function createPhotoCard(src, index) {
  const card = document.createElement("div");
  card.className = "photo-card";

  const img = document.createElement("img");
  img.src = src;
  img.alt = `Foto do casal ${index + 1}`;
  img.loading = "lazy";

  img.onerror = () => {
    card.innerHTML = `<div class="photo-placeholder">COLOQUE A FOTO ${index + 1} AQUI</div>`;
  };

  card.appendChild(img);
  return card;
}

[...photos, ...photos].forEach((src, index) => {
  photoTrack.appendChild(createPhotoCard(src, index % photos.length));
});

// ------------------------------------------------------------
// PIX QR Code
// ------------------------------------------------------------
const qrEl = document.querySelector("#pixQr");

if (
  window.QRCode &&
  PIX_KEY &&
  PIX_KEY !== "SUA-CHAVE-PIX-AQUI"
) {
  qrEl.innerHTML = "";
  new QRCode(qrEl, {
    text: PIX_KEY,
    width: 190,
    height: 190,
    correctLevel: QRCode.CorrectLevel.M
  });
}

// ------------------------------------------------------------
// Copiar chave Pix
// ------------------------------------------------------------
const copyPix = document.querySelector("#copyPix");
const copyFeedback = document.querySelector("#copyFeedback");

copyPix.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    copyFeedback.textContent = "Pix copiado!";
  } catch {
    copyFeedback.textContent = "Não foi possível copiar automaticamente.";
  }

  setTimeout(() => {
    copyFeedback.textContent = "";
  }, 2500);
});

// ------------------------------------------------------------
// RSVP — Google Forms
// ------------------------------------------------------------
const rsvpForm = document.querySelector("#rsvpForm");
const formStatus = document.querySelector("#formStatus");
const presenceSelect = rsvpForm.querySelector('[name="presenca"]');
const extraRsvpFields = document.querySelector("#extraRsvpFields");
const submitRsvp = document.querySelector("#submitRsvp");

function updateRsvpFields() {
  const showExtras = presenceSelect.value === "Sim, estarei presente";
  extraRsvpFields.hidden = !showExtras;

  extraRsvpFields.querySelectorAll("input, textarea").forEach(field => {
    field.required = false;
    if (!showExtras) field.value = field.type === "number" ? "0" : "";
  });

  if (submitRsvp) {
    submitRsvp.textContent = presenceSelect.value === "Não poderei comparecer"
      ? "NÃO VOU PODER COMPARECER"
      : "CONFIRMAR PRESENÇA";
  }
}

presenceSelect.addEventListener("change", updateRsvpFields);
updateRsvpFields();

rsvpForm.addEventListener("submit", async event => {
  event.preventDefault();

  const data = new FormData(rsvpForm);
  const isPresent = data.get("presenca") === "Sim, estarei presente";
  ceremonyConfirmed = isPresent;

  formStatus.textContent = "Enviando sua confirmação...";
  submitRsvp.disabled = true;

  if (GOOGLE_FORM.enabled) {
    // Envio nativo em formulário oculto + iframe.
    // Isso evita CORS/fetch e mantém o Google Forms invisível para o convidado.
    const iframeName = "googleFormsHiddenTarget";
    let iframe = document.getElementById(iframeName);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = iframeName;
      iframe.name = iframeName;
      iframe.title = "";
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.position = "fixed";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.opacity = "0";
      iframe.style.pointerEvents = "none";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }

    const hiddenForm = document.createElement("form");
    hiddenForm.method = "POST";
    hiddenForm.action = GOOGLE_FORM.actionUrl;
    hiddenForm.target = iframeName;
    hiddenForm.acceptCharset = "UTF-8";
    hiddenForm.style.display = "none";

    Object.entries(GOOGLE_FORM.entries).forEach(([field, entryId]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = entryId;
      input.value = data.get(field) ?? "";
      hiddenForm.appendChild(input);
    });

    // O Google Forms usa o histórico de páginas para validar respostas
    // de seções condicionais. Sem isso, campos de seções posteriores
    // podem ser ignorados mesmo quando os entry IDs estão corretos.
    const pageHistory = document.createElement("input");
    pageHistory.type = "hidden";
    pageHistory.name = "pageHistory";
    pageHistory.value = isPresent ? "0,1" : "0,2";
    hiddenForm.appendChild(pageHistory);

    const fvv = document.createElement("input");
    fvv.type = "hidden";
    fvv.name = "fvv";
    fvv.value = "1";
    hiddenForm.appendChild(fvv);

    document.body.appendChild(hiddenForm);
    // Não use hiddenForm.submit() aqui: o Google Forms usa um campo chamado
    // "submit", que pode sobrescrever o método submit() do elemento.
    HTMLFormElement.prototype.submit.call(hiddenForm);
    hiddenForm.remove();
  }

  // Dá tempo para o envio ao Forms ser iniciado antes de mudar de página.
  setTimeout(() => {
    const responsePage = document.querySelector("#responseYes");
    const responseTitle = document.querySelector("#responseTitle");
    const responseText = document.querySelector("#responseText");

    const pixAfterConfirmation = document.querySelector("#pixAfterConfirmation");
    const backToInvitation = document.querySelector("#backToInvitation");
    const goToRestaurant = document.querySelector("#goToRestaurant");

    if (goToRestaurant) goToRestaurant.hidden = !isPresent;

    if (!isPresent) {
      responseTitle.textContent = "Sentiremos a sua falta!";
      responseText.textContent = "Agradecemos por nos avisar. Mesmo de longe, você estará presente em nossos pensamentos nesse dia tão especial.";
      pixAfterConfirmation.hidden = false;
    } else {
      responseTitle.textContent = "Aguardamos você!";
      responseText.textContent = "Será uma alegria celebrar esse momento tão especial ao seu lado. Nos vemos no nosso grande dia!";
      pixAfterConfirmation.hidden = false;
    }

    rsvpForm.reset();
    updateRsvpFields();
    formStatus.textContent = "";
    submitRsvp.disabled = false;

    const targetIndex = pages.indexOf(responsePage);
    if (targetIndex !== -1) showPage(targetIndex, 1);
  }, 700);
});

// Retorno à primeira página do convite após a confirmação.
document.querySelector("#backToInvitation").addEventListener("click", () => {
  showPage(0, -1);
});

// A aba da comemoração só é aberta para quem confirmou presença na cerimônia.
document.querySelector("#goToRestaurant").addEventListener("click", () => {
  const restaurantIndex = pages.indexOf(document.querySelector("#restaurant"));
  if (restaurantIndex !== -1) showPage(restaurantIndex, 1);
});

// Exibe a quantidade de pessoas apenas para quem pretende ir ao restaurante.
const restaurantForm = document.querySelector("#restaurantForm");
const restaurantPresence = restaurantForm.querySelector('[name="presenca_restaurante"]');
const restaurantGuestsWrap = document.querySelector("#restaurantGuestsWrap");
const restaurantStatus = document.querySelector("#restaurantStatus");
const restaurantQuantity = restaurantForm.querySelector('[name="quantidade_restaurante"]');
function updateRestaurantFields() {
  const willAttend = restaurantPresence.value === "Sim, estarei no Pampeiros";
  restaurantGuestsWrap.hidden = !willAttend;
  restaurantQuantity.required = willAttend;
  if (!willAttend) restaurantQuantity.value = "";
}
restaurantPresence.addEventListener("change", updateRestaurantFields);
updateRestaurantFields();

// Google Forms da comemoração no Pampeiros. IDs obtidos pelo link pré-preenchido.
const RESTAURANT_GOOGLE_FORM = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSendu71iWJONqxbBZFaim8wWQCyhyWaSFeyMsb_x7u3FPhkvg/formResponse",
  entries: {
    nome_restaurante: "entry.2126954685",
    presenca_restaurante: "entry.1395836799",
    quantidade_restaurante: "entry.1051559385"
  }
};

// Envia a confirmação para o Google Forms sem mostrar o formulário original.
restaurantForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(restaurantForm);
  const willAttend = data.get("presenca_restaurante") === "Sim, estarei no Pampeiros";
  const quantity = data.get("quantidade_restaurante");

  if (willAttend && !quantity) {
    restaurantStatus.textContent = "Selecione quantas pessoas irão ao restaurante.";
    return;
  }

  restaurantStatus.textContent = "Enviando sua resposta...";
  const iframeName = "restaurantGoogleFormsHiddenTarget";
  let iframe = document.getElementById(iframeName);
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = iframeName;
    iframe.name = iframeName;
    iframe.title = "";
    iframe.setAttribute("aria-hidden", "true");
    Object.assign(iframe.style, {position:"fixed", width:"1px", height:"1px", opacity:"0", pointerEvents:"none", border:"0"});
    document.body.appendChild(iframe);
  }

  const hiddenForm = document.createElement("form");
  hiddenForm.method = "POST";
  hiddenForm.action = RESTAURANT_GOOGLE_FORM.actionUrl;
  hiddenForm.target = iframeName;
  hiddenForm.acceptCharset = "UTF-8";
  hiddenForm.style.display = "none";

  const values = {
    nome_restaurante: data.get("nome_restaurante"),
    presenca_restaurante: willAttend ? "Sim" : "Não",
    // O link pré-preenchido confirmou que a primeira opção de quantidade usa o valor "1".
    quantidade_restaurante: willAttend ? ({"1 pessoa":"1", "2 pessoas":"2", "3 pessoas":"3", "4 pessoas":"4", "5 pessoas ou mais":"5"}[quantity] || quantity) : ""
  };
  Object.entries(RESTAURANT_GOOGLE_FORM.entries).forEach(([field, entryId]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = entryId;
    input.value = values[field] ?? "";
    hiddenForm.appendChild(input);
  });

  // Se a pessoa não vai, ela encerra na primeira seção; se vai, segue para a segunda.
  const pageHistory = document.createElement("input");
  pageHistory.type = "hidden";
  pageHistory.name = "pageHistory";
  pageHistory.value = willAttend ? "0,1" : "0";
  hiddenForm.appendChild(pageHistory);
  const fvv = document.createElement("input");
  fvv.type = "hidden";
  fvv.name = "fvv";
  fvv.value = "1";
  hiddenForm.appendChild(fvv);

  document.body.appendChild(hiddenForm);
  HTMLFormElement.prototype.submit.call(hiddenForm);
  hiddenForm.remove();

  restaurantStatus.textContent = "Resposta enviada! Obrigado por nos ajudar a organizar a comemoração. 💙";
  restaurantForm.reset();
  updateRestaurantFields();
});
