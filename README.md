                                   # OMDB
         Open Movie Database Base frontend project using plain vanillaJS.

                                  #  Introduction

        Placing html tags or components is not challenging if one has 
        conceptual understading of CSS options of placing elements. 
        
        Flex and Grids layout are saviours for 
        faster development 

        a. The challenge in the frontend project is well thought of design(user engagement)

        b. Yet another challeges is the presentation of raw data(not refined perfectly for the view)
                                    
                                    
                                #    Premise

              The project developement focused on frontend challenges and skills in vanillaJS() .

              The backend service utilizes OMDB api.(https://www.omdbapi.com/)
              I have put all modular functions in one single javascript file.(styles/OMDb.js file)


              The basic design of the app is trivial for someone with good grasp of css basics
              in placement of tags.(I have heavily relied on the flex box style).
   
                             




                               # Challenges Faced: The three views



            Poster images of movies of different size.
            Raw data is always a challengs for frontend development. 

            1.For asthetics purpose it's better to keep movie-cards of common height rather than to resize then based on the content(different image dimensions)

            2. CLipped the name of the movie title so that they fit the width of movie-card component.


                          #      Add On:

            1.Loader image- 
            
            Added when data is being loaded from the backend and removed as the loading is complete.

            2. Creating infinite scrolling- 
            
            To add large dataset, the frontend is not burned with
            entire dump of data at a single go.
            Rather as user scrolls and is need for more data, then only asynchronous calls are made to fetch the additional data
