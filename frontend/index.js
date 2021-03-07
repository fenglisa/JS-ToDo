// const renderTask = (t, u) => {
//     const li = document.createElement('li');
//     li.innerText =  t.attributes.title + ` -- ${u.attributes.name}`;
//     document.body.appendChild(li);
//     const button = document.createElement('button');
//     button.innerText = "X";
//     button.addEventListener('click', (e) => {
//       fetch(`http://localhost:3000/tasks/${t.id}`, {
//         method: "DELETE"
//       }).then(li.remove())
//     });
//     li.appendChild(button);
// }

// Dark Mode Button
const button = document.createElement('button');
button.innerText = 'Dark Mode';
button.addEventListener('click', () => document.body.style.backgroundColor = "grey");
document.body.appendChild(button);

fetch("http://localhost:3000/tasks").then(r => r.json()).then(info => {
  info.data.forEach((t) => {
    const u = info.included.find(u => u.id === t.relationships.user.data.id);
    // renderTask(t, u);
    const task = new TaskToDo(t);
    task.display(u);
  })
})

fetch("http://localhost:3000/users").then(r => r.json()).then(data => {
  data.forEach((u) => {
    const user = new TaskMaster(u)
    user.display();
  })
})

const handleTaskForm = (e) => {
  e.preventDefault();
  const task = new TaskToDo({relationships: {user: {data: {user_id: users.value}}}, attributes: {title: title.value, due: due.value}});
  task.persist();
}

newTaskForm.addEventListener('submit', handleTaskForm )

const handleUserForm = (e) => {
  e.preventDefault();
  const user = new TaskMaster({name: username.value});
  user.persist();
}

newUserForm.addEventListener('submit', handleUserForm )

class TaskToDo {

  constructor({id, relationships: {user: {data: {user_id}}}, attributes:  {title, due}}){
    this.title = title;
    this.due = due;
    this.id = id;
    this.user_id = user_id;
  }

  titleize(){
    const sentence = this.title.split(' ');
    const newSentence = [];
    for(const word of sentence){
      newSentence.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    return newSentence.join(' ');
  }

  display(u){
    const tr = document.createElement('tr')
    tr.classList.add("task")
    tr.innerHTML =  `<td>${this.titleize()}</td><td>${u.attributes.name}</td>`;
    if(this.due){
      tr.innerHTML += `<td>${this.due}</td>`
      const today = new Date();
      if(new Date(this.due) < today){
        tr.classList.add("task-overdue");
      }
    }else{
      tr.innerHTML += "<td>Daily</td>"
    }
    const button = document.createElement('button');
    button.innerText = "X";
    button.addEventListener('click', (e) => this.delete(e));
    tr.appendChild(button);
    toDoTable.appendChild(tr);
    tr.addEventListener('click', function(){
      this.classList.toggle("task-complete");
    });
  }

  persist(){
    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({task: {title: this.title, due: this.due, user_id: this.user_id}})
    }).then(r => r.json()).then(info => {
        if(info.errors){
          alert(info.errors);
        }else{
          newTaskForm.reset();
          this.id = info.data.id;
          const u = info.included.find(u => u.id === this.user_id);
          this.display(u);
        }
      })
  }

  delete(e){
    fetch(`http://localhost:3000/tasks/${this.id}`, {
      method: "DELETE"
    }).then(e.target.parentElement.remove())

  }
}

class TaskMaster {

  constructor({id, name}){
    this.name = name;
    this.id = id;
  }

  display(){
    const opt = document.createElement('option')
    opt.setAttribute("value", `${this.id}`);
    const t = document.createTextNode(`${this.name}`);
    opt.appendChild(t);
    users.appendChild(opt)
  }

  persist(){
    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({user: {name: this.name}})
    }).then(r => r.json()).then(info => {
        if(Array.isArray(info.name)){
          alert("Name " + info.name[0]);
        }else{
          newUserForm.reset();
          this.id = info.id;
          this.display();
        }
      })
  }
}
