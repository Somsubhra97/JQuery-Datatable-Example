const list = document.querySelector('ul');
const form = document.querySelector('form');
let idx=0;

// real-time listener
db.collection('recipes').onSnapshot(snapshot => {//snapshot fetches an array if data stored

  snapshot.docChanges().forEach(x => {
     if(x.type === 'added'){

      addRecipe(x.doc.data(), x.doc.id)
    } else if (x.type === 'removed'){

      deleteRecipe(idx);
    }
  });
});

//add data
const addRecipe = (recipe, id) => {
  let time = recipe.created_at.toDate();
  let li=document.createElement('li');
  li.setAttribute('data-id',`${id}`);
  li.innerHTML=`
  <div>${recipe.title}</div>
  <div><small>${time}</small></div>
  <button .btn btn danger btn-sm my-2">delete</button>`

  list.append(li);
  };

const deleteRecipe = (idx) => {
  const recipes = document.querySelectorAll('li');
  recipes.forEach(recipe => {
    if(recipe.getAttribute('data-id') === idx){
      recipe.remove();
    }
  });
};


// form submition
form.addEventListener('submit', e => {
  e.preventDefault();
  const now = new Date();
  const recipe = {
    title: form.recipe.value,
    created_at: firebase.firestore.Timestamp.fromDate(now)
  };
  db.collection('recipes').add(recipe).then(() => {
    form.reset();
  }).catch(err => {
    console.log(err);
  });
});

// deleting data
list.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){
       idx = e.target.parentElement.getAttribute('data-id');
    db.collection('recipes').doc(idx).delete()
  }
});