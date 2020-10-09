const renderTask = (t, u) => {
    const li = document.createElement('li');
    li.innerText =  t.attributes.title + ` -- ${u.attributes.name}`;
    document.body.appendChild(li);
}

fetch("http://localhost:3000/tasks").then(r => r.json()).then(info => {
  console.log(info);
  info.data.forEach((t) => {
    const u = info.included.find(u => u.id === t.relationships.user.data.id);
    renderTask(t, u);
  })
})

fetch("http://localhost:3000/users").then(r => r.json()).then(data => {
  data.forEach((u) => {
    const opt = document.createElement('option')
    opt.setAttribute("value", `${u.id}`);
    var t = document.createTextNode(`${u.name}`);
    opt.appendChild(t);
    document.getElementById("name").appendChild(opt)
  })
})

const createTask = (taskInfo) => {
  return fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(taskInfo)
  }).then(r => r.json()).then(info => {
      const u = info.included[0];
      renderTask(info.data, u);
    })
}

const handleForm = (e) => {
  e.preventDefault();
  const {title, due, name} = e.target;
  createTask({task: {title: title.value, due: due.value, user_id: name.value}})
  e.target.reset();
}

document.querySelector("form").addEventListener('submit', handleForm )

// createTask({task: {title: "vacuum"}}).then(r => r.json()).then(data => {
//   console.log(data)
//     // if(data.errors > 0){
//     //   data.errors.forEach((e) => {
//     //     const li = document.createElement('li')
//     //     li.innerText = e.title
//     //     document.body.appendChild(li)
//     //   })
//     // }
// })
