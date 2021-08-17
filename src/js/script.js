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

function divMeal(meal) {
  return `
    <div class="card shadow p-4 bg-white my-rounded " id="${meal.idMeal}">
        <img class="imagen-comida my-rounded " src="${meal.strMealThumb}" alt="imagen_comida">
        <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
        </div>
        <div class="card-footer">
            <p class="card-text" id="getMeal">
                <small class="text-muted"> <a href="" id="modal-btn" data-bs-toggle="modal"
                    data-bs-target="#myModal"> View Recipe →</a></small> </p>
        </div>
    </div>
    `;
}

function processData(data) {
  console.log(data);
  let html = "";
  if (data.meals) {
    data.meals.forEach((meal) => (html += divMeal(meal)));
    mealList.classList.remove("error");
    mealList.innerHTML = html;
  } else {
    setMessageError("NotFound");
  }
}

function callApi(link) {
  fetch(link)
    .then((response) => response.json())
    .then((data) => processData(data))
    .catch((error) => {
      setMessageError(error);
    });
}

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

//Functions for Recipes:

function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.id == "modal-btn") {
    let mealItem =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem}`)
      .then((response) => response.json())
      .then((data) => mealModal(data.meals));
  }
}

function ingredientAppend(ingredients, measures) {
  let completeHtml = "";
  for (let i = 0; i < ingredients.length; i++) {
    let html = `
        <li class="list-group-item">${measures[i]} - ${ingredients[i]}</li>
        `;
    completeHtml = completeHtml + html;
  }
  return completeHtml;
}

function mealModal(meal) {
  console.log(meal);
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
  console.log(ingredients);
  console.log(meal);
  let html = `
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="close-btn-container">
        <span class="close" data-bs-dismiss="modal">&times;</span>
    </div>

    <div class="card modal-card-container" style="border-radius: 15px; border: solid 0.5rem; border-color: #db3a3a">
        <img src="${meal.strMealThumb}" 
        class="card-img-top modal-img" 
        alt="Foto de ${meal.strMeal}" 
        style="border-radius: 15px; 
                max-width: 60% ; 
                align-self: center; 
                // box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);
                // -webkit-box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);
                // -moz-box-shadow: 12px 11px 21px -2px rgba(0,0,0,0.67);"
        />

        <div class="card-body">
            <h4 class="card-title text-center" style="text-transform: uppercase;">${meal.strMeal}</h4>
        </div>
        <div class="card-body">
            <h4 class="card-title" style="font-style: bold;">Ingredients</h4>
        </div>
        <div class="card-body">
            <ul class="list-group list-group-flush bg-danger" style="border-radius: 15px;">
                <li class="list-group-item" id="ingredients">    
                    ${ingredientAppend(ingredients, measures)}
                </li>
            </ul>
        </div>
        <div class="card-body">
            <h4 class="card-title" style="font-style: bold;">Instructions</h4>
            <p class="card-text" style="text-align: justify;">
                ${meal.strInstructions}
            </p>
        </div>
    </div>
</div>
    `;

  mealDetails.innerHTML = html;
  console.log(mealDetails);
}

{
  /* <div class="modal-dialog modal-dialog-scrollable modal-lg">
                <div class="close-btn-container">
                    <span class="close" data-bs-dismiss="modal">&times;</span>
                </div>
                <div class="card modal-card-container" style="border-radius: 15px; background: radial-gradient(circle, rgba(255,3,3,1) 35%, rgba(240,167,80,1) 100%);">
                    <img src="${meal.strMealThumb}" class="card-img-top modal-img" alt="Foto de ${meal.strMeal}" style="border-radius: 15px; max-width: 50% ; align-self: center;" />
                    <div class="card-body">
                        <h4 class="card-title text-center" style="text-transform: uppercase;">${meal.strMeal}</h4>
                    </div>
                    <div class="card-body">
                    <h5 class="card-title" style="font-style: bold;>Ingredients</h5>
                    <ul class="list-group list-group-flush" style="border-radius: 15px; background: radial-gradient(circle, rgba(255,3,3,1) 35%, rgba(240,167,80,1) 100%);">
                        <li class="list-group-item" id="ingredients">
                        </li>
                        ${ingredientAppend(ingredients)}
                        <li class="list-group-item">
                            <h5 class="card-title" style="font-style: bold;">Instructions</h5>
                        </li>
                    </ul>
                    <div class="card-body">
                        <p class="card-text" style="text-align: justify;">
                            ${meal.strInstructions}
                        </p>
                    </div>
                </div>
            </div> */
}
