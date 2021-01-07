'use strict';

const TASTEDIVE_KEY = '397974-MusicSea-6R81OYVS';
const LASTFM_KEY = "72a97fc3ab4b19094697eeb79311a8c2";

async function getData() {
    let songName = document.querySelector("#sgName").value;
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
    poppulateResult(listeners, lyrics, similarArtists);
}

async function getListeners(songName, artistName) {
    let url = `http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${LASTFM_KEY}&artist=${artistName}&track=${songName}&format=json`
    let result = await fetch(url).then(response => response.json());
    if ( result['error']) {
        return `Last.fm errors: ${result['message']}`;
    }
    return result['track']['listeners'];
}

async function getLyrics(songName, artistName) {
    let url = `https://api.lyrics.ovh/v1/${artistName}/${songName}`;
    let result = await fetch(url).then(response => response.json());
    return result['lyrics'];
}

async function getSimilarArts(artistName) {
    let url = `https://tastedive.com/api/similar?q=${artistName}&type=music&limit=3&k=${TASTEDIVE_KEY}`;
    let result = await fetch(url, {mode: 'no-cors'}).then(response => response.json());
    return result['Results'].map((artist) => artist['Name']);
}