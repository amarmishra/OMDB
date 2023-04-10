

const searchForm = document.getElementById('search-movie-form');
const inputBox = searchForm.getElementsByClassName('inputBox')[0];
const sumbitButton = searchForm.getElementsByClassName('sumbit')[0];

const forwardButton = document.querySelector('button.forward');
const backwardButton = document.querySelector('button.backward');
const searchResultContainer = document.querySelector(
  'div.searchResultContainer'
);
const dialogContainer = document.getElementById('movie-full-detail-container');

const originalHtml = `<div class='mainLogo'><span>O</span><span>M</span><span>D</span><span>B</span></div>`;
searchResultContainer.innerHTML = originalHtml;

let displayState; //a variable that maintain rendering state of the movies list(object of SearchResult)



  //perisistent data using localStorage(can use any database instead)

  const localStorageKey='OMDBfav_list'
  let favouriteList;
  if(localStorage.getItem(localStorageKey)){
    favouriteList=localStorage.getItem(localStorageKey).split(',')
  }
  else{
    favouriteList=[];
  }
 



class SearchResult {
  constructor(text, Search, totalResults, totalPages) {
    this.text = text;
    this.totalPages = totalPages;
    this.totalResults = totalResults;
    this.bottomPage = 1;
    this.currentPage=1
    this.topPage=1;
    this.PAGE_LIMIT=5;

    //new search list found activate displayarea
    this.addCards(Search)
    
  }
  addCards=(movies,{scrollDown}={scrollDown:true})=>{
    if(movies){
        
        const addString= movies.reduce((finalString, movie) => {
        return (
          finalString +
          `<div id="${movie.imdbID}" class="movieCard">
                              
              <div class='poster'>
                  <img alt="movie-poster" src='${movie.Poster}'/>
              </div>
              <div class='actionPanel'>
                  <span class='title'>${movie.Title}</span><span class='year'>(${movie.Year})</span>
                  <button class='likeButton' data-id=${movie.imdbID}><img src='/static/heart-orange.png' alt='Like' style='color:#E76528'/></button>
              </div>
                              
          </div>`
          )
        },'')



        if(this.bottomPage===1 && this.topPage===1){
            //add page 1
            searchResultContainer.innerHTML=addString
        
        }
        else if(scrollDown){
            //append cards below
            searchResultContainer.innerHTML+=addString
           
            
        }
        else if(!scrollDown){
            //append cards above
            searchResultContainer.innerHTML=addString+searchResultContainer.innerHTML

        }
       
    }
  }

 async forward() {
    //changes display movies by
    if (this.bottomPage < this.totalPages) {
      this.bottomPage++;
     
      
      //attach scroll response element
      searchResultContainer.innerHTML += `<div><img style="margin:auto;" src="/static/Infinity-1s-200px.svg" /></div>`
      
      const{Response,Search}= await search(this.text, this.bottomPage);

    //   let cards = document.querySelectorAll('div.movieCard');
    //   cards.forEach((card) =>
    //     card.removeEventListener('click', (e) => openDialogue(e))
    //   );
        
        if(Response){

          //remove last child(ie scroll loop element)
          searchResultContainer.removeChild(searchResultContainer.lastChild)


          this.addCards(Search,{scrollDown:true}) //add 10 new cards to the bottom
          removeScrollAndCardEventListeners()
          addScrollAndCardEventListeners()
            
        }

        // if( (this.bottomPage-this.topPage) >= this.PAGE_LIMIT){
        //     //remove 10 cards from top (ie remove top page)
        //         this.topPage++;
        //         console.log("Top page is now : Page ",this.topPage)
        //         console.log("Bottom page is now : Page ",this.bottomPage)
                
                
        //         const cards=document.getElementsByClassName('movieCard')
        //         let count=10
        //         while(cards.length > 0 && count>0){
        //             cards[0].parentNode.removeChild(cards[0]);
        //             count--;
        //         }
        //         const {scrollTop,clientHeight,clientWidth:documentWidth}=document.body;
        //         const {clientWidth : movieCardWidth}=cards[0]
        //         if(movieCardWidth*1.5 >= (documentWidth))
        //         {window.scrollTo(0,10*movieCardHeight)
        //         console.log("10 cards scroll up")}
        //         else{
        //             window.scrollTo(0,scrollTop-(clientHeight/2))
        //         }
        // }
      

     
    } else {
      console.log('End of search result ');
    }
  }

//   async backward() {
//     if (this.topPage > 1) {
//       this.topPage--;
//       this.addCards( (await search(this.text, this.topPage)).Search,{scrollDown:false} )

//     //   if( (this.bottomPage-this.topPage) >= this.PAGE_LIMIT){
        
        
//     //     //remove 10 cards from bottom (ie remove bottomPage)
//     //     this.bottomPage--;
//     //     console.log("Top page is now : Page ",this.topPage)
//     //     console.log("Bottom page is now : Page ",this.bottomPage)
        
//     //     const cards=document.getElementsByClassName('movieCard')
        
//     //     let count=10
//     //     while(cards.length > 0 && count>0){
//     //         cards[cards.length-1].parentNode.removeChild(cards[cards.length-1]);
//     //         count--;
//     //     }
//     //     window.scrollTo(0,2*doucment.body.clientHeight)

//     //   }
//     }
//   }
}

(function intializeApp() {
  inputBox.addEventListener('keyup', (e) => changeSearchResult(e));
  
})();

async function changeSearchResult(e) {
    e.preventDefault();
    const text = e.target.value;
     //attach scroll response element
     searchResultContainer.innerHTML = `<div><img style="margin:auto;" src="/static/Infinity-1s-200px.svg" /></div>`
    
     if (text) {
        try{
            const { Response, Search, totalResults, totalPages } = await search(text,1);
            if (Response) {
                if (displayState ) {
                    removeScrollAndCardEventListeners();
                   
                }
                displayState = new SearchResult(text, Search, totalResults, totalPages);
                addScrollAndCardEventListeners();
                
                // forwardButton.addEventListener('click', displayState.forward);
                // backwardButton.addEventListener('click', displayState.backward);
        
                
            } else {
            searchResultContainer.innerHTML= `<div>Cannot get any response try a different search text</div>`
            console.log('Errorrrrrrrrrrrrrrr');
            }
        }
        catch(Error){
            console.log(Error)
            
        }
          
    } else {
      console.log('Nothing to search');
      if (displayState) {
        searchResultContainer.innerHTML = originalHtml;
        // forwardButton.removeEventListener('click', displayState.forward);
        // backwardButton.removeEventListener('click', displayState.backward);
        removeScrollAndCardEventListeners();
      }
      return;
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
  dialogContainer.innerHTML=`<div><img style="margin:auto;" src="/static/Infinity-1s-200px.svg" /></div>`
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
    }</span><button class='likeButton' data-id=${
      movie.imdbID
    }><img src='/static/heart-orange.png' alt='Like' style='color:#E76528'/></button></div></div>
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
    const likeButton=dialogContainer.getElementsByClassName('likeButton')[0];

    if(dialogContainer.open){
        closeModalButton.addEventListener('click', () => {
            dialogContainer.close();
          });

        likeButton.addEventListener('click',addToFavourites)
    }
    
  } else {
    console.log(
      'Error occured: handle error by putting html content for failed response'
    );
  }
};



/*The below codes need to be put seperated modules and imported in this file*/

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

//API fetch calls
const search = async (searchText, page = 1) => {
  try {
    const response = await fetch(API_URLS.search(searchText, page));
    const { Response, totalResults, Search } = await response.json();
    if (Response) {
      return {
        totalResults,
        Search,
        Response,
        totalPages: Math.ceil(totalResults / 10),
      };
    } else {
      return {
        totalResults: 0,
        Response,
        Search: [],
        totalPages: 0,
      };
    }
  } catch (Error) {
    console.log('Error occured while fetching db', Error);
  }
};

function addScrollAndCardEventListeners() {
  //for cards
  let cards = document.querySelectorAll('div.movieCard');
  cards.forEach((card) =>
    card.addEventListener('click', (e) => openDialogue(e))
  );
  //for like button
  let likeButtons = document.querySelectorAll('div.movieCard .likeButton');
  likeButtons.forEach((likeButton) =>
    likeButton.addEventListener('click', (e) => addToFavourites(e))
  );

    //for infinite scrolling feature
    window.addEventListener("scroll", handleInfiniteScroll);


}
function removeScrollAndCardEventListeners() {
  //for card
  let cards = document.querySelectorAll('div.movieCard');
  cards.forEach((card) =>
    card.removeEventListener('click', (e) => openDialogue(e))
  );

  //for like button
  let likeButtons = document.querySelectorAll('div.movieCard .likeButton');
  likeButtons.forEach((likeButton) =>
    likeButton.removeEventListener('click', (e) => addToFavourites(e))
  );
    
  //infinite scroll
  window.removeEventListener("scroll", handleInfiniteScroll);
}



function addToFavourites(e) {
    e.preventDefault();
    const id=e.currentTarget.getAttribute('data-id')
  if(favouriteList && favouriteList.find(ele=>ele===id)){
    showNotification("Already in your favourite list.",{appearance:'error'})
  }
  else{
    favouriteList.push(e.currentTarget.getAttribute('data-id'))
    localStorage.setItem(localStorageKey,favouriteList)
    showNotification("Movie added to favourite list.",{appearance:'success'})
  }


  
  e.stopPropagation();
  return
}



//infinite scrolling option
const handleInfiniteScroll = () => {
    const {scrollTop,clientHeight,scrollHeight}=document.body;
   
    const endOfPage = (scrollTop   +  clientHeight ) >= scrollHeight ;
   // const startOfPage= scrollTop <= 0;
    if (endOfPage) {
      displayState.forward()
      console.log("End of page")
     
     
    }
    // if(startOfPage){
    //     displayState.backward()
    //     console.log("Start of page")
       
    // }
  };


//notification code
function showNotification(text,{appearance}) {
	//window.alert(text);
	const notification=document.createElement('div')
	notification.classList.add(`notification-${appearance}`);
	notification.append(document.createTextNode(text))
	document.body.appendChild(notification)
	setTimeout(()=>{document.body.removeChild(notification)},3000)

}