SPOTIFOO V.1.0.0

// initial commit

-developed by Magic8Ball

Description: SPOTIFOO is a music database created using Express, Nodejs, Mongoose, MongoDB and whole lot of JavaScript.This web API collects and aggregates through music playlist data, allowing users to add music and query the data available using our conveniently predefined routes. The purpose of SPOTIFOO is to allow users to add and share music with one another.

**HOW TO GET STARTED:**
Our app uses NodeJS packages, all dependencies are listed in our package.json so you'll need to install them if you want to run our Mongo database and our express servers. You must have an up-to-date NodeJS to install our dependencies, which you can find at their site https://nodejs.org/en/download/.     

Commands to install all dependencies in git-bash: npm i

**PREREQUISITES FOR APP:** Nodejs, Express, Mongoose, bcryptjs, morgan, and dotenv.

**TEST DRIVEN DEVELOPMENT (TDD):** The process for creating this app was done using the development technique of Test-Driven-Development. What that entails is a lot of developers bashing their heads against a wall in response to writing failing tests (But far less head bashing than if they had forgone TDD). TDD dictates that tests should be written BEFORE writing functional code, this means for every important function you write you should start out creating a test with the purpose of testing that function. TDD helps navigate the unresponsive waters of back-end development where there is little feedback and even less help to know when exactly your code went astray. Using technologies like Mocha, chai, and chai-http helped us write expressive failing tests that not only provide set goals that need to be met (through a passing test), but also forces the developer to think about what they want their function's outcome to be. TDD is a testing technique as well as a brainstorming technique, understanding what you want your code to do will hone your focus and make you write more direct code. 
One thing We've learned from server-side programming is that ERRORS ARE GOOD!

**DEPLOYMENT:** We've published this API on the popular deployment site Heroku (https://spotifoo.herokuapp.com/). You can interact with the current database using the routes listed on our site (all you need to do is append those route names after the sites url), to get feedback from our database and server. Using our routes you'll get objects back containing the information from our database specific to whichever route you visit. I'll list the routes below!

##ROUTES:##

### `/users/`
    ./users/ gets all users currently signed up in our database

### `/users/id`
    ./users/id/ returns a particular user by their id

### `/songs/`
    ./songs/ route is our smallest point of entry.  ./songs/ will get you an array object of all songs currently listed in Spotifoo

### `/songs/id`
    ./songs/id/ get a select song with it's mongodb generated id.

### `/songs/top`
    .most played songs appear first.

### `/songs/alph`
    .songs appear in alphabetical order.        

### `/artists/`
    ./artists/ route gets all artists in Spotifoo's database including albums and genre

### `/artists/id`
    ./artists/id/ specific artist by id.

### `/artists/alph`
    .all artists sorted alphabetically.    

### `/artists/topGenres`
    .top genres by number of artists.

### `/albums/`
    ./albums/ shows all albums in our database, including song tracks and song length.

### `/albums/id`
    ./albums/id/ shows specific album with matching Spotifoo id.

### `/albums/alph`
    .orders album list alphabetically.     

### `/playlists/`
    .the playlists route gets all playlists.

### `/playlists/id`
    .the playlists id route get playlist by Id and to delete playlist.

### `/playlists/id/following`
    .follow another user by their user id

### `/playlists/top`
    .orders playlists by playCount, starting from most played to least played.

### `/playlists/user`
    .orders playlist by users alphabetically.

### `/plSongId/`
    .route allows for posting and deletion of playlist songs by their ID.

### `/auth/`
    .our authentication route houses our /signup /signin and /verify routes which authenticate users.                         

**AUTHORS:**
Ryan Manro (https://github.com/rmanro)
Steele Walston (https://github.com/SteeleWalston)
Jeff Lonergan (https://github.com/J3ffcon1)

Spotifoo github: https://github.com/MAGIC8BALLs/Spotifoo

**CONTRIBUTORS:**

Photos from Unsplash.com

Daniel Leone - "Poon Hill, Ghose Pani, Nepal"
Wellington Rodrigues - "Province of Bolzano - South Tyrol, Italy"
Luca Bravo - "Giau Pass, Italy"
Sergey Pesterev - "Baikal ice"

**LICENSE:**
This project is licensed under the MIT LICENSE - please see our LICENSE.md file.

**Acknowledgments:**
Thankyou Andrew, David, and Marty for all the help along the way.

