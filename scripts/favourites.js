//perisistent data using localStorage(can use any database instead)

const localStorageKey='OMDBfav_list'
let favouriteList
if(localStorage.getItem(localStorageKey)){
  favouriteList=localStorage.getItem(localStorageKey).split(',')
  console.log(favouriteList)
}

const favFilmContainer = document.querySelector(
    'div.fav-film-container'
  );

const dialogContainer = document.getElementById('movie-full-detail-container');

const originalHtml = `<div class='mainLogo'><span>O</span><span>M</span><span>D</span><span>B</span></div><div>Please add a movie</div>`;
   


   // API functionality
const API_ROOT = 'https://www.omdbapi.com/?apikey=ee81bd25&';

const API_URLS = {
  search: (search, page = 1) => {
    return `${API_ROOT}s=${search}${page ? `&page=${page}` : ``}`;
  },
  searchById: (id) => {
    return `${API_ROOT}i=${id}`;
  },
};


renderFavouriteFilms();


   async function renderFavouriteFilms(){

        if(favouriteList.length===0){
            favFilmContainer.innerHTML = originalHtml;
        } 
        else{
        
            favFilmContainer.innerHTML=''
            favouriteList.forEach(async (id) => {

                try{

                    const response = await fetch(API_URLS.searchById(id));
                    const { Response, ...movie } = await response.json();
                    if(Response){
                        // console.log("Movie fetched",movie)

                       
                        favFilmContainer.innerHTML+=
                        `<div id="${movie.imdbID}" class="movieCard">
                                            
                            <div class='poster'>
                                <img alt="movie-poster" src='${movie.Poster}'/>
                            </div>
                            <div class='actionPanel'>
                                <span class='title'>${movie.Title}</span><span class='year'>(${movie.Year})</span>
                                <button class='removeLikeButton' data-id=${movie.imdbID}><img src='./static/icons8-remove-96.png' alt='Like' style='color:#E76528'/></button>
                            </div>
                                            
                        </div>`
                       
                    }

                    addCardEventListeners();

                }
                catch(err){
                    console.log("Error::",err)
                }
               

            })
                    
        }
   }


  
 




   const openDialogue = async (e) => {
    e.preventDefault()
  const id = e.currentTarget.id;

  //open dialog if no already open
  if(!dialogContainer.open){
    dialogContainer.showModal();
    dialogContainer.style.width="fit-content";
    dialogContainer.style.borderRadius='50%';
  }

  //add loading animation to th dialog
  dialogContainer.innerHTML=`<div><img style="margin:auto;" src="./static/Infinity-1s-200px.svg" /></div>`
  const response = await fetch(API_URLS.searchById(id));
  const { Response, ...movie } = await response.json();

      
  if (Response) {
    dialogContainer.style.width="auto";
    dialogContainer.style.borderRadius='0';
    dialogContainer.innerHTML = `   <button id='modal-close-btn'>x</button>
            <div class='head'>
                <div class='title'><span>${
                  movie.Title
                }</span><div class='flexRow'><span class='year'>${
      movie.Year
    }</span><button class='removeLikeButton' data-id=${
      movie.imdbID
    }><img src='./static/icons8-remove-96.png' alt='Like' style='color:#E76528'/></button></div></div>
                <div class='ratings'>
                    ${movie.Ratings.map((rating) => {
                      return `<div>
                            <span>${rating.Source}</span>&nbsp;:<span class='val'>${rating.Value}</span>
                        </div>`;
                    })}
                </div>
            </div>
            <div class='body'>
                <div class='posterImg'><img alt='poster of the movie' src=${
                  movie.Poster
                }></div>
                <div class='details'>
                    <div><span>Genre:</span><span>${
                      movie.Genre ? movie.Genre : 'Not Available'
                    }</span></div>
                    <div><span>Writer:</span><span>${
                      movie.Writer ? movie.Writer : 'Not Available'
                    }</span></div>
                    <div><span>Actors:</span><span>${
                      movie.Actors ? movie.Actors : 'Not Available'
                    }</span></div>
                    <div><span>Awards:</span><span>${
                      movie.Awards ? movie.Awards : 'Not Available'
                    }</span></div>
                    <div><span>Plot:</span><span>${
                      movie.Plot ? movie.Plot : 'Not Available'
                    }</span></div>
                </div>
            </div>`
    
    
    const closeModalButton=document.getElementById('modal-close-btn')
    const removeLikeButton=dialogContainer.getElementsByClassName('removeLikeButton')[0];

    if(dialogContainer.open){
        closeModalButton.addEventListener('click', () => {
            dialogContainer.close();
          });

       removeLikeButton.addEventListener('click',removeFromFavourites)
    }
    
  } else {
    console.log(
      'Error occured: handle error by putting html content for failed response'
    );
  }
};





function addCardEventListeners() {
  //for cards
  let cards = document.querySelectorAll('div.movieCard');
  if(cards.length!==0){
    
    cards.forEach((card) =>{
        //forcard
        card.addEventListener('click', (e) => openDialogue(e))

        //for like button
        let removeLikeButton =card.getElementsByClassName('removeLikeButton')[0]
        removeLikeButton.addEventListener('click', (e) => removeFromFavourites(e))
    });

  }

}



function removeFromFavourites(e) {
    e.preventDefault();
    console.log("Length before-->",favouriteList.length)
    console.log('Remove like button clicked')
    const id=e.currentTarget.getAttribute('data-id')
  if(favouriteList && favouriteList.find(ele=>ele===id)){
    console.log("To remove id",id)
    favouriteList=favouriteList.filter((arrayId)=>{ 
        console.log(arrayId)
        return arrayId!==id
    })

    console.log("Length before-->",favouriteList.length)
    renderFavouriteFilms()

    localStorage.setItem(localStorageKey,favouriteList)
    showNotification("Removed from favourite list.",{appearance:'success'})
  }
  else{
    showNotification("Cannot remove from list.",{appearance:'error'})
  }


  
  e.stopPropagation();
  return
}

function showNotification(text,{appearance}) {
	//window.alert(text);
	const notification=document.createElement('div')
	notification.classList.add(`notification-${appearance}`);
	notification.append(document.createTextNode(text))
	document.body.appendChild(notification)
	setTimeout(()=>{document.body.removeChild(notification)},3000)

}