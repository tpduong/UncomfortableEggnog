# Jarvis - Web Application

> Javis - Web Application is the web component of our [Jarvis Voice Command](https://github.com/UncomfortableEggnog/UncomfortableEggnog-Desktop) Desktop Application for Mac OS.  The web application is deployed at [voicecommand.herokuapp.com](https://voicecommand.herokuapp.com).  You can download the desktop application, create and share packages directly from our website.

## Team

  - __Product Owner__: Mitchell Wilcox
  - __Scrum Master__: Tracy Duong
  - __Development Team Members__: Andres Morales, Yilen Pan

## Table of Contents

1. [Usage](#Usage)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Requirements](#requirements)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> - __Download Jarvis Voice Command Desktop Application__
> Download Jarvis Voice Command Desktop Application for Mac OS at [voicecommand.herokuapp.com](http://voicecommand.herokuapp.com).  Jarvis is not available for Windows or Linux.


> - __Sign up / Log in__
> You can sign up directly through our [website](https://http://voicecommand.herokuapp.com/#/signup).  Or if you have a GitHub, Google or Facebook account, you can skip the sign up, and [log in](http://http://voicecommand.herokuapp.com/#/login) through our web portal.


> - __Create a package__
> To create a package, you need to be logged in.  Start by going to the [create package](http://http://voicecommand.herokuapp.com/#/package/create) page, or navigate to it from [My Account](http://http://voicecommand.herokuapp.com/#/user/tpduong) page.
>
>  - **title**: Required field, limited to 15 characters of letters, numbers and spaces.
>
>  - **command**: The phrase you tell Jarvis to execute the corresponding action
>
>  - **action**: The shell script to be executed upon utterance of the corresponding command.  You can have zero, one, or multiple arguments in an action.  
>    - Arguments must be in the following format: _< ARG del='+' quote=true case='proper' >_
>     - del specifies the delimiter. RegExp: _'del="(?:.{1,5})"'_
>     - quote specifies if the argument is surrounded by quotes.  Values can either be true or false. RegExp: _'quote=(?:true|false)'_
>     - case specifies whether the argument is 'upper', 'lower' or 'proper' case. RegExp: _'case=(?:"upper"|"lower"|"proper")'_
>     - Example without argument:
>     ```sh
>     say $(date +'%r')
>     ```
>     - Example with argument:
>      ```sh
>      open <ARG del='\\ ' capitalize=true/>.app
>      ```
>
> - __Edit or Delete a package__
> To edit or delete a package, click on the title of a package that you created, then click on "Edit this package".  When editing a package, please follow the same rules as in create package.  To delete a package, click on "Delete Package" towards the bottom of the screen.
>
>
> - __Search packages by title or description__
> You can search for a package by title or description.  Enter a search query in the search box and click "Submit".
>
>
> - __Add a review / Rate a package / Download a package__
> To write a review, rate a package, or download a package, click on the name of that package.  You can only review and rate a package once.  If you rate a package a second time, it will replace the first review and rating.

> - __Further Instructions__
> Visit our GitHub repo for Jarvis Voice Command Desktop Application for further instructions on how to use the desktop app.


## Development

### Requirements
- Node 0.10.x
- MongoDB

### Installing Dependencies

From within the project root directory:

```sh
sudo npm install -g bower
npm install
bower install

```
You will also need MongoDB.  If you don't have MongoDB installed, follow the installation steps on [docs.mongodb.org](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
