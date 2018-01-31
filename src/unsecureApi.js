/* eslint-disable */

const isLocal = true;
// Methods return a promise so use await methodName() to get the
// value returned by the function and associated api call.
function getBaseUrl() {
  if (isLocal) {
    return 'http://localhost:3000/';
  }
  return 'http://ubeat.herokuapp.com/';
}

export function getUsers() {
  return fetch(`${getBaseUrl()}unsecure/users`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getUser(id) {
  return fetch(`${getBaseUrl()}unsecure/users/${id}`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function searchUsersByName(theQuery) {
  let restOfString = '';
  if (theQuery) {
    restOfString = `?q=${theQuery}`;
  }
  return fetch(`${getBaseUrl()}unsecure/search/users${restOfString}`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function signUp(userName, userEmail, userPassword) {
  const theBody = new URLSearchParams();
  theBody.append('name', userName);
  theBody.append('email', userEmail);
  theBody.append('password', userPassword);
  return fetch(`${getBaseUrl()}signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: JSON.stringify(theBody)
  }).then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

function genericSearch(queryString, limit, restSearchUrl) {
  let restOfString = '';
  if (queryString && limit) {
    restOfString = `?q=${queryString}&limit=${limit}`
  }
  if (queryString && !limit) {
    restOfString = `?q=${queryString}`;
  }
  if (!queryString && limit) {
    restOfString = `?q=${limit}`;
  }
  return fetch(`${getBaseUrl()}unsecure/${restSearchUrl}${restOfString}`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function globalSearch(queryString, limit) {
  return genericSearch(queryString, limit, 'search');
}

export function albumSearch(queryString, limit) {
  return genericSearch(queryString, limit, 'search/albums');
}

export function artistSearch(queryString, limit) {
  return genericSearch(queryString, limit, 'search/artists');
}

export function trackSearch(queryString, limit) {
  return genericSearch(queryString, limit, 'search/tracks');
}

export function getAlbum(id) {
  return fetch(`${getBaseUrl()}unsecure/albums/${id}`)
    .then(response => {
      return {
        theJson: (200 <= response.status && response.status < 400 ? response.json() : 'patate'),
        theResponse: response
      };})
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getTracksOfAlbum(id) {
  return fetch(`${getBaseUrl()}unsecure/albums/${id}/tracks`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getArtist(id) {
  return fetch(`${getBaseUrl()}unsecure/artists/${id}`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getAlbumsOfArtist(id) {
  return fetch(`${getBaseUrl()}unsecure/artists/${id}/albums`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getPlaylists() {
  return fetch(`${getBaseUrl()}unsecure/playlists`)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getPlaylist(id) {
  return fetch(`${getBaseUrl()}unsecure/playlists/${id}`,)
    .then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function addPlaylist(playlistName, owner) {
  return fetch(`${getBaseUrl()}unsecure/playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': playlistName,
      'owner': owner
    })
  }).then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function modifyPlaylistInfo(id, playlistName, owner, tracks) {
  return fetch(`${getBaseUrl()}unsecure/playlists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': playlistName,
      'owner': owner,
      'tracks': tracks

    })
  }).then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function addSongToPlaylist(playlistId, trackObj) {
  return fetch(`${getBaseUrl()}unsecure/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trackObj)
  }).then(response => response.json())
    .catch((error) => console.error(`Failed to fetch ${error.message}`));
}

export function deleteSongFromPlaylist(playlistId, trackId) {
  return fetch(`${getBaseUrl()}unsecure/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE'
  }).then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function deletePlaylist(playlistId) {
  return fetch(`${getBaseUrl()}unsecure/playlists/${playlistId}`, {
    method: 'DELETE'
  }).then(response => response.json())
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}
