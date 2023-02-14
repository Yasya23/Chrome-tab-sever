const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const categoryContainer = document.getElementById("category-container");
const createCategoryButton = document.getElementById("create-category");
const existingCategoriesSelect = document.getElementById("existing-categories");
const categoryNameInput = document.getElementById("category-name");

const list = document.querySelector(".links");
let activeCategory = existingCategoriesSelect.value;

const categories = [];

createCategoryButton.addEventListener("click", function () {
  const categoryName = categoryNameInput.value;
  if (categoryName !== "" && !categories.includes(categoryName)) {
    categories.push(categoryName);
    addCategoryInOptions(categoryName);
    existingCategoriesSelect.value = categoryName;
    activeCategory = existingCategoriesSelect.value;
    categoryNameInput.value = "";
  }
});

function addCategoryInOptions(categoryName) {
  const option = document.createElement("option");
  option.value = categoryName;
  option.text = categoryName;
  existingCategoriesSelect.add(option);
}

tabBtn.addEventListener("click", function () {
  // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //   saveLinkToCategory(activeCategory, tabs[0].url);
  // });
  let cat = ["google.com", "github", "love", "popljhghg"];
  let num = Math.floor(Math.random() * 4);
  console.log(activeCategory);
  saveLinkToCategory(activeCategory, cat[num]);
});

function addLinkInTheList(activeCategory, link) {
  let activeList = document.getElementById(`${activeCategory}`);
  if (!activeList) {
    createListByCategoryName(`${activeCategory}`);
    activeList = document.getElementById(`${activeCategory}`);
  }
  createListElement(activeList, activeCategory, link);
  deleteListElement();
}

function deleteListElement() {
  const closeBtn = document.querySelectorAll(".link__close");

  closeBtn.forEach(function (btn) {
    btn.addEventListener("click", function ({ target }) {
      const categories = getLinksFromLocalStorage();
      const category = categories[target.dataset.id];
      if (!category) {
        return;
      }
      const index = category.indexOf(target.dataset.link);
      if (index !== -1) {
        category.splice(index, 1);
      }
      setLinksToLocalStorage(categories);
      this.parentElement.remove();
      checkEmptyCategories();
    });
  });
}

function createListElement(activeList, activeCategory, link) {
  const li = document.createElement("li");
  li.classList.add("list__link", "link");
  li.innerHTML = `<p class="link__wrapper" >
           <span class="link__decor"></span>
                <a class="link__adress" target='_blank' href='${link}'>
                      ${link}</a>
              <button class="link__close button" data-id='${activeCategory}' data-link=${link}>x</button>
          </p>         
        `;
  activeList.appendChild(li);
}

function createListByCategoryName(activeCategory) {
  list.innerHTML += `<ul class="links__list" id="${activeCategory}">
     <li class="list__link link">
          <h2 class="links-title">${activeCategory}</h2>
     </li>
    </ul>`;
}

function checkEmptyCategories() {
  const categories = getLinksFromLocalStorage();
  for (const category in categories) {
    if (categories[category].length === 0) {
      let ulElement = document.getElementById(category);
      ulElement.innerHTML = "";
      delete categories[category];
    }
  }
  setLinksToLocalStorage(categories);
}

function saveLinkToCategory(activeCategory, link) {
  const categories = getLinksFromLocalStorage();
  if (!categories[activeCategory]) {
    categories[activeCategory] = [];
  }
  setLinksToLocalStorage(categories);
  if (!categories[activeCategory].includes(link)) {
    categories[activeCategory].push(link);
    addLinkInTheList(activeCategory, link);
  }

  setLinksToLocalStorage(categories);
}

function getLinksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("categories")) || {};
}

function setLinksToLocalStorage(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function renderLinksFromLocalStorage() {
  list.innerHTML = "";
  const categories = getLinksFromLocalStorage();
  for (const category in categories) {
    createListByCategoryName(category);
    const links = categories[category];
    links.forEach((link) => addLinkInTheList(category, link));
    if (category !== "Without Category") {
      addCategoryInOptions(category);
    }
  }
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  list.innerHTML = "";
  existingCategoriesSelect.innerHTML = `<option value="Without Category">Without Category</option>`;
});

window.addEventListener("load", function () {
  renderLinksFromLocalStorage();
});
