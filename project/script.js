// Audio-Elemente
const shotSound = document.createElement("audio");
const reloadSound = document.createElement("audio");
document.body.append(shotSound, reloadSound);

// -----------------------
// Navbar-Verkleinerung und Booking Panel (bestehender Code)
// -----------------------

// scroll shrink der Navbar und Logo
window.addEventListener("scroll", function () {
    const navBar = document.getElementById("navBarBackground");
    if (window.scrollY > 50) {  // Schwellwert; kann angepasst werden
        navBar.classList.add("shrink");
    } else {
        navBar.classList.remove("shrink");
    }
});
//-----------------//
//  Booking Panel  //
//  + FullCalendar //
//-----------------//
document.addEventListener("DOMContentLoaded", function () {
    // DOM-Elemente
    const mapImage = document.getElementById("campingMap");
    const bookingPanel = document.getElementById("bookingPanel");
    const addBookingButton = document.getElementById("addBooking");
    const bookingMessage = document.getElementById("bookingMessage");
    const bookingTableBody = document.querySelector("#bookingTable tbody");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const purchaseInput = document.getElementById("purchase");

    // bookings aus LocalStorage oder leeres Array
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // 1) Tabellen- und Kalender-Update Funktion
    function displayBookings() {
        // Tabelle füllen
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

        // Kalender-Events neu setzen
        if (window.calendar) {
            const events = bookings.map(b => ({
                title: b.purchase,
                start: b.startDate,
                end: new Date(new Date(b.endDate).getTime() + 86400000)
                    .toISOString().split('T')[0],
                allDay: true,
                backgroundColor: '#007BFF',
                borderColor: '#0056b3'
            }));
            window.calendar.removeAllEvents();
            window.calendar.addEventSource(events);
        }
    }

    // 2) Panel ein-/ausblenden
    mapImage.addEventListener("click", () => {
        bookingPanel.classList.toggle("active");
    });

    // 3) Neue Buchung anlegen
    addBookingButton.addEventListener("click", () => {
        const start = startDateInput.value;
        const end = endDateInput.value;
        const purchase = purchaseInput.value.trim();

        // Validierung
        if (!start || !end || !purchase) {
            bookingMessage.textContent = "Bitte alle Felder ausfüllen.";
            return;
        }

        // Buchung speichern
        bookings.push({ startDate: start, endDate: end, purchase });
        localStorage.setItem("bookings", JSON.stringify(bookings));
        bookingMessage.textContent = "Buchung gespeichert!";

        // Formular zurücksetzen und Anzeige updaten
        startDateInput.value = "";
        endDateInput.value = "";
        purchaseInput.value = "";
        displayBookings();
    });

    // 4) FullCalendar initialisieren
    const calendarEl = document.getElementById("fc-calendar");
    if (calendarEl && typeof FullCalendar !== "undefined") {
        window.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'de',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            events: bookings.map(b => ({
                title: b.purchase,
                start: b.startDate,
                end: new Date(new Date(b.endDate).getTime() + 86400000)
                    .toISOString().split('T')[0],
                allDay: true,
                backgroundColor: '#007BFF',
                borderColor: '#0056b3'
            })),
            dateClick: info => {
                // Formular vorbefüllen bei Klick
                startDateInput.value = info.dateStr;
                endDateInput.value = info.dateStr;
                bookingMessage.textContent = "";
            }
        });
        window.calendar.render();
    }

    // Initiale Anzeige
    displayBookings();
});

// -----------------------
// Back-to-Top-Button
// -----------------------
document.addEventListener("DOMContentLoaded", function () {
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

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// -----------------------
// Fade-In-Effekt für Bilder (benötigt Klasse "fade-in" in HTML)
// -----------------------
document.addEventListener("DOMContentLoaded", function () {
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

// ============================
// Erleben-Seite: Magnetisches, endloses Carousel + Modal-Popup
// ============================

// Erleben-Seite: Endlos-Carousel mit Magnet-Snapping, Auto-Scroll & Modal-Popup

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector('.scroll-container');
  if (container) {
    // Basis-Items
    const originalItems = Array.from(container.querySelectorAll('.scroll-item'));
    const gap = 60; // passt zum CSS gap
    const itemWidth = originalItems[0].getBoundingClientRect().width + gap;
    const count = originalItems.length;

    // Klone vor und hinter Original-Items für endlos
    originalItems.slice().reverse()
      .forEach(el => container.insertBefore(el.cloneNode(true), container.firstChild));
    originalItems.forEach(el => container.appendChild(el.cloneNode(true)));

    // Startposition: Mitte der Originale
    container.scrollLeft = itemWidth * count;

    const items = Array.from(container.querySelectorAll('.scroll-item'));
    let autoTimer;

    // Magnet-Snapping & 3D-Klassen
    function updateActive() {
      const centerX = container.scrollLeft + container.offsetWidth / 2;
      let closestIdx = 0, minDist = Infinity;
      items.forEach((item, idx) => {
        item.classList.remove('prev','active','next');
        const rect = item.getBoundingClientRect();
        const offset = container.getBoundingClientRect().left;
        const itemCenter = rect.left + rect.width/2 - offset + container.scrollLeft;
        const dist = Math.abs(itemCenter - centerX);
        if (dist < minDist) { minDist = dist; closestIdx = idx; }
      });
      const active = items[closestIdx];
      active.classList.add('active');
      if (items[closestIdx-1]) items[closestIdx-1].classList.add('prev');
      if (items[closestIdx+1]) items[closestIdx+1].classList.add('next');
      // Magnet: zentriere automatisch
      container.scrollTo({ left: active.offsetLeft - container.offsetWidth/2 + active.offsetWidth/2, behavior: 'smooth' });
    }

    // Initial und Scroll-Event
    updateActive();
    container.addEventListener('scroll', () => {
      clearTimeout(autoTimer);
      clearTimeout(scrollTimer);
      autoTimer = setTimeout(updateActive, 200);
    });

    // Auto-Scroll alle 3s
    setInterval(() => {
      container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }, 3000);

    // Pfeiltasten Navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      }
    });

    // Loop Reset (debounced)
    let scrollTimer;
    container.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft < itemWidth * 0.5) {
          container.scrollLeft += itemWidth * count;
        } else if (container.scrollLeft > maxScroll - itemWidth * 0.5) {
          container.scrollLeft -= itemWidth * count;
        }
      }, 400);
    });
  }

  // Modal-Popup für Attraktionsbilder
  const scrollImgs = document.querySelectorAll('.scroll-item img');
  if (scrollImgs.length) {
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.style.cssText = 
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:rgba(0,0,0,0.8);display:none;justify-content:center;align-items:center;z-index:3000;';
    modal.innerHTML =
      '<span id="closeModal" style="position:absolute;top:20px;right:30px;font-size:40px;cursor:pointer;color:#fff;">&times;</span>' +
      '<div id="modalContent"></div>';
    document.body.appendChild(modal);

    scrollImgs.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        const content = modal.querySelector('#modalContent');
        content.innerHTML =
          `<img src="${img.src}" alt="${img.alt}" style="max-width:90%;max-height:90%;border-radius:8px;">` +
          `<p style="color:#fff;text-align:center;margin-top:12px;">${img.alt}</p>`;
        modal.style.display = 'flex';
      });
    });

    modal.querySelector('#closeModal').addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
  }
});


//   **************************************************************
//   MiniGame-Funktionalität inkl. Sound
//   **************************************************************  

document.addEventListener("DOMContentLoaded", function () {

    // --- 1) Revolver-Selector ---
    let selectedRevolver = null;
    const revolverSelector = document.getElementById("revolverSelector");
    const revolverOptions = document.querySelectorAll(".revolver-option");
    revolverOptions.forEach(opt => {
        opt.addEventListener("click", () => {
            // Auswahl hervorheben
            revolverOptions.forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");

            // Gewählten Revolver merken
            selectedRevolver = opt.dataset.id;

            // Schuss-Sound setzen
            shotSound.src = `audio/${selectedRevolver}.mp3`;
            shotSound.volume = 0.6;

            // Nachlade-Sound abspielen
            reloadSound.src = `audio/reload.mp3`;
            reloadSound.volume = 1.0;
            reloadSound.currentTime = 0;
            reloadSound.play();
        });
    });


    // --- 3) MiniGame-Container prüfen ---
    const minigameContainer = document.getElementById("minigameContainer");
    if (!minigameContainer) return;

    // --- 4) Elemente festlegen ---
    const startBtn = document.getElementById("startMinigame");
    const countdownEl = document.getElementById("countdown");
    const gameArea = document.getElementById("gameArea");
    const resultEl = document.getElementById("result");
    const plates = document.querySelectorAll(".game-plate");
    let reactionTimes = [];
    let remainingPlates = [];

    // --- 5) Start-Button: Revolver-Menü ausblenden & Countdown ---
    startBtn.addEventListener("click", () => {
        if (!selectedRevolver) {
            alert("Bitte wähle zuerst einen Revolver aus!");
            return;
        }
        // Revolver-Auswahl verbergen
        revolverSelector.style.display = "none";

        // Countdown starten
        startBtn.classList.add("hidden");
        countdownEl.classList.remove("hidden");
        gameArea.classList.add("countdown-mode");

        let count = 3;
        countdownEl.textContent = "GET READY " + count;
        const interval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownEl.textContent = "GET READY " + count;
            } else {
                clearInterval(interval);
                countdownEl.classList.add("hidden");
                gameArea.classList.remove("countdown-mode");
                startGame();
            }
        }, 1000);
    });

    // --- 6) Spielstart: Platten-Array initialisieren ---
    function startGame() {
        gameArea.classList.remove("hidden");
        reactionTimes = [];
        remainingPlates = Array.from({ length: plates.length }, (_, i) => i);
        activateNextPlate();
    }

    // --- 7) Nächste Platte aktivieren (zufällig) ---
    function activateNextPlate() {
        // Reset aller Platten
        plates.forEach(p => {
            p.classList.remove("active");
            delete p.dataset.clicked; 
        });
        // Alle durch – Ergebnis anzeigen
        if (remainingPlates.length === 0) {
            showResult();
            return;
        }
        // Zufällig eine Platte auswählen
        const rnd = Math.floor(Math.random() * remainingPlates.length);
        const idx = remainingPlates.splice(rnd, 1)[0];
        const delay = Math.random() * 2000 + 2000; // 2–4 Sek.

        setTimeout(() => {
            const plate = plates[idx];
            plate.classList.add("active");
            plate.dataset.activationTime = Date.now();
        }, delay);
    }

    // --- 8) Klick-Handler: Sound & Timing ---
    plates.forEach(plate => {
        plate.addEventListener("click", function (e) {
            if (plate.classList.contains("active") && !plate.dataset.clicked) {
                // 1) Einschussloch erzeugen

                const hole = document.createElement("img");
                hole.src = "imgaes/WEAPONS/bulletHole.png";
                hole.className = "bullet-hole";
                // Position relativ zur Platte
                const rect = plate.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
            
                hole.style.left = `${x}px`;
                hole.style.top = `${y}px`;
                plate.appendChild(hole);

                // 2) Schuss-Sound abspielen
                if (shotSound.src) {
                    shotSound.currentTime = 0;
                    shotSound.play();
                }

                // 3) Reaktionszeit messen
                const rt = Date.now() - Number(plate.dataset.activationTime);
                reactionTimes.push(rt);

                plate.dataset.clicked = "true";
                plate.classList.remove("active");

                activateNextPlate();
            }
        });
    });
    
    // --- 9) Ergebnis anzeigen & Restart-Button ---
    function showResult() {
        gameArea.classList.add("hidden");
        resultEl.classList.remove("hidden");

        const avg = Math.round(
            reactionTimes.reduce((sum, t) => sum + t, 0) / reactionTimes.length
        );

        resultEl.innerHTML = `
        <p>Game Over! Deine durchschnittliche Reaktionszeit: <strong>${avg} ms</strong></p>
        <button id="restartBtn">Nochmal spielen</button>
      `;
        document
            .getElementById("restartBtn")
            .addEventListener("click", () => location.reload());
    }
});