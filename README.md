# Installation:

get the zip or git clone this repo. Cd into the root of the folder and run `npm install`.

# Running:

After having installed, run  `npm run init` to start the backend server.
The console should say: `API listening at http://localhost:8080`

On a separate terminal, you can then run the test file as instructed: `npm run start`



# My Notes during development below:

## step 0:
Read the instructions :D 
Noticed that there is no need for a CRUD, and the data comes in a nicely formatted JSON. Therefore, no need to create a database and link it to an ORM (any production app would obviously need those).

The authorization is a simple static bearer token (again, this wouldnt fly on a real app), so a simple middleware that parses the request to validate the bearer token should be ok. Let's use `express` for that: (install with `npm install express`).
Get `nodemon` as well and edit the `package.json` to easily run that (nodemon can be a dev-dependency only).

### step 0.5:
Install `fs` as well, to handle the file (I am not familiar with fs-extra that came in the original repo, and now
probably isnt the time to discover some quirky difference).


## step 1
make a basic express server, let a home page public (no bearer token). Implement the middleware.
EDIT: I leave some comments (and bits of older code) in the actual code, that show part of the development process, most of that would obviously be cleaned up (as well as setting a decent logging system that isnt based on console.log)

### step 1.5
Seems that postman wants to send Bearer with capital B... Authentication headers are generally case insensitive, but an OR will serve for now
EDIT: found some new settings in postman, leaving the old code visible. Totally worth the 2 minutes googling the issue -> https://github.com/postmanlabs/postman-app-support/issues/4727

## step 2
make an object that houses the filters that we want to apply to find the result. 

EDIT: made a routes file and implemented a router, to avoid a very large main file.

The *tag* should be treated differently from the other filter criteria. We want to see if the object in our collection contain the tag we receive in the request, while for the remainder of the filters, we want equality also, in the collection ( = addresses.json), its tags (notice the s), while its only tag in the request.

Use a variable that says if the entry from the collection is valid as we apply the multiple criteria. Then, if after the checks from the incoming url match something, *valid* is true, and it means we want to keep that

## step 3
while I trust my math skills, probably someone has something that I can reuse.

Yes, found something [here](https://www.movable-type.co.uk/scripts/latlong.html) , the math seems close to what I pictured in my mind quickly, and the results match from the test. I'll use it and keep the url of the source in the code.

### step 3.1
Move the distance calculation to another file, doesnt make sense to have it in the routes file (helper file).

### step 3.2
Failing the test due to me having more precision/decimal places :(  toFixed(2) should handle it (and make it a number, not the string that has 2 decimal places)

## step 4 
We want to receive a request that can be heavy and tell the requester that we are working on it (while we process it). We should send them the URL for where their response will be. In a proper app, this url will probably be made with a uuid (I also added a request id that should be randomly generated, and could be helpful for logging).
Both the response url and requestId are static in this challenge, so, set them statically

### step 4.1
While we send the user their response with the url where they can find the results, we should start computing the response ( using an async call to processRequest).
EDIT: didnt like sending the http 127.0.... part statically, quick minute of google fu, and a better version is implemented  answer from [here](https://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express)

### step 4.2
when the user visits area-result, we will be checking our global variables to see if our results is already available. In this simple use case, I didnt implement {requestId : [results]} or {requestId: statusOfCall}.
In a more real app, we would obviously need to differentiate all the calls to area-result from each other.
Memory cleanup after we are done with this result would also be handy. It is the kind of results that we would make the users browser/device cache, to avoid computing it repeatedly

### step 4.3
Not passing the test, getting 16 results instead of 15.... Need to debug it deeper.
Well, not happy. The possible difference I see, is that the address that is the source of the search for the area of the search is also in my results. I guess it is a matter of discussing if that is acceptable or not, but in my mind, an address is technically within distance 0 of itself. I get that in a response to a query, we will likely want to exclude it from the results, and that probably the backend should do this data handling, but still, dumb time wasted on this bug

## step 5
Export the data to the user -> setting headers and res.write should handle the data streaming nicely.
(I tend to be a bit overzealous on the headers, it is an area that I should improve on, understand them better to fully understand when, how and why to use them).

### step 5.1
Make the stream in the shape that the test file wants (JSON array)

### step 5.2
remove the last comma, it was blowing up the test since it couldnt be parsed. Running out of my self imposed (less than 3h) time limit, so quick and dirty IF (to not have that last comma) it is

## step 6
Remove commented code, some console logs and improve the readme. Commit and push to git.

---
---

# GAN Integrity backend code challenge

The script `index.js` uses a local api to perform various operations on a set of cities. Your task is to implement an api so that the script runs successfully all the way to the end.

Run `npm install` and `npm run start` to start the script.

Your api can load the required data from [here](addresses.json).

In the distance calculations you can assume the earth is a perfect sphere and has a radius is 6371 km.

Once you are done, please provide us with a link to a git repo with your code, ready to run.
