# 
<snippet>
  <content>
  	Project Name: MyTweet Application
A microblog/twitter like application, built and developed using Hapi.js and Hadlebars templating.
## License
Author and owner: Grigore Oboroceanu
## Installation
Download or clone project in GitHUb and import to suitable IDE.
Create new user account for testing the app. Admin user may login with email: 'admin@wit.ie' and password: 'adminkey' 
##Source tree
The repo source tree comprises two main branches: master and dev, and several branches for each of the app main features. 
The final changes are merged into dev and master and tagged as releases V-01 to v-06
## Development
This project comprizes two major development stages: stage one: from v-01 to v-03 and all commits prior to November 6, 2016; 
stage two: from v_03 to v-06 final and commits from November 6, 2016 to January 8, 2017. 

The goal of the project is to build the app in several iterations and provide a public API to be consumed by MyTweet replica mobile app. 

Link to MyTweet android mobile app on github: https://github.com/oborogri/MyTweet
Link to Aurelia SPA on github: https://github.com/oborogri/mytweet-aurelia

## Features 
The application allows a user to create and publish on its timeline a 140-character short message. Messages may incorporate inline images.
All messages published are displayed in Timeline view, which is users home page. The user may view other users messages in global timeline and follow/unfollow other users. The home timeline comprizes all friends users own messages. The user can change account details and upload profile picture. A user can delete one, a few or all of his messages from timeline.

Admin user has access to all users details and global timeline. He can add/remove a user, delete any message and view users activity graphs.

The application provides a public API which provides access to endpoints after authentication.

## Deployment
The application web server is deployed on Heroku and to AWS Linux AMI and the database is hosted on a separate MongoDB instance on AWS.<br>  
The app on Amazon:              http://52.11.78.175:4000 <br>
The app on Heroku:              https://my-tweet20073381.herokuapp.com/ <br>
The app on ghpages:             https://oborogri.github.io/mytweet-aurelia-ghpages/
