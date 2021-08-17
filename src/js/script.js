const searchBtn = document.getElementById("btn-search");
const mealList = document.getElementById("meal");
const randomBtn = document.getElementById("btn-random");
const searchInput = document.getElementById("search-input");
const mealDetails = document.querySelector("#myModal");
const DocumentBody = document.body;

// event listeners
DocumentBody.onload = getMealListLoad;
searchBtn.addEventListener("click", getMealList);
randomBtn.addEventListener("click", () => {
  searchInput.value = "";
  getRandomMeallist();
});
mealList.addEventListener("click", getMealRecipe);

//Functions for Cards
function getMealListLoad() {
  callApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=`);
}

function getMealList() {
  let searchInputTxt = searchInput.value.trim();

  if (searchInputTxt.length <= 0) {
    setMessageError("Empty");
    return;
  }

  callApi(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`
  );
}

function getRandomMeallist() {
  callApi(`https://www.themealdb.com/api/json/v2/1/randomselection.php`);
}

function callApi(link) {
  fetch(link)
    .then((response) => response.json())
    .then((data) => processData(data))
    .catch((error) => {
      setMessageError(error);
    });
}

function processData(data) {
  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => (html += divMeal(meal)));
    mealList.classList.remove("error");
    mealList.innerHTML = html;
  } else {
    setMessageError("NotFound");
  }
}

function divMeal(meal) {
  return `
    <div class="card shadow p-4 bg-white my-rounded " id="${meal.idMeal}">

        <div class="card-body">
        <a href="" id="modal-btn" data-bs-toggle="modal" data-bs-target="#myModal">      
        <img class="imagen-comida my-rounded" src="${meal.strMealThumb}" alt="imagen_${meal.strMeal}">
        </a>
            <h5 class="card-title">${meal.strMeal}</h5>
        </div>

    </div>
    `;
}


function setMessageError(error) {
  mealList.classList.add("error");
  switch (error) {
    case "NotFound":
      mealList.innerHTML = "Sorry, we didn't find any meal!";
      break;
    case "Empty":
      mealList.innerHTML = "Sorry, you need enter the name of an ingredient!";
      break;
    default:
      mealList.innerHTML =
        "Sorry, our system is shut down, try again more later";
  }
}


//Functions for Recipes:

function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.parentElement.id == "modal-btn") {
    let mealItem =
      e.target.parentElement.parentElement.parentElement.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem}`)
      .then((response) => response.json())
      .then((data) => mealModal(data.meals))
      .catch((error) => {
        setMessageError(error);
      });
  }
}

function ingredientAppend(ingredients, measures) {
  let completeHtml = "";
  for (let i = 0; i < ingredients.length; i++) {
    let html = `
        <li class="list-group-item">${ingredients[i]} - ${measures[i]}</li>
        `;
    completeHtml = completeHtml + html;
  }
  return completeHtml;
}

function mealModal(meal) {
  meal = meal[0];
  let ingredients = [];
  let measures = []
  for (let i = 0; i < 20; i++) {
    let text = `strIngredient${i + 1}`;
    ingredients[i] = meal[text];
    let measureText = `strMeasure${i + 1}`;
    measures[i] = meal[measureText];
    if (!ingredients[i]) {
      ingredients.pop()
      measures.pop()
      break;
    }
  }
  let html = `
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="close-btn-container">
        <span class="close" data-bs-dismiss="modal">&times;</span>
    </div>

    <div class="card modal-card-container" style="border-radius: 15px; border: solid 0.2rem; border-color: #db3a3a" >
        <img src="${meal.strMealThumb}" 
        class="card-img-top modal-img" 
        alt="Foto de ${meal.strMeal}" 
        style="border-radius: 15px; 
                max-width: 50% ; 
                align-self: center; 
                // box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);
                // -webkit-box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);
                // -moz-box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);"
        />

        <div class="card-body">
            <h4 class="card-title text-center" style="text-transform: uppercase;">${meal.strMeal}</h4>
        </div>
        <div class="card-body pb-0">
            <h3 class="card-title text-danger" style="font-style: bold;">Ingredients</h3>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush bg-danger">
                <li class="list-group-item" id="ingredients">    
                    ${ingredientAppend(ingredients, measures)}
                </li>
            </ul>
        </div>
        <div class="card-body">
            <h3 class="card-title mb-4 text-danger" style="font-style: bold;">Instructions</h3>
            <p class="card-text" style="text-align: justify;">
                ${meal.strInstructions}
            </p>
        </div>
    </div>
</div>
    `;

  mealDetails.innerHTML = html;
}