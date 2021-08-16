// const searchBtn = document.getElementById('btn-search');
// const mealList = document.getElementById('meal');
// const randomBtn = document.getElementById('btn-random');


// // event listeners
// searchBtn.addEventListener('click', getMealList);
// randomBtn.addEventListener('click', () => {
//     searchInput.value = " ";
//     getRandomMeallist();
// })


// function getMealList() {
//     let searchInputTxt = document.getElementById('search-input').value.trim();
//     console.log(searchInputTxt);
//     fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             let html = "";
//             if (data.meals) {
//                 data.meals.forEach(meal => {
//                     html += `
//                  <div class="card shadow p-3 bg-white rounded"  id="${meal.idMeal}">
//                          <img class="imagen-comida" src ="${meal.strMealThumb}" alt="imagen_comida">
//                        <div class="card-body">
//                             <h5 class="card-title">${meal.strMeal}</h5>
//                   </div>
//                      <div class="card-footer">
//                      <p class="card-text" id="getMeal">
//                      <small class="text-muted"> <a href="" id="modal-btn" data-bs-toggle="modal"
//                              data-bs-target="#myModal"> Get Recipe →</a></small>
//                  </p>
//                          </p>
//                        </div>
//                     </div>
//                 `;
//                 });
//                 mealList.classList.remove('notFound');
//             } else {
//                 html = "Sorry, we didn't find any meal!";
//                 mealList.classList.add('notFound');
//             }

//             mealList.innerHTML = html;
//         });

// }

// function getRandomMeallist() {

//     fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             let html = "";
//             if (data.meals) {
//                 data.meals.forEach(meal => {
//                     html += `
//              <div class="card justify-content-md-center shadow p-3 bg-white rounded"  id="${meal.idMeal}">
//                      <img class="imagen-comida" src ="${meal.strMealThumb}" alt="imagen_comida">
//                    <div class="card-body">
//                         <h5 class="card-title">${meal.strMeal}</h5>
//               </div>
//                  <div class="card-footer">
//                         <p class="card-text" id="getMeal"><small class="text-muted"> <a href=""> Get Recipe →</a></small>
//                      </p>
//                    </div>
//                 </div>
//             `;
//                 });
//                 mealList.classList.remove('notFound');
//             } else {
//                 html = "Sorry, we didn't find any meal!";
//                 mealList.classList.add('notFound');
//             }
//             mealList.innerHTML = html;
//         });

// }





const searchBtn = document.getElementById('btn-search');
const mealList = document.getElementById('meal');
const randomBtn = document.getElementById('btn-random');
const searchInput = document.getElementById('search-input');

// event listeners
searchBtn.addEventListener('click', getMealList);
randomBtn.addEventListener('click', () => {
    searchInput.value = "";

    getRandomMeallist();
})

function setResultNotFound() {
    mealList.classList.add('notFound');
    mealList.innerHTML = "Sorry, we didn't find any meal!"
}

function divMeal(meal) {
    return `
                 <div class="card shadow p-4 bg-white rounded"  id="${meal.idMeal}">
                         <img class="imagen-comida" src ="${meal.strMealThumb}" alt="imagen_comida">
                       <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                  </div>
                     <div class="card-footer">
                     <p class="card-text" id="getMeal">
              <small class="text-muted"> <a href="" id="modal-btn" data-bs-toggle="modal"                             
              data-bs-target="#myModal"> Get Recipe →</a></small>                </p>
                       </div>
                    </div>
                `
}

function processData(data) {
    console.log(data);
    let html = "";
    if (data.meals) {
        data.meals.forEach(meal => html += divMeal(meal));
        mealList.classList.remove('notFound');
        mealList.innerHTML = html;
    } else {
        setResultNotFound()
    }
}

function callApi(link) {
    fetch(link)
        .then(response => response.json())
        .then(data => processData(data))
        .catch(_ => {
            mealList.classList.add('error');
            mealList.innerHTML = "Sorry, our system is shut down, try again more later"
        });
}

function getMealList() {
    let searchInputTxt = searchInput.value.trim();

    if (searchInputTxt.length <= 0) {
        setResultNotFound()
        return;
    }

    callApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
}

function getRandomMeallist() {
    callApi(`https://www.themealdb.com/api/json/v1/1/random.php`)
}