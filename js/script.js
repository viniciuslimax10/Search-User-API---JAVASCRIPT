let text = null;
let button = 0;

let allUsers = [];
let statisticsUsers = 0;

let showUsers = null;

let totalMen = 0;
let totalWoman = 0;

let sumAge = 0;
let mediumAge = 0;

window.addEventListener('load', () => {
  text = document.querySelector('#text');
  showUsers = document.querySelector('#users');
  statisticsUsers = document.querySelector('#statistics');
  button = document.querySelector('#search');
  numberFormat = Intl.NumberFormat('pt-BR');

  button.addEventListener('click', checkUser);
  fetchUsers();
  checkButton();
  checkUser();
  showUsers.innerHTML = '';
  statisticsUsers.innerHTML = '';
});
async function fetchUsers() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const user = await res.json();
  allUsers = user.results.map((users) => {
    const { name, dob, gender, picture } = users;
    return {
      name: name.first + ' ' + name.last,
      age: dob.age,
      gender: gender === 'male' ? 'M' : 'F',
      picture: picture.thumbnail,
    };
  });
}
function checkButton() {
  function onKeyPress(event) {
    let hasText = !!event.target.value && event.target.value.trim() !== '';
    if (hasText) {
      button.removeAttribute('disabled');
    } else {
      button.setAttribute('disabled', 'disabled');
    }
    if (hasText && event.key == 'Enter') {
      checkUser();
    }
  }
  text.addEventListener('keyup', onKeyPress);
}
function checkUser() {
  let letters = text.value.toLowerCase();

  let listUsers = allUsers.filter((users) => {
    return users.name.toLowerCase().includes(letters);
  });
  listUser(listUsers);
}
function listUser(listUsers) {
  let usersFound = `<div id="card>"`;

  if (listUsers.length >= 1) {
    usersFound = `<strong>${listUsers.length} usuários encontrados</strong>`;
    listStatistics(listUsers);
  } else {
    usersFound = '<strong>Nenhum usuario encontrado</strong>';
    statisticsUsers.innerHTML = '';
  }
  listUsers.forEach((users) => {
    usersFound += `
        <div class="row-text">
            <div><img src="${users.picture}" alt="${users.name}" class="thumbnail"></div>
            <div class="name">${users.name}</div>
            <div class="age">${users.age} anos
        </div>
        </div>`;
  });

  showUsers.innerHTML = usersFound;
}
function listStatistics(listUsers) {
  var div = '<strong>Estatísticas</strong>';

  totalMen = listUsers.filter((users) => {
    return users.gender === 'M';
  }).length;

  totalWoman = listUsers.filter((users) => {
    return users.gender === 'F';
  }).length;

  sumAge = listUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);
  mediumAge = numberFormat.format((sumAge / listUsers.length).toFixed(2));
  div += `
      <div class="row-text">
          <i class="fa fa-male fa-3x"></i>
          <div class="text">Sexo masculino </div>${totalMen}
      </div>
      <div class="row-text">
          <i class="fa fa-female fa-3x"></i>
          <div class="text">Sexo feminino </div>${totalWoman}
      </div>
      <div class="row-text">
           <i class="fa fa-birthday-cake fa-3x"></i>
          <div class="text">Soma das idades </div>${sumAge}
      </div>
      <div class="row-text">
          <i class="fa fa-line-chart fa-3x"></i>
          <div class="text">Média das idades </div>${mediumAge}
      </div>
  `;
  statisticsUsers.innerHTML = div;
}
