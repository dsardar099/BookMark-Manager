// Store all the tags enter at current time
let curTags = [];

//store all bookmarks
let bm = [];

//store all categories entered
let catHist = [];

// Regular expression for url validation
let expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
let regex = new RegExp(expression);

const addTag = document.querySelector("#addTag");
const tag = document.querySelector("#tag");
const showTags = document.querySelector("#showTags");

const eaddTag = document.querySelector("#eaddTag");
const etag = document.querySelector("#etag");
const eshowTags = document.querySelector("#eshowTags");

var editModal = new bootstrap.Modal(document.getElementById("editModal"));

//Bookmark class method
function Bookmark(title, url, category, tags, date) {
  this.title = title;
  this.url = url;
  this.category = category;
  this.tags = tags;
  this.date = date;
}

// Set datalist for category for add form
let dl = document.querySelector("#datalistOptions");
showCategory = () => {
  dl.innerHTML = "";
  if (catHist.length != 0) {
    catHist.map((cat) => {
      dl.innerHTML += `<option value="${cat}">`;
    });
  }
};

//Show ctegory for first time
showCategory();

// Set datalist for category for edit form
let edl = document.querySelector("#edatalistOptions");
showECategory = () => {
  edl.innerHTML = "";
  if (catHist.length != 0) {
    catHist.map((cat) => {
      edl.innerHTML += `<option value="${cat}">`;
    });
  }
};

//Handling search form

var searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// Form submission handling for adding bookmark

var formAdd = document.querySelector("#addForm");

formAdd.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    event.stopPropagation();
    formAdd.classList.add("was-validated");

    // For form was filled correctly
    if (formAdd.checkValidity()) {
      var title = document.querySelector("#title").value;
      var url = document.querySelector("#url").value;
      var category = document.querySelector("#cat").value;

      // Checking if the url have the http or http in starting.. if not then add
      if (
        url.includes("https://") == false &&
        url.includes("http://") == false
      ) {
        url = "https://" + url;
      }

      //If url entered i a valid url
      if (url.match(regex)) {
        //preparing current date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + "/" + mm + "/" + yyyy;

        // Check if the url has already been bookmarked
        var found = false;
        bm.map((value) => {
          found = value.url == url ? true : found;
        });

        // If the url not entered pereviously

        if (found == false) {
          var b = new Bookmark(title, url, category, curTags, today);
          bm.push(b);

          // Push to catHist if the category entered is not entered previouly
          if (!catHist.includes(category)) {
            catHist.push(category);
          }

          // Reset all for next input
          curTags = [];
          document.querySelector("#title").value = "";
          document.querySelector("#url").value = "";
          document.querySelector("#cat").value = "";
          showCategory();

          //Show current status
          dispTag();
          dispBookmarks();
          saveData();
          formAdd.classList.remove("was-validated");
        } else {
          alert("Same URL cann't be bookmarked twice");
        }
      } else {
        alert("URL is not valid");
      }
    }
  },
  false
);

// Form submission handling for editing bookmark

var formEdit = document.querySelector("#editForm");

formEdit.addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  formEdit.classList.add("was-validated");
  // For form was filled correctly
  if (formEdit.checkValidity()) {
    var title = document.querySelector("#etitle").value;
    var url = document.querySelector("#eurl").value;
    var category = document.querySelector("#ecat").value;
    var id = document.querySelector("#id").value;

    // Checking if the url have the http or http in starting.. if not then add
    if (url.includes("https://") == false && url.includes("http://") == false) {
      url = "https://" + url;
    }

    //If url entered i a valid url
    if (url.match(regex)) {
      //preparing current date
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = dd + "/" + mm + "/" + yyyy;

      // Check if the url has already been bookmarked
      var found = false;
      bm.map((value, index) => {
        found = value.url == url && index != id ? true : found;
      });

      // If the url not entered pereviously

      if (found == false) {
        var b = new Bookmark(title, url, category, curTags, today);
        bm[id] = b;

        // Push to catHist if the category entered is not entered previouly
        if (!catHist.includes(category)) {
          catHist.push(category);
        }

        // Reset all for next input
        curTags = [];
        document.querySelector("#etitle").value = "";
        document.querySelector("#eurl").value = "";
        document.querySelector("#ecat").value = "";
        showECategory();

        //Show current status
        dispETag();
        dispBookmarks();

        alert("Bookmark has been updated");
        saveData();
        editModal.toggle();

        formEdit.classList.remove("was-validated");
      } else {
        alert("Same URL cann't be bookmarked twice");
      }
    } else {
      alert("URL is not valid");
    }
  }
});

//Edit bookmark

editBookMark = (id) => {
  document.querySelector("#etitle").value = bm[id].title;
  document.querySelector("#eurl").value = bm[id].url;
  document.querySelector("#ecat").value = bm[id].category;
  document.querySelector("#id").value = id;
  document.querySelector("#eshowTags").innerHTML = "";
  eshowTags.innerHTML = "";
  bm[id].tags.map((tag, index) => {
    eshowTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1" onClick="delETag(${index})">${tag} <span class="text-danger fw-bold">x</span></span>`;
  });
  curTags = bm[id].tags;
  showECategory();
};

// Adding new tag for add form

addTag.addEventListener("click", (e) => {
  //If input field is not empty
  if (tag.value != "") {
    //If entered tag is not entered previously
    if (curTags.includes(tag.value) == false) {
      curTags.push(tag.value);
      var pos = curTags.length - 1;
      // show new tag to screen
      showTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1 tagCross" onClick="delTag(${pos})">${tag.value} <span class="text-danger fw-bold">x</span></span>`;
    } else {
      alert("Duplicate tag cann't be added!!");
    }
    tag.value = "";
  }
});

// Adding new tag for edit form

eaddTag.addEventListener("click", (e) => {
  //If input field is not empty
  if (etag.value != "") {
    //If entered tag is not entered previously
    if (curTags.includes(etag.value) == false) {
      curTags.push(etag.value);
      var pos = curTags.length - 1;
      // show new tag to screen
      eshowTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1 tagCross" onClick="delETag(${pos})">${etag.value} <span class="text-danger fw-bold">x</span></span>`;
    } else {
      alert("Duplicate tag cann't be added!!");
    }
    etag.value = "";
  }
});

// Delete tag for add form
delTag = (pos) => {
  curTags = curTags.filter((value, index) => index != pos);
  showTags.innerHTML = "";
  curTags.forEach((value, index) => {
    showTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1" onClick="delTag(${index})">${value} <span class="text-danger fw-bold">x</span></span>`;
  });
};

// Delete tag for edit modal
delETag = (pos) => {
  curTags = curTags.filter((value, index) => index != pos);
  eshowTags.innerHTML = "";
  curTags.forEach((value, index) => {
    eshowTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1" onClick="delETag(${index})">${value} <span class="text-danger fw-bold">x</span></span>`;
  });
};

//Display all the tags to screen for add form
dispTag = () => {
  showTags.innerHTML = "";
  curTags.forEach((value, index) => {
    showTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1" onClick="delTag(${index})">${value} <span class="text-danger fw-bold">x</span></span>`;
  });
};

//Display all the tags to screen for edit form
dispETag = () => {
  eshowTags.innerHTML = "";
  curTags.forEach((value, index) => {
    eshowTags.innerHTML += `<span class="p-1 d-inline-block mb-1 bg-info text-dark rounded me-1 mb-1" onClick="delTag(${index})">${value} <span class="text-danger fw-bold">x</span></span>`;
  });
};

//Display all the bookmarks
let dispBm = document.querySelector("#bookmark");
let row = "";

dispBookmarks = (sbm = bm) => {
  dispBm.innerHTML = "";
  row = "";
  sbm.forEach((value, index) => {
    row += `<tr class="text-center">
    <th scope="row">${index + 1}</th>
    <td><a href="${value.url}" target="_blank">${value.title}</a></td>
    <td class="bookMarks">${value.category}</td>
    <td>`;
    value.tags.forEach((value) => {
      row += `<span class="p-1 d-inline-block me-1 mb-1 bg-secondary text-light rounded">${value}</span>`;
    });
    row += `</td>
    <td class="bookMarks">${value.date}</td>
    <td><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" onClick="editBookMark(${index})"><i class="fas fa-edit"></i></button></td>
    <td><button class="btn btn-danger" onClick="delBookMark(${index})"><i class="fas fa-trash"></i></button></td>
    </tr>`;
    dispBm.innerHTML += row;
    row = "";
  });
};

// Delete bookmark
delBookMark = (pos) => {
  bm = bm.filter((value, index) => pos != index);
  saveData();
  dispBookmarks();
};

//Reset the form after pressing reset button for add form
resetForm = () => {
  document.querySelector("#title").value = "";
  document.querySelector("#url").value = "";
  document.querySelector("#cat").value = "";
  curTags = [];
  document.querySelector("#addForm").classList.remove("was-validated");
  dispTag();
  showCategory();
};

//Reset the form after pressing reset button for edit form
eresetForm = () => {
  document.querySelector("#etitle").value = "";
  document.querySelector("#eurl").value = "";
  document.querySelector("#ecat").value = "";
  curTags = [];
  document.querySelector("#editForm").classList.remove("was-validated");
  dispETag();
  showECategory();
};

//Search handling

let search = document.querySelector("#search");

search.addEventListener("keyup", (e) => {
  var stext = search.value;
  var filterbm = bm.filter((value) => {
    if (
      value.title.toLowerCase().includes(stext.toLowerCase()) ||
      value.url.toLowerCase().includes(stext.toLowerCase()) ||
      value.category.toLowerCase().includes(stext.toLowerCase()) ||
      value.tags.includes(stext.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  });
  dispBookmarks(filterbm);
});

//local storage
//save data function

saveData = () => {
  localStorage.setItem("bookmark", JSON.stringify(bm));
  localStorage.setItem("category", JSON.stringify(catHist));
};

//fetch data method
fetchData = () => {
  bm =
    JSON.parse(localStorage.getItem("bookmark")) == null
      ? []
      : JSON.parse(localStorage.getItem("bookmark"));
  catHist =
    JSON.parse(localStorage.getItem("category")) == null
      ? []
      : JSON.parse(localStorage.getItem("category"));
  dispBookmarks();
  showCategory();
};

fetchData();

//Sort handling

let sortWith = document.querySelector("#sortWith");
let sortOrderForm = document.querySelector("#sortOrderForm");

let sortEle = null;

// This method will set the sory by input
sortWith.addEventListener("change", (e) => {
  sortEle = sortWith.value;
  if (sortEle == 0) {
    dispBookmarks();
    sortOrderForm.innerHTML = "";
  } else if (sortEle == "title") {
    sortOrderForm.innerHTML = `<select class="form-select" id="sortBy" aria-label="sortBy" onchange="handleSortBy()">
    <option value="asc" selected>A-Z (Ascending)</option>
    <option value="desc">Z-A (Descending)</option>
  </select>`;
    handleSortBy();
  } else if (sortEle == "category") {
    let cats = [];
    bm.map((value) => {
      if (!cats.includes(value.category)) {
        cats.push(value.category);
      }
    });
    let html = "";
    html = `<select class="form-select" id="sortBy" aria-label="sortBy" onchange="handleSortBy()">
    <option value="" selected disabled>Select category</option>`;
    cats.map((c, index) => {
      html += `<option value="${c}">${c}</option>`;
    });
    html += `</select>`;
    sortOrderForm.innerHTML = html;
  } else if (sortEle == "tag") {
    let tags = [];
    bm.map((value) => {
      value.tags.map((t) => {
        if (!tags.includes(t)) {
          tags.push(t);
        }
      });
    });
    let html = "";
    html = `<select class="form-select" id="sortBy" aria-label="sortBy" onchange="handleSortBy()">
    <option value="" selected disabled>Select tag</option>`;
    tags.map((t, index) => {
      html += `<option value="${t}">${t}</option>`;
    });
    html += `</select>`;
    sortOrderForm.innerHTML = html;
  } else if (sortEle == "date") {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    let html = `<input type="date" class="form-control" autocomplete="off" id="sortBy" aria-label="sortBy" max="${today}" onchange="handleSortBy()">`;
    sortOrderForm.innerHTML = html;
  }
});

// Sorting total bookmarks and displaying to table

handleSortBy = (e) => {
  if (sortEle == "title") {
    let sortBy = document.querySelector("#sortBy").value;
    //As sort function modify the array itelf. So, to copy an array of bm without reference, here I use filter method-> all true
    let bmc = bm.filter((value) => true);
    if (sortBy == "asc") {
      bmc.sort((a, b) => (a.title > b.title ? 1 : -1));
      dispBookmarks(bmc);
    } else if (sortBy == "desc") {
      bmc.sort((a, b) => (a.title < b.title ? 1 : -1));
      dispBookmarks(bmc);
    }
    console.log(bm);
    console.log(bmc);
  } else if (sortEle == "category") {
    let sortBy = document.querySelector("#sortBy").value;
    let bmc = [];
    if (sortBy != null) {
      bmc = bm.filter((value) => value.category == sortBy);
      dispBookmarks(bmc);
    }
  } else if (sortEle == "tag") {
    let sortBy = document.querySelector("#sortBy").value;
    let bmc = [];
    if (sortBy != null) {
      bmc = bm.filter((value) => value.tags.includes(sortBy));
      dispBookmarks(bmc);
    }
  } else if (sortEle == "date") {
    let sortBy = document.querySelector("#sortBy").value;
    sortBy = new Date(sortBy);
    var dd = String(sortBy.getDate()).padStart(2, "0");
    var mm = String(sortBy.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = sortBy.getFullYear();
    sortBy = dd + "/" + mm + "/" + yyyy;
    console.log(sortBy);
    let bmc = [];
    if (sortBy != null) {
      bmc = bm.filter((value) => value.date == sortBy);
      dispBookmarks(bmc);
    }
  }
};
