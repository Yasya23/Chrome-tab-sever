const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const categoryContainer = document.getElementById("category-container");
const createCategoryButton = document.getElementById("create-category");
const existingCategoriesSelect = document.getElementById("existing-categories");
const categoryNameInput = document.getElementById("category-name");
const localStorageGetCategories = JSON.parse(
  localStorage.getItem("categories") || "{}"
);

const list = document.querySelector(".links");
let activeCategory = "Without Category";

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
  //   myLeads.push(tabs[0].url);
  //   localStorage.setItem("myLeads", JSON.stringify(myLeads));
  //   render(myLeads);
  // });
  activeCategory = existingCategoriesSelect.value;
  let link = {
    id: existingCategoriesSelect.value,
    url: "google.com",
  };
  // addLinkInTheList(activeCategory, link.url);
  saveLinkToCategory(activeCategory, link.url);
});

function addLinkInTheList(activeCategory, link) {
  let activeList = document.getElementById(`${activeCategory}`);
  if (!activeList) {
    createListByCategoryName(`${activeCategory}`);
    activeList = document.getElementById(`${activeCategory}`);
  }
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

  const closeBtn = document.querySelectorAll(".link__close");

  closeBtn.forEach(function (btn) {
    btn.addEventListener("click", function ({ target }) {
      let categories = JSON.parse(localStorage.getItem("categories") || "{}");
      const category = categories[target.dataset.id];
      console.log(category.length);
      if (!category) {
        return;
      }
      const index = category.indexOf(target.dataset.link);
      if (index !== -1) {
        category.splice(index, 1);
      }
      localStorage.setItem("categories", JSON.stringify(categories));
      this.parentElement.remove();
      checkEmptyCategories();
    });
  });
}

function checkEmptyCategories() {
  let categories = JSON.parse(localStorage.getItem("categories") || "{}");
  for (const category in categories) {
    if (categories[category].length === 0) {
      delete categories[category];
    }
  }
  localStorage.setItem("categories", JSON.stringify(categories));
}

function createListByCategoryName(activeCategory) {
  list.innerHTML += `<ul class="links__list" id="${activeCategory}">
     <li class="list__link link">
          <h2 class="links-title">${activeCategory}</h2>
     </li>
    </ul>`;
}

function saveLinkToCategory(activeCategory, link) {
  let categories = JSON.parse(localStorage.getItem("categories")) || {};
  if (!categories[activeCategory]) categories[activeCategory] = [];

  if (!categories[activeCategory].includes(link)) {
    categories[activeCategory].push(link);
    addLinkInTheList(activeCategory, link);
  }
  localStorage.setItem("categories", JSON.stringify(categories));
}

function getLinksFromLocalStorage() {
  return JSON.parse(localStorage.getItem("categories")) || {};
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
