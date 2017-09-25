# AstroEducation

## Release Notes
#### New software features for this release
* UI featuring animated space background
* Glossary page of provided definitions
* Inline glossary widgets
* Tides Pre-test
* Tides educational content (8 sections)
    * Tidal islands hook
    * Gravity causes tides
    * More on Gravity
    * The high tide close to the moon explained
    * The other high tide explained
    * Other bodies that affect tides
    * Conclusion
* Tides interactive applications
    * Demo of how gravity causes orbiting bodies
    * Demo of planets interacting with each other based on gravity
    * Demo of how tides are affected by gravity
* Tides final evaluation
* Users can log in
* User scores are saved to the database
* Hosted at [cb.astroeducation.gatech.edu](cb.astroeducation.gatech.edu)

#### Bug Fixes Since Last Release
* Applications can run on Chrome

#### Known Bugs and Defects
* 3D Demo of planets interacting has some unexpected behaviours

## Install Guide
#### Prerequisites
* [Node.js](https://nodejs.org/en/) (with NPM) and [Docker](https://www.docker.com/products/overview) must be installed. 

#### Dependent Libraries
* http-server must be installed through NPM
    * `npm install -g http-server`
* Google Chrome is highly recommended for testing the website

#### Download Instructions
* Source code is available in two locations. The code should be identical in both places.
    * Github [https://github.gatech.edu/jr25/astroeducation](https://github.gatech.edu/jr25/astroeducation)
        * Allows developers to easily change code
    * Georgia Tech Web Hosting Service https://hosting.gatech.edu/
        * The actual version of the code available on the live-site

#### Development Instructions
* To run it locally on your machine
    * Clone the repository to your local machine if you haven’t already
    * Navigate to the `cb.astroeducation.gatech.edu` folder inside the astroeducation repository within the terminal.
    * Run `http-server` from the command line.
        * If you are developing functionality for the PHP API, run the command `docker-compose up`
        * The API should now be accessible at `127.0.0.1`
    * You should now immediately see changes you make at `localhost:8080`.
        * Be sure to clear cache to see changes upon reloading a page. It may help (if you're using Chrome, at least) to go into developer settings and disable the cache while dev tools is open.
* To view the live site, visit [http://cb.astroeducation.gatech.edu/#/](http://cb.astroeducation.gatech.edu/#/)
* To run tests on the code you are working on: (This is a [good idea](https://en.wikipedia.org/wiki/Test-driven_development))
    * To Run Unit tests simply run npm test
    * To Run Functional tests, do the following:
        * in terminal 1: have `httpserver` Running
        * in terminal 2: `npm run-script webdriver`
        * in terminal 3: `npm run-script func-test`

#### Uploading Instructions
* Once your pull request is merged via the contributing procedure described below, create a zip file containing all of the contents of the cb.astroeducation.gatech.edu folder.
* Login to Georgia Tech's hosting site (make sure you're on a VPN or GTWifi).
* Click on our subdomain's "File Manager" (`cb.astroeducation.gatech.edu`).
* Upload the zip file into the `cb.astroeducation.gatech.edu` folder.
* Click the checkbox next to the uploaded zip file, and click on "Extract Files" at the top of the page. Click on the check box next to the "Replace existing files" option. Click "OK".
* Be sure to remove any unnecessary files that were deleted in your pull request, as uploading in this way does not delete them.
* Ensure changes take effect by visiting the actual website.

#### Troubleshooting
* Be sure when running `http-server` from the command line that you are in the `cb.astroeducation.gatech.edu` folder. If you receive a screen with just lists of folder names, you have run the command from within the incorrect directory.
* Continuously clear your cache. No changes made to any files will be visible at `localhost:8080` if your cache is not cleared.
* No Javascript errors will occur on the site in its current state. If something is altered that causes many visual problems, check the console of your web browser for Javascript errors to find the source of the problem.

## Source Code
* Code follows the Google JavaScript Style Guide, Google HTML/CSS Style Guide, and the PHP Standard Recommendations.
* All functions have been commented to indicate their purpose and instructions on how to use them.
