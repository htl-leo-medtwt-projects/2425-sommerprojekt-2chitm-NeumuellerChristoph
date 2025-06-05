const foods = [
    {
      id: 1,
      name: "Salt Pork and Beans",
      image: "imgaes/food/salt_pork_beans.png",
      category: "Hauptgericht",
      price: 4.00,
      description: "Gesalzener Schweinebauch mit dicken Bohnen über dem Feuer geschmort."
    },
    {
      id: 2,
      name: "Johnnycake",
      image: "imgaes/food/johnnycake.png",
      category: "Beilage",
      price: 2.00,
      description: "Flacher Maisbrei-Kuchen, in der Pfanne gebraten – einfach und sättigend."
    },
    {
      id: 3,
      name: "Biscuits and Gravy",
      image: "imgaes/food/biscuits_gravy.png",
      category: "Beilage",
      price: 3.50,
      description: "Buttermilchbiscuits mit pfeffriger Soße aus Speckfett und Mehl."
    },
    {
      id: 4,
      name: "Pemmican",
      image: "imgaes/food/pemmican.png",
      category: "Snack",
      price: 2.50,
      description: "Trockengemisch aus getrocknetem Fleisch, Fett und Beeren – extrem nahrhaft."
    },
    {
      id: 5,
      name: "Buffalo Steak",
      image: "imgaes/food/buffalo_steak.png",
      category: "Hauptgericht",
      price: 10.00,
      description: "Wildbisonsteak, über offenem Feuer gegrillt, herzhaft und zart."
    },
    {
      id: 6,
      name: "Cherokee Stew",
      image: "imgaes/food/cherokee_stew.png",
      category: "Hauptgericht",
      price: 5.50,
      description: "Eintopf aus Wildgemüse, Mais und gelegentlich etwas Fleisch."
    },
    {
      id: 7,
      name: "Campfire Coffee",
      image: "imgaes/food/campfire_coffee.png",
      category: "Getränk",
      price: 1.50,
      description: "Starker schwarzer Kaffee, direkt im Topf über der Glut zubereitet."
    },
    {
      id: 8,
      name: "Sarsaparilla",
      image: "imgaes/food/sarsaparilla.png",
      category: "Hauptgericht",
      price: 7.75,
      description: "Leicht süßer, würziger Wildwurz-Softdrink, beliebt auf Saloons."
    },
    {
      id: 9,
      name: "Grilled Trout",
      image: "imgaes/food/grilled_trout.png",
      category: "Hauptgericht",
      price: 6.00,
      description: "Frisch gefangene Forelle, mit Salz und Kräutern über dem Feuer gegrillt."
    },
    {
      id: 10,
      name: "Corn Dodger",
      image: "imgaes/food/corn_dodger.png",
      category: "Snack",
      price: 2.00,
      description: "Maismehlklößchen, in Fett gebraten – knusprig außen, weich innen."
    },
    {
      id: 11,
      name: "Bear Stew",
      image: "imgaes/food/bear_stew.png",
      category: "Hauptgericht",
      price: 8.00,
      description: "Rustikaler Eintopf aus Bärenfleisch, Wildgemüse und Kräutern."
    },
    {
      id: 12,
      name: "Dried Fruit & Nuts",
      image: "imgaes/food/dried_fruit_nuts.png",
      category: "Snack",
      price: 2.25,
      description: "Getrocknete Beeren, Apfelringe und Nüsse – ideal für lange Ritte."
    }
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
  const listEl        = document.getElementById("foodList");
  const searchInput   = document.getElementById("searchInput");
  const categorySel   = document.getElementById("categoryFilter");
  const sortSel       = document.getElementById("sortSelect");

  // 2) Favoriten aus localStorage
  const FAVORITES_KEY = "kulinarikFavorites";
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  // 3) Funktion zum Umschalten
  function toggleFavorite(id) {
    const idx = favorites.indexOf(id);
    if (idx >= 0) favorites.splice(idx, 1);
    else           favorites.push(id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }

  // 4) Sortieren wie gehabt
  function sortFoods(arr) {
    /* … dein vorhandenes sortFoods … */
    const mode = sortSel.value;
    return arr.slice().sort((a,b) => {
      if (mode==="name-asc")  return a.name.localeCompare(b.name);
      if (mode==="name-desc") return b.name.localeCompare(a.name);
      if (mode==="price-asc") return a.price-b.price;
      if (mode==="price-desc")return b.price-a.price;
      return 0;
    });
  }

  // 5) Filter + Favoriten-Fall
  function updateView() {
    const q   = searchInput.value.trim().toLowerCase();
    const cat = categorySel.value;
    let filtered = foods.filter(f => {
      const byName = f.name.toLowerCase().includes(q);
      const byCat  = (cat==="all")
                   || (cat==="favorites" && favorites.includes(f.id))
                   || (f.category===cat);
      return byName && byCat;
    });
    filtered = sortFoods(filtered);
    render(filtered);
    
  }

  // 6) Rendering mit Sternchen
  function render(items) {
    listEl.innerHTML = "";
    items.forEach(f => {
      const isFav = favorites.includes(f.id);
      const card = document.createElement("div");
      card.className = "food-card";
      card.innerHTML = `
        <img src="${f.image}" alt="${f.name}">
        <img src="imgaes/food/${ isFav ? 'greyStarFull.png' : 'greyStarEmpty.png'}"
             class="favorite-star"
             data-id="${f.id}" alt="Favorit">
        <div class="food-card-content">
          <h4>${f.name}</h4>
          <p>${f.description}</p>
          <div class="food-card-footer">
            <span class="price">${f.price.toFixed(2)} €</span>
            <span class="category">${f.category}</span>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    // 7) Sternchen-Listener
    document.querySelectorAll(".favorite-star").forEach(star => {
      star.addEventListener("click", () => {
        const id = parseInt(star.dataset.id);
        toggleFavorite(id);
        updateView();
      });
    });
  }

  // 8) Events
  [searchInput, categorySel, sortSel].forEach(el =>
    el.addEventListener("input", updateView)
  );

  // 9) Initial anzeigen
  updateView();
});