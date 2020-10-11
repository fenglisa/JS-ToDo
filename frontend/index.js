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

fetch("http://localhost:3000/tasks").then(r => r.json()).then(info => {
  // console.log(info);
  info.data.forEach((t) => {
    const u = info.included.find(u => u.id === t.relationships.user.data.id);
    // renderTask(t, u);
    const task = new TaskToDo(t);
    task.display(u);
  })
})

fetch("http://localhost:3000/users").then(r => r.json()).then(data => {
  data.forEach((u) => {
    const opt = document.createElement('option')
    opt.setAttribute("value", `${u.id}`);
    var t = document.createTextNode(`${u.name}`);
    opt.appendChild(t);
    users.appendChild(opt)
  })
})

// const createTask = (taskInfo) => {
//   return fetch("http://localhost:3000/tasks", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json"
//     },
//     body: JSON.stringify(taskInfo)
//   }).then(r => r.json()).then(info => {
//       const u = info.included[0];
//       renderTask(info.data, u);
//     })
// }

const handleForm = (e) => {
  e.preventDefault();
  const task = new TaskToDo({relationships: {user: {data: {user_id: users.value}}}, attributes: {title: title.value, due: due.value}});
  task.persist();

  // const {title, due, name} = e.target;
  // createTask({task: {title: title.value, due: due.value, user_id: name.value}})
  // e.target.reset();
}

newTaskForm.addEventListener('submit', handleForm )

class TaskToDo {

  constructor({id, relationships: {user: {data: {user_id}}}, attributes:  {title, due}}){
    this.title = title;
    this.due = due;
    this.id = id;
    this.user_id = user_id;
  }

  display(u){
    const li = document.createElement('li');
    li.classList.add("task");
    if(this.due){
      const today = new Date();
      if(new Date(this.due) < today){
        li.classList.add("task-overdue");
      }
    }
    li.innerText =  this.title + ` -- ${u.attributes.name}`;
    document.body.appendChild(li);
    li.addEventListener('click', function(){
      this.classList.toggle("task-complete");
    });
    const button = document.createElement('button');
    button.innerText = "X";
    button.addEventListener('click', (e) => this.delete(e));
    // (e) => {
    //   fetch(`http://localhost:3000/tasks/${this.id}`, {
    //     method: "DELETE"
    //   }).then(li.remove())
    // });
    li.appendChild(button);
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
          console.log(info.errors);
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
