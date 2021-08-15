const searchBtn = document.getElementById('btn-search');
const mealList = document.getElementById('meal');


// event listeners
searchBtn.addEventListener('click', getMealList);



function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log(searchInputTxt);
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                 <div class="card shadow p-3 bg-white rounded"  id="${meal.idMeal}">
                         <img class="imagen-comida" src ="${meal.strMealThumb}" alt="imagen_comida">
                       <div class="card-body">
                            <h5 class="card-title">${meal.strMeal}</h5>
                  </div>
                     <div class="card-footer">
                            <p class="card-text" id="getMeal"><small class="text-muted"> <a href=""> Get Recipe →</a></small>
                         </p>
                       </div>
                    </div>
                `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }

            mealList.innerHTML = html;
        });

}