/* eslint-disable */
import * as Cookies from "js-cookie";

const isLocal = false;
const tokenCookieName = "Authorization";

function getBaseUrl() {
  if (isLocal) {
    return 'http://localhost:3000/';
  }
  return 'http://ubeat.herokuapp.com/';
}

function responseFunc(response, allowRedirectOnNoAuth) {
  //todo additional params in order to define accept status range
  let good = response.status >= 200 && response.status <= 299;
  if (allowRedirectOnNoAuth) {
    if (good) {
      return response.json();
    }
    else {
      genericInvalidSessionHandler();
    }
  }
  else {
    return {
      good: good,
      theJson: good ? response.json() : null,
      status: response.status
    };
  }
}

function genericInvalidSessionHandler() {
  window.location = "#/login";
}

//Needs to be tested
export function getUsers(allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}users`,
    {
      method: "GET",
      headers: {
        "Authorization": token
      }
    })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}
export function getUser(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}users/${id}`,
    {
      method: 'GET',
      headers: {
        "Authorization": token
      }
    })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function login(email, password) {
  let myBody = new URLSearchParams();
  myBody.append('email', email);
  myBody.append('password', password);
  return fetch(`${getBaseUrl()}login`,
    {
      method: 'POST',
      body: myBody
    })
    .then(response => {
      return responseFunc(response, false);
    })
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function logout() {
  Cookies.set(tokenCookieName, "");
  window.location = "/#/login";
}

export function signUp(username, email, password) {
  const theBody = new URLSearchParams();
  theBody.append('name', username);
  theBody.append('email', email);
  theBody.append('password', password);
  return fetch(`${getBaseUrl()}signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: theBody
  }).then(response => {
    return responseFunc(response, false);
  })
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getTokenInfo(allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}tokeninfo`,
    {
      headers: {
        "Authorization": token
      }
    })
    .then(response => {
      return responseFunc(response, allowRedirectOnNoAuth);
    })
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function followUser(userId, allowRedirectOnNoAuth) {
  const theBody = new URLSearchParams();
  theBody.append('id', userId);
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}follow`,
    {
      method: 'POST',
      headers: {
        "Authorization": token
      },
      body: theBody
    })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function unfollowUser(userId, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}follow/` + userId,
    {
      method: 'DELETE',
      headers: {
        "Authorization": token
      }
    })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

function genericSearch(queryString, limit, restSearchUrl, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
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
  return fetch(encodeURI(`${getBaseUrl()}${restSearchUrl}${restOfString}`),
    {
      headers: {
        "Authorization": token
      }
    })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function globalSearch(queryString, limit, allowRedirectOnNoAuth) {
  return genericSearch(queryString, limit, 'search', allowRedirectOnNoAuth);
}

export function albumSearch(queryString, limit, allowRedirectOnNoAuth) {
  return genericSearch(queryString, limit, 'search/albums', allowRedirectOnNoAuth);
}

export function artistSearch(queryString, limit, allowRedirectOnNoAuth) {
  return genericSearch(queryString, limit, 'search/artists', allowRedirectOnNoAuth);
}

export function trackSearch(queryString, limit, allowRedirectOnNoAuth) {
  return genericSearch(queryString, limit, 'search/tracks', allowRedirectOnNoAuth);
}

export function userSearch(queryString, allowRedirectOnNoAuth) {
  return genericSearch(queryString, null, 'search/users', allowRedirectOnNoAuth);
}

export function getAlbum(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}albums/${id}`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => {
      return {
        theJson: (200 <= response.status && response.status < 400 ? response.json() : responseFunc(response, allowRedirectOnNoAuth)),
        theResponse: response
      };
    })
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getTracksOfAlbum(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}albums/${id}/tracks`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getArtist(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}artists/${id}`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getAlbumsOfArtist(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}artists/${id}/albums`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function getPlaylists(allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export async function getPlaylistsFromUser(userId, allowRedirectOnNoAuth) {
  let playlists;
  let getfilteredPlaylists = function (playlists) {
    playlists = playlists.filter(playlist => playlist.owner !== undefined);
    playlists = playlists.filter(playlist => playlist.owner.id === userId);
    return playlists;
  };
  if (allowRedirectOnNoAuth) {
    playlists = await getPlaylists(allowRedirectOnNoAuth);
    playlists = getfilteredPlaylists(playlists);
    return playlists;
  }
  else {
    let res = await getPlaylists(allowRedirectOnNoAuth);
    let good = await res.good;
    if (good) {
      playlists = await res.theJson;
      playlists = getfilteredPlaylists(playlists);
      res.theJson = playlists;
    }
    return res;
  }
}

export function getPlaylist(id, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists/${id}`, {
    headers: {
      "Authorization": token
    }
  })
    .then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function addPlaylist(playlistName, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token
    },
    body: JSON.stringify({
      'name': playlistName,
    })
  }).then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function modifyPlaylistInfo(id, playlistName, owner, tracks, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token
    },
    body: JSON.stringify({
      'name': playlistName,
      'owner': owner,
      'tracks': tracks
    })
  }).then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function addSongToPlaylist(playlistId, trackObj, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": token
    },
    body: JSON.stringify(trackObj)
  }).then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch((error) => console.error(`Failed to fetch ${error.message}`));
}

export function deleteSongFromPlaylist(playlistId, trackId, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": token
    }
  }).then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

export function deletePlaylist(playlistId, allowRedirectOnNoAuth) {
  let token = Cookies.get(tokenCookieName);
  return fetch(`${getBaseUrl()}playlists/${playlistId}`, {
    method: 'DELETE',
    headers: {
      "Authorization": token
    }
  }).then(response => responseFunc(response, allowRedirectOnNoAuth))
    .catch(error => console.error(`Failed to fetch ${error.message}`));
}

