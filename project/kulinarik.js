// kulinarik.js

// 1) Daten direkt im JS (kein fetch nötig)
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
      category: "Getränk",
      price: 1.75,
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
    // 2) Elemente aus dem DOM holen
    const listEl      = document.getElementById("foodList");
    const searchInput = document.getElementById("searchInput");
    const categorySel = document.getElementById("categoryFilter");
    const sortSel     = document.getElementById("sortSelect");
  
    // 3) Sortieren
    function sortFoods(arr) {
      const mode = sortSel.value;
      return arr.slice().sort((a, b) => {
        if (mode === "name-asc")   return a.name.localeCompare(b.name);
        if (mode === "name-desc")  return b.name.localeCompare(a.name);
        if (mode === "price-asc")  return a.price - b.price;
        if (mode === "price-desc") return b.price - a.price;
        return 0;
      });
    }
  
    // 4) Filtern & Rendern
    function updateView() {
      const q   = searchInput.value.trim().toLowerCase();
      const cat = categorySel.value;
      let filtered = foods.filter(f => {
        const matchName = f.name.toLowerCase().includes(q);
        const matchCat  = cat === "all" || f.category === cat;
        return matchName && matchCat;
      });
      filtered = sortFoods(filtered);
      render(filtered);
    }
  
    function render(items) {
      listEl.innerHTML = "";
      items.forEach(f => {
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
          <img src="${f.image}" alt="${f.name}">
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
    }
  
    // 5) Event-Listener für Controls
    [searchInput, categorySel, sortSel].forEach(el =>
      el.addEventListener("input", updateView)
    );
  
    // 6) Initiales Rendern aller Gerichte
    updateView();
  });
  