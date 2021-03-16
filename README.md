![contributor shield](https://img.shields.io/badge/Contributors-4-%23c24d89?style=for-the-badge)![license shield](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

# <img src="https://github.com/hi-i-am-ana/Pathe-Gaumont_movie-platform/blob/df339a2d657f42ec9e6dc6df0ac2ccb8f2cf80c7/public/assets/2.png" alt="No CAAP logo" width="30"/>Movie Database :clapper:

To develop a fictitious movie rating platform for Pathé Gaumont cinemas, by accessing the API from [TMDb](https://www.themoviedb.org/). 
The website is accessible for both registered and unregistered visiors, however the ratings are only accessible for registered users. Registered users is to rate their favourite movies (between 1 and 5), thus creating Pathé Gaumont cinemas' own community score. 

## Motivation 
This is a student project only for the purpose of learning, which is a part of the 3 month web development course organised by [INCO Academy](https://www.inco.org.au/incode)

## Demo 
![Demo] https://github.com/hi-i-am-ana/Pathe-Gaumont_movie-platform/blob/52d16e046d01519f8f13d46542afd7bf87d5b730/Home%20_%20No%20CAAP%20.gif

## Technologies/Frameworks used:

- HTML, CSS, JavaScript, JQuery
- Node, Handlebars
- PostgreSQL
- TMDB API, SendGrid

## Installation

Download or clone the repo and run the following in the same folder.

```zsh
npm install
```

## Getting Started

### 1. After cloning, install the dependencies

```zsh
npm install
```

### 2. Create .env file

```
PORT=YOUR_PORT_NUMBER

POSTGRES_PORT=YOUR_POSTGRESQL_PORT
POSTGRES_DATABASE="pathe_gaumont"
POSTGRES_USERNAME="your_postgresql_username"
POSTGRES_PASSWORD="your_postgresql_password"

API_KEY = "your_tmdb_api_key"

SENDGRID_API_KEY = "your_sendgrid_api_key"
```

### 3. Open PostgreSQL and run the following scripts

This will create the database, create tables, and seed the tables.

```zsh
npm run create_database
```

```zsh
npm run create_tables
```

```zsh
npm run seed_tables
```

### 4. Start up the app

```zsh
npm run dev
```

## Contributors 
<a href="https://github.com/AmeliaLim">
  <img src="https://github.com/AmeliaLim.png" alt="Amelia Lim" width="100"/>
</a>

<a href="https://github.com/hi-i-am-ana">
  <img src="https://github.com/hi-i-am-ana.png" alt="Anastasia Chen" width="100"/>
</a>

<a href="https://github.com/cattrn">
  <img src="https://github.com/cattrn.png" alt="Cat Turnbull" width="100"/>
</a>

<a href="https://github.com/patk">
  <img src="https://github.com/patk.png" alt="Pat" width="100"/>
</a>

## Credits
All film-related metadata used in No CAAP, including actor, director and studio names, synopses, release dates, trailers and poster art is supplied by The Movie Database [TMDb](https://www.themoviedb.org/)

<img src="https://github.com/hi-i-am-ana/Pathe-Gaumont_movie-platform/blob/97c96767bb47369f5b196a9cc99515b8cf4fac0b/public/assets/TMDb.svg" alt="TMBd logo" width="200"/>

No CAAP uses the TMDb API but is not endorsed or certified by TMDb.

## Licence 
![license shield](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## Acknowledgements

- Harry Aydin
- INCO Academy
