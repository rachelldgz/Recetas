const searchBtn = document.getElementById('btn-search');
const mealList = document.getElementById('meal');
const randomBtn = document.getElementById('btn-random');
const searchInput = document.getElementById('search-input');
const DocumentBody = document.body;

// event listeners
DocumentBody.onload = getMealListLoad;
searchBtn.addEventListener('click', getMealList);
randomBtn.addEventListener('click', () => {
    searchInput.value = "";
    getRandomMeallist();
})


function setMessageError(error) {
    mealList.classList.add('error');
    switch (error) {
        case 'NotFound':
            mealList.innerHTML = "Sorry, we didn't find any meal!";
            break;
        case 'Empty':
            mealList.innerHTML = "Sorry, you need enter the name of an ingredient!";
            break;
        default:
            mealList.innerHTML = "Sorry, our system is shut down, try again more later"
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
                    data-bs-target="#myModal"> Get Recipe →</a></small> </p>
        </div>
    </div>
    `
}

function processData(data) {
    console.log(data);
    let html = "";
    if (data.meals) {
        data.meals.forEach(meal => html += divMeal(meal));
        mealList.classList.remove('error');
        mealList.innerHTML = html;
    } else {
        setMessageError("NotFound")
    }
}

function callApi(link) {
    fetch(link)
        .then(response => response.json())
        .then(data => processData(data))
        .catch(error => {
            setMessageError(error)
        });
}

function getMealListLoad() {
    callApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=`)
}

function getMealList() {
    let searchInputTxt = searchInput.value.trim();

    if (searchInputTxt.length <= 0) {
        setMessageError("Empty")
        return;
    }

    callApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
}

function getRandomMeallist() {
    callApi(`https://www.themealdb.com/api/json/v2/1/randomselection.php`)
}