'use strict';
/* jshint esversion: 8 */

const TASTEDIVE_KEY = '397974-MusicSea-6R81OYVS';
const LASTFM_KEY = "72a97fc3ab4b19094697eeb79311a8c2";

async function getData() {
    let songName = document.querySelector("#sngName").value;
    let artistName = document.querySelector("#artName").value;
    let listeners = await getListeners(songName, artistName);
    let lyrics = await getLyrics(songName, artistName);
    let similarArtists = await getSimilarArts(artistName);
    /* If there's no song, listeners would not be a number (string type)
     but an error message (I could turn it into 0 if you want)
     Lyrics could be an empty string if there's no song
     similarArtists would be an empty array if there's no artist like
     that */
     //similarArtists should be an array of artist names if not empty
    populateResult(songName, artistName, listeners, lyrics, similarArtists);
}

async function getListeners(songName, artistName) {
    let url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${artistName}&track=${songName}&format=json`
    let result = await fetch(url).then(response => response.json());
    if ( result['error']) {
        return `${result['message']}`;
    }
    return result['track']['listeners'];
}

async function getLyrics(songName, artistName) {
    let url = `http://api.icndb.com/jokes/random?firstName=${artistName}`;
    let result = await fetch(url).then(response => response.json());
    if (result['type'] === "success")
        return result['value']['joke'];
    return "There's no joke for this Artist";
}

async function getSimilarArts(artistName) {
    //let url = `https://tastedive.com/api/similar?q=${artistName}&type=music&k=${TASTEDIVE_KEY}&limit=3`;
    //let result = await fetch(url, { mode: 'no-cors'}).then(response => response.json());
    //return result['Results'].map((artist) => artist['Name']);
    let url = "https://binaryjazz.us/wp-json/genrenator/v1/genre/"
    let result = await fetch(url).then(response => response.json());
    return result;

}

function populateResult(song, artist, listeners, lyrics, similarArtists) {
    let table = document.getElementById("tableBody");
    let rowLength = document.getElementById("tableBody").rows.length;

    let newRow = document.createElement("tr");
    newRow.setAttribute("id", `${rowLength}`);

    let songData = document.createElement("td");
    songData.innerHTML = song;
    newRow.appendChild(songData);

    let artistData = document.createElement("td");
    artistData.innerHTML = artist;
    newRow.appendChild(artistData);

    let listenersData = document.createElement("td");
    listenersData.innerHTML = listeners;
    newRow.appendChild(listenersData);

    let similarArtistsData = document.createElement("td");
    similarArtistsData.innerHTML = similarArtists;
    newRow.appendChild(similarArtistsData);

    let lyricsData = document.createElement("td");
    let lyricsDiv = document.createElement("div");
    lyricsDiv.setAttribute("style", "height:120px;width:auto;border:1px solid #ccc;font:16px/26px Georgia, Garamond, Serif;overflow:scroll;");
    lyricsDiv.innerHTML = lyrics;
    lyricsData.appendChild(lyricsDiv);
    newRow.appendChild(lyricsData);

    table.appendChild(newRow);


}

let form = document.getElementById("search");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

