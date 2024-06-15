
const client_id = process.env.REACT_APP_CLIENT_ID;
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const redirectUri = 'https://super-jammming.netlify.app/'


let access_token = '';
let accessToken = '';

export const Spotify = {
  
  //requesting a token
  async getToken() { 
    if (access_token) {
      return access_token;
    }
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
      method: "POST",
      headers: {
        'Content-Type': "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
      json: true,
    })
    if (response.ok) {
      const jsonResponse = await response.json();
      access_token = await jsonResponse.access_token;
      sessionStorage.setItem('access_token', access_token)
      return access_token;
    }
  } catch(error) {
    console.error('Error fetching access token:', error);
  }
},

// search request


search(term) {
  Spotify.getRefreshToken();

  return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
          Authorization: `Bearer ${access_token}`
      }
  })
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Spotify Access Token Request Failed!');
      })
      .then(data => {
          if (!data.tracks || !data.tracks.items) {
              return [];
          }
          return data.tracks.items.map(track => ({
              id: track.id,
              trackUrl: track.external_urls.spotify,
              image: track.album.images[1].url,
              name: track.name,
              artist: track.artists[0].name,
              artistUrl: track.artists[0].external_urls.spotify,
              album: track.album.name,
              albumUrl: track.album.external_urls.spotify,
              uri: track.uri,
              previewUrl: track.preview_url
          }));
      })
      .catch(error => {
          console.log(error);
          return [];
      });
},
  // preview of songs

  async getPreview(id) {
      Spotify.getRefreshToken();
      try {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
          headers: { 
            Authorization: `Bearer ${access_token}`,
            'content-type': 'application/json'
          }
        })
          if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.preview_url;
          }
      } catch (error) {
        console.log(error)
      }
},

savePlaylist(playlistName, trackUris) {

  if (!playlistName || !trackUris.length) {
    return;
  }
  const accessToken = Spotify.getAccessToken();
  let userId;
  
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}` ,
    },
  })
  .then(response => { 
    if (response.ok) {
      return response.json();
    }
    throw new Error ('Saving playilist failed!')
  })
  .then(jsonResponse => {
    userId = jsonResponse.id;
    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}` 
      },
      method: 'POST',
      body: JSON.stringify({ name: playlistName })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error ('Saving playlist name failed!')
    })
    .then(jsonResponse => {
      const playlistId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: {
        Authorization: `Bearer ${accessToken}` 
          },
        method: 'POST',
        body: JSON.stringify({ uris: trackUris })
      })
    })
  })
},

//spotify policy

getAccessToken() {
  // Check if the user’s access token is already set
  if (accessToken) {
      return accessToken;
  }

  // Check if the access token is in the URL
  const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
  const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

  if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // Clear the access token and URL parameters after expiration
      window.setTimeout(() => {
          accessToken = '';
      }, expiresIn * 1000);

      window.history.pushState('Access Token', null, '/'); // Clear the URL
      return accessToken;

      // Redirect the user to the Spotify authorization endpoint
  } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

      window.location = accessUrl;
  }
},

async getRefreshToken() {

  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem('refresh_token');
  const url = "https://accounts.spotify.com/api/token";

   const payload = {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     body: new URLSearchParams({
       grant_type: 'refresh_token',
       refresh_token: refreshToken,
       client_id: client_id
     }),
   }
   const body = await fetch(url, payload);
   const response = await body.json();

   localStorage.setItem('access_token', response.accessToken);
   localStorage.setItem('refresh_token', response.refreshToken);
 },

}
