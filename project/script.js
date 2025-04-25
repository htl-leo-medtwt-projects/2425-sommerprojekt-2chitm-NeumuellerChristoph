// -----------------------
// Navbar-Verkleinerung und Booking Panel (bestehender Code)
// -----------------------

// scroll shrink der Navbar und Logo
window.addEventListener("scroll", function() {
    const navBar = document.getElementById("navBarBackground");
    if (window.scrollY > 50) {  // Schwellwert; kann angepasst werden
        navBar.classList.add("shrink");
    } else {
        navBar.classList.remove("shrink");
    }
});

//-----------------//
//  Booking Panel  //
//-----------------//
document.addEventListener("DOMContentLoaded", function () {
    // DOM-Elemente
    const mapImage          = document.getElementById("campingMap");
    const bookingPanel      = document.getElementById("bookingPanel");
    const addBookingButton  = document.getElementById("addBooking");
    const bookingMessage    = document.getElementById("bookingMessage");
    const bookingTableBody  = document.querySelector("#bookingTable tbody");
    const startDateInput    = document.getElementById("startDate");
    const endDateInput      = document.getElementById("endDate");
    const purchaseInput     = document.getElementById("purchase");
  
    // bookings aus LocalStorage oder leeres Array
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  
    // Tabelle füllen
    function displayBookings() {
      bookingTableBody.innerHTML = "";
      bookings.forEach(b => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${b.startDate}</td>
          <td>${b.endDate}</td>
          <td>${b.purchase}</td>
        `;
        bookingTableBody.appendChild(tr);
      });
    }
    displayBookings();
  
    // Panel ein-/ausblenden
    mapImage.addEventListener("click", () => {
      bookingPanel.classList.toggle("active");
    });
  
    // Neue Buchung speichern
    addBookingButton.addEventListener("click", () => {
      const start    = startDateInput.value;
      const end      = endDateInput.value;
      const purchase = purchaseInput.value.trim();
  
      // Validierung
      if (!start || !end || !purchase) {
        bookingMessage.textContent = "Bitte alle Felder ausfüllen.";
        return;
      }
  
      // Speichern
      bookings.push({ startDate: start, endDate: end, purchase });
      localStorage.setItem("bookings", JSON.stringify(bookings));
      bookingMessage.textContent = "Buchung gespeichert!";
  
      // Formular zurücksetzen und Tabelle neu laden
      startDateInput.value  = "";
      endDateInput.value    = "";
      purchaseInput.value   = "";
      displayBookings();
    });
  });
  
// -----------------------
// Back-to-Top-Button
// -----------------------
document.addEventListener("DOMContentLoaded", function() {
    const backToTop = document.createElement('button');
    backToTop.id = "backToTop";
    backToTop.textContent = "↑";
    document.body.appendChild(backToTop);

    // Inline-Styles; alternativ per CSS definieren
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '20px';
    backToTop.style.right = '20px';
    backToTop.style.display = 'none';
    backToTop.style.padding = '10px';
    backToTop.style.fontSize = '24px';
    backToTop.style.cursor = 'pointer';
    backToTop.style.zIndex = '3000';

    window.addEventListener("scroll", function() {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", function() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// -----------------------
// Fade-In-Effekt für Bilder (benötigt Klasse "fade-in" in HTML)
// -----------------------
document.addEventListener("DOMContentLoaded", function() {
    const fadeInElements = document.querySelectorAll("img.fade-in");
    if (fadeInElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    }
});

// -----------------------
// Modal-Popup für Attraktionsbilder (auf erleben.html)
// -----------------------
document.addEventListener("DOMContentLoaded", function() {
    const scrollItems = document.querySelectorAll(".scroll-item img");
    if (scrollItems.length) {
        // Modal erstellen
        const modal = document.createElement("div");
        modal.id = "imageModal";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0, 0, 0, 0.8)";
        modal.style.display = "none";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.zIndex = "3000";
        modal.innerHTML = '<span id="closeModal" style="position:absolute; top:20px; right:30px; font-size:40px; cursor:pointer; color:#fff;">&times;</span><div id="modalContent"></div>';
        document.body.appendChild(modal);

        scrollItems.forEach(img => {
            img.style.cursor = "pointer";
            img.addEventListener("click", function() {
                const modalContent = document.getElementById("modalContent");
                modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:90%; max-height:90%;"> <p style="color:#fff; text-align:center;">${img.alt}</p>`;
                modal.style.display = "flex";
            });
        });

        const closeModal = document.getElementById("closeModal");
        closeModal.addEventListener("click", function() {
            modal.style.display = "none";
        });

        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});

//   **************************************************************
//   MiniGame-Funktionalität (nur auf der MiniGame-Seite ausführen)
//   **************************************************************

// MiniGame-Funktionalität (nur auf der MiniGame-Seite ausführen)
document.addEventListener("DOMContentLoaded", function() {
    const minigameContainer = document.getElementById("minigameContainer");
    if (!minigameContainer) return;
    
    const startBtn = document.getElementById("startMinigame");
    const countdownEl = document.getElementById("countdown");
    const gameArea = document.getElementById("gameArea");
    const resultEl = document.getElementById("result");
    const plates = document.querySelectorAll(".game-plate");
    
    let reactionTimes = [];
    let remainingPlateIndices = [];

    // Starte den Countdown (3, 2, 1)
    function startCountdown() {
        
        gameArea.classList.add("countdown-mode");
        startBtn.classList.add("hidden");
        countdownEl.classList.remove("hidden");
        let count = 3;
        countdownEl.textContent = "GET READY " + count;
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = "GET READY " + count;
            } else {
                clearInterval(countdownInterval);
                countdownEl.classList.add("hidden");
                
                gameArea.classList.remove("countdown-mode");
                startGame();
            }
        }, 1000);
    }

    // Spielstart: Initialisiere den Array der verfügbaren Platten
    function startGame() {
        gameArea.classList.remove("hidden");
        reactionTimes = [];
        remainingPlateIndices = Array.from({length: plates.length}, (_, i) => i);
        activateNextPlate();
    }

    // Aktiviert zufällig eine Platte aus den noch verfügbaren
    function activateNextPlate() {
        plates.forEach(plate => {
            plate.classList.remove("active");
            plate.dataset.clicked = "";
        });
        if (remainingPlateIndices.length === 0) {
            showResult();
            return;
        }
        // Zufällige Auswahl aus den verbleibenden Platten
        const randomIndex = Math.floor(Math.random() * remainingPlateIndices.length);
        const chosenPlateIndex = remainingPlateIndices[randomIndex];
        remainingPlateIndices.splice(randomIndex, 1);
        
        const delay = Math.random() * 2000 + 2000;
        setTimeout(() => {
            const activePlate = plates[chosenPlateIndex];
            activePlate.classList.add("active");
            activePlate.dataset.activationTime = Date.now();
        }, delay);
    }


    // Klick-Ereignis: Reagiere nur, wenn die angeklickte Platte gerade aktiv ist
    plates.forEach((plate, index) => {
        plate.addEventListener("click", function() {
            if (plate.classList.contains("active") && !plate.dataset.clicked) {
                const reactionTime = Date.now() - Number(plate.dataset.activationTime);
                reactionTimes.push(reactionTime);
                plate.dataset.clicked = "true";
                plate.classList.remove("active");
                
                activateNextPlate();
            }
        });
    });

    // Zeige das Ergebnis, wenn alle Platten abgeschossen wurden
    function showResult() {
        gameArea.classList.add("hidden");
        resultEl.classList.remove("hidden");
        const avgTime = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
        resultEl.textContent = "Game Over! Your average reaction time: " + avgTime + " ms";
    }

    startBtn.addEventListener("click", startCountdown);
});
