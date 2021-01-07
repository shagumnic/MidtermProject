'use strict';
/* jshint esversion: 8 */

const TASTEDIVE_KEY = '397974-MusicSea-6R81OYVS';
const LASTFM_KEY = "72a97fc3ab4b19094697eeb79311a8c2";

var myAlbum = [];
var categoryName = ['songData', 'artistData', 'listenersData', 'genreData', "jokeData"];
async function getData() {
    let songName = document.querySelector("#sngName").value;
    let artistName = document.querySelector("#artName").value;
    let listeners = await getListeners(songName, artistName);
    let genre = await getGenre();
    let joke = await getJoke(artistName);
    /* If there's no song, listeners would not be a number (string type)
     but an error message (I could turn it into 0 if you want)
     Lyrics could be an empty string if there's no song
     similarArtists would be an empty array if there's no artist like
     that */
     //similarArtists should be an array of artist names if not empty
    populateResult(songName, artistName, listeners, genre, joke);
}

async function getListeners(songName, artistName) {
    let url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${artistName}&track=${songName}&format=json`
    let result = await fetch(url).then(response => response.json());
    if ( result['error']) {
        return `${result['message']}`;
    }
    return result['track']['listeners'];
}

async function getJoke(artistName) {
    let url = `http://api.icndb.com/jokes/random?firstName=${artistName}`;
    let result = await fetch(url).then(response => response.json());
    if (result['type'] === "success")
        return result['value']['joke'];
    return "There's no joke for this Artist";
}

async function getGenre() {
    //let url = `https://tastedive.com/api/similar?q=${artistName}&type=music&k=${TASTEDIVE_KEY}&limit=3`;
    //let result = await fetch(url, { mode: 'no-cors'}).then(response => response.json());
    //return result['Results'].map((artist) => artist['Name']);
    let url = "https://binaryjazz.us/wp-json/genrenator/v1/genre/"
    let result = await fetch(url).then(response => response.json());
    return result;

}

function populateResult(song, artist, listeners, genre, joke) {
    let table = document.getElementById("tableBody");
    let rowLength = document.getElementById("tableBody").rows.length;

    let newRow = document.createElement("tr");
    newRow.setAttribute("id", `${rowLength}`);

    let songData = document.createElement("td");
    songData.innerHTML = song;
    songData.setAttribute("id", "songData");
    newRow.appendChild(songData);

    let artistData = document.createElement("td");
    artistData.innerHTML = artist;
    artistData.setAttribute("id", "artistData");
    newRow.appendChild(artistData);

    let listenersData = document.createElement("td");
    listenersData.innerHTML = listeners;
    listenersData.setAttribute("id", "listenersData")
    newRow.appendChild(listenersData);

    let genreData = document.createElement("td");
    genreData.innerHTML = genre;
    genreData.setAttribute("id", "genreData")
    newRow.appendChild(genreData);

    let jokeData = document.createElement("td");
    jokeData.innerHTML = joke;
    jokeData.setAttribute("id", "jokeData");
    newRow.appendChild(jokeData);

    table.appendChild(newRow);

    let newData = {}
    for (let i of categoryName) {
        newData[i] = document.querySelector(`tr[id='${rowLength}'] > td[id='${i}']`).innerHTML; 
    }
    myAlbum.push(newData);
    
}

function saveData() {
    localStorage.setItem('local_album', JSON.stringify(myAlbum));
}

function loadData() {
    myAlbum = [];
    let album = localStorage.getItem("local_album");
    album = album ? JSON.parse(album) : [];
    for (let data of album) {
        populateResult(data[categoryName[0]], data[categoryName[1]], data[categoryName[2]], data[categoryName[3]], data[categoryName[4]]);
    }
}

function clearData() {
    myAlbum = [];
    let tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
}

let form = document.getElementById("search");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

