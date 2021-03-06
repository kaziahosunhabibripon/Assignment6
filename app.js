const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  toggleSpinner();
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` 
    <div class="img-fluid">
      <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
        <h6 class="p-2 text-center"> ${image.tags} </h6>
        <span class="p-2 text-left"> comments: ${image.comments} </span>
        <span class="p-2 text-left">favorites: ${image.favorites}</span>
        <span class="p-2 text-left">likes: ${image.likes}</span>
        <span class="p-2 text-left"> Downloads: ${image.downloads}</span>
      </div>
      
    `;
    gallery.appendChild(div)
  })
  
  
}
const getImages = async(query) => {
  toggleSpinner();
  try{
    const res = await fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`);
    const data = await res.json();
    showImages(data.hits);
    document.getElementById("search").value='';
  }
  catch(err) {
    console.log(err);
    toggleSpinner();  
  }
  
}

// Enter key function for search box
  document.getElementById("search").addEventListener("keypress", function(event){
    if(event.key == "Enter"){
      document.getElementById("search-btn").click(); 
    }
  } ) 

// Enter key function for slide range duration
document.getElementById("duration").addEventListener("keyup", function(event){
  if(event.keyCode === 13){
    document.getElementById("create-slider").click(); 
  }
})

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } 
  else{
    sliders = sliders.filter((element, index, newSliders) => index != newSliders.indexOf(img));
    element.classList.remove('added');
  }
}

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }

  const duration = document.getElementById("duration").value;
  if(duration >=1000){
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';

  // hide image aria
  imagesArea.style.display = 'none';

  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
  
  })
  
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}
}
// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider();
})

const toggleSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.toggle('d-none');
}


// function for input only number
var number = document.getElementById('duration');

//  input event on numInput.
number.onkeydown = function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
  }
