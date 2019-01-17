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
const removeTasks = (taskToRemove) => {
    globalListOfTasks = globalListOfTasks.filter(task => task !== taskToRemove)
    renderAllTasks()
};

let globalListOfTasks = []
let globalFilter = ""

//funkcja sprawdzająca do jakiego dnia dopisać zadanie i dodająca elementy (done i flame)
const checkDay = (day, priority, txt) => {
    globalListOfTasks.push({
        dayValue: day,
        priority,
        txt
    })
    renderAllTasks()
}

const renderAllTasks = () => {
    // Clear all tasks first
    for (const div of daysDivs) {
        div.lastElementChild.innerHTML = ""
    }
    const allUl = document.querySelector('.allList ul');
    allUl.innerHTML = ""
    importantTasks.lastElementChild.innerHTML = ""
    // Now render all tasks that match the filter
    for (const task of globalListOfTasks) {
        if (task.txt.includes(globalFilter)) {
            renderOneTask(task)
        }
    }
}

const renderOneTask = (task) => {
    let dayDiv = [...daysDivs].find(el => el.dataset.day === task.dayValue);

    // Very hacky solution that allows us to slowly migrate to React
    const appendReactTo = (element, target) => {
        const frag = document.createDocumentFragment()
        ReactDOM.render(element, frag)
        target.appendChild(frag)
    }

    // Render the Task in the all list
    appendReactTo(
        <Task task={task} />,
        allList.lastElementChild
    )

    // Render the Task in the correct day box
    dayDiv && appendReactTo(
        <Task task={task} />,
        dayDiv.lastElementChild
    )

    // If the Task is high priority render it in the high priority box
    if (task.priority == 4) {
        appendReactTo(
            <Task task={task} presentAsImportant />,
            importantTasks.lastElementChild
        )
    }
};

class Task extends React.Component {
    checkmark = React.createRef()
    componentDidMount() {
        // Due to how weirdly we use React, normal way of handling events doesn't work
        this.checkmark.current.addEventListener("click", this.removeTasks)
    }
    removeTasks = () => {
        removeTasks(this.props.task)
    }
    render() {
        return <li>
            {this.props.task.txt}
            <i className="fas fa-check" ref={this.checkmark} />
            { this.props.presentAsImportant &&
                <div style={{ backgroundImage: "url('./img/flame.png')", marginLeft: "2rem" }} />
            }
        </li>
    }
}

//funkcja resetu po dodaniu zadania
const reset = () => {
    tasksInput.value = "";
    rangeInput.value = 3;
    daySelect.value = "monday";
    importanceImg.style.backgroundImage = "url('./img/horse.png')";
};

//funkcja wyszukiwarki
const search = (e) => {
    globalFilter = e.target.value;
    renderAllTasks()
};

//gówna funkcja, dodająca event do list
const addTask = () => {
    let taskValue = tasksInput.value;
    if (taskValue === ""){
        return alert("puste pole")
    }
    let dayValue = daySelect.value;
    let priority = rangeInput.value;
    checkDay(dayValue, priority, taskValue);
    reset();
};


//event dodający zadanie do list
addTaskBtn.addEventListener("click", addTask);
rangeInput.addEventListener("input", checkRange);
searchInput.addEventListener("input", search);

