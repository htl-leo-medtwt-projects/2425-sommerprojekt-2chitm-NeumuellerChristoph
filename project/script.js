// scroll shrink
window.addEventListener("scroll", function() {
    const navBar = document.getElementById("navBarBackground");
    if(window.scrollY > 50) {  // Schwellwert; kann angepasst werden
        navBar.classList.add("shrink");
    } else {
        navBar.classList.remove("shrink");
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const mapImage = document.getElementById("campingMap");
    const bookingPanel = document.getElementById("bookingPanel");
    const addBookingButton = document.getElementById("addBooking");
    const bookingMessage = document.getElementById("bookingMessage");
    const bookingList = document.getElementById("bookingList");
  
    // Panel ein-/ausblenden
    mapImage.addEventListener("click", function() {
      bookingPanel.classList.toggle("active");
    });
  
    // Bestehende Buchungen laden
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    function displayBookings() {
      bookingList.innerHTML = "";
      bookings.forEach(booking => {
        let li = document.createElement("li");
        li.textContent = `${booking.date} - ${booking.description}`;
        bookingList.appendChild(li);
      });
    }
    displayBookings();
  
    // Neue Buchung hinzufügen, wenn Datum frei ist
    addBookingButton.addEventListener("click", function(){
      const dateInput = document.getElementById("bookingDate").value;
      const descriptionInput = document.getElementById("bookingDescription").value.trim();
  
      if (!dateInput || !descriptionInput) {
        bookingMessage.textContent = "Bitte Datum und Beschreibung eingeben.";
        return;
      }
      if (bookings.some(booking => booking.date === dateInput)) {
        bookingMessage.textContent = "Dieser Termin ist bereits belegt.";
        return;
      }
      const newBooking = { date: dateInput, description: descriptionInput };
      bookings.push(newBooking);
      localStorage.setItem("bookings", JSON.stringify(bookings));
      bookingMessage.textContent = "Buchung erfolgreich!";
      displayBookings();
    });
  });
  