const dateSpan = document.querySelector('div.headline p');
const currentDate = new Date();
const addTaskBtn = document.querySelector('button.addTask');
const tasksInput = document.querySelector('input.tasksInput');
const rangeInput = document.querySelector('input.rangeInput');
const daySelect = document.querySelector('div.tasks select');
const importanceImg = document.querySelector('.tasks div.importanceImg');
const daysDivs = document.querySelectorAll('.day');
const allList = document.querySelector('div.allList');
const importantTasks = document.querySelector('div.importantTasks');
const searchInput = document.querySelector('.allList input');

let counter = 0;

//funkcja określająca dzień tygodnia
const getDay = (day) => {
  if (day === 1) return "poniedziałek";
  else if (day === 2) return "wtorek";
  else if (day === 3) return "środa";
  else if (day === 4) return "czwartek";
  else if (day === 5) return "piątek";
  else if (day === 6) return "sobota";
  else if (day === 0) return "niedziela";
};

//dodanie do strony aktualnej daty
dateSpan.innerHTML = `${getDay(currentDate.getDay())}, ${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;

//funkcja określająca ważność zadania
const checkRange = () => {
    if (rangeInput.value == 1){
        importanceImg.style.backgroundImage = "url('./img/turtle.png')";
    } else if (rangeInput.value == 2){
        importanceImg.style.backgroundImage = "url('./img/panda.png')";
    } else if (rangeInput.value == 3){
        importanceImg.style.backgroundImage = "url('./img/horse.png')";
    } else {
        importanceImg.style.backgroundImage = "url('./img/flame.png')";
    }
};

//funkcja usuwająca elementy z listy
const removeTasks = (e) => {
    e.target.parentElement.remove();
    let lis = document.querySelectorAll('.mainSection li');
    let daysLis = document.querySelectorAll('.weekDays li');
    let fullList = [...lis].concat([...daysLis]);
    let fullListFiltered = fullList.filter(el => el.dataset.number == e.target.parentElement.dataset.number);
    fullListFiltered.forEach(el => el.remove());
};


//funkcja sprawdzająca do jakiego dnia dopisać zadanie i dodająca elementy (done i flame)
const checkDay = (day, txt) => {
    let dayValue = daySelect.value;
    let dayDiv = [...daysDivs].filter(el => el.dataset.day === dayValue);
    
    let newLi = document.createElement("li");
    counter++;
    newLi.dataset.number = counter;
    let newI = document.createElement("i");
    newLi.innerHTML = txt;
    newI.classList.add("fas");
    newI.classList.add("fa-check");
    newLi.appendChild(newI);


    let newLiCopy = newLi.cloneNode(true);
    let newLiCopy2 = newLi.cloneNode(true);
    let importanceImgCopy = importanceImg.cloneNode(true);
    importanceImgCopy.style.backgroundImage = "url('./img/flame.png')";
    importanceImgCopy.style.marginLeft = "2rem";

    dayDiv.forEach(el => el.lastElementChild.appendChild(newLi));
    allList.lastElementChild.appendChild(newLiCopy);
    if (rangeInput.value == 4) {
        importantTasks.lastElementChild.appendChild(newLiCopy2);
        newLiCopy2.appendChild(importanceImgCopy);
    }

    //usunięcie elementu
    newI.addEventListener("click", removeTasks);
    newLiCopy.addEventListener("click", removeTasks);
    newLiCopy2.addEventListener("click", removeTasks);
};

//funkcja resetu po dodaniu zadania
const reset = () => {
    tasksInput.value = "";
    rangeInput.value = 3;
    daySelect.value = "monday";
    importanceImg.style.backgroundImage = "url('./img/horse.png')";
};

//funkcja wyszukiwarki
const search = (e) => {
    let value = e.target.value;
    const allLis = document.querySelectorAll('.allList li');
    const allUl = document.querySelector('.allList ul');

    let allListFilted = [...allLis].filter(el => el.textContent.includes(value));
    allUl.textContent = "";
    allListFilted.forEach(el => allUl.appendChild(el));
};

//gówna funkcja, dodająca event do list
const addTask = () => {
    let taskValue = tasksInput.value;
    if (taskValue === ""){
        return alert("puste pole")
    }
    let dayValue = daySelect.value;
    checkDay(dayValue, taskValue);
    reset();
};


//event dodający zadanie do list
addTaskBtn.addEventListener("click", addTask);
rangeInput.addEventListener("input", checkRange);
searchInput.addEventListener("input", search);

