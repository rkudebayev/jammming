import './App.css';
import Searchbar from './components/searchBar/Searchbar';
import Results from './components/Results/Results';
import { useState, useEffect } from 'react';
import { Spotify } from './util/Spotify';
import Playlist from './components/Playlist/Playlist';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Swal from 'sweetalert2';

function App() {
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('New Playlist');
  const [isPlaying, setIsPlaying] = useState('');
  const [playingAudio, setPlayingAudio] = useState(null);
  
  useEffect(() => {
    const initializeSpotify = async () => {
        await Spotify.getToken();
    };
    initializeSpotify();
  }, []);

  useEffect(() => {
    const storedTerm = sessionStorage.getItem('playlist');
    if (storedTerm) {
       setPlaylistName(storedTerm);
    }
  }, []);

  useEffect(() => {
      // Load tracks from session storage when the component mounts
      const savedTracks = sessionStorage.getItem('playlistTracks');
      if (savedTracks) {
          setPlaylistTracks(JSON.parse(savedTracks));
      }
  }, []);

  useEffect(() => {
      // Load search results from session storage when the component mounts
      const savedSearchResults = sessionStorage.getItem('searchResults');
      if (savedSearchResults) {
          setSearchResults(JSON.parse(savedSearchResults));
      }
  }, []);

  const addTrack = (trackFromResults) => {
    let isAdded = playlistTracks.some((track) => track.id === trackFromResults.id);
    if (!isAdded) {
      setPlaylistTracks((prevTrack) => {
        const newPlaylistTracks = [...prevTrack, trackFromResults];
        sessionStorage.setItem('playlistTracks', JSON.stringify(newPlaylistTracks));
        return newPlaylistTracks;
      })
    }
  }

  const removeTrack = (trackFromPlaylist) => {
    const updatedPlaylist = playlistTracks.filter((track) => track.id !== trackFromPlaylist.id);
    setPlaylistTracks(updatedPlaylist);
    sessionStorage.setItem('playlistTracks', JSON.stringify(updatedPlaylist));
  };

  
  const search = (term) => {
      Spotify.search(term).then(results => {
        setSearchResults(results);
        sessionStorage.setItem('searchResults', JSON.stringify(results));
      }).catch(error => {
        console.log(error.message)
    })
  } 

  const savePlaylist = () => {

    const trackUris = playlistTracks.map(track => track.uri);

    try {
        Spotify.savePlaylist(playlistName, trackUris)
        .then(() => {
            setPlaylistName('New Playlist');
            setPlaylistTracks([]);
            Swal.fire({
              toast: true,
              title: 'Success',
              text: 'Playlist saved in Spotify',
              icon: 'success',
              position: 'top-end'
            })
        })
    } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Please add tracks and fill playlist name',
          icon: 'error',
          position: 'top-end',
          toast: true,
          background: 'red',
          color: 'white'
        }) 
    }
};

const playPreview = (id) => {
  function resetAudioState() {
    setPlayingAudio(null);
    setIsPlaying('');
  }
  if (playingAudio) {
      playingAudio.pause(); 
      setPlayingAudio(null);
      setIsPlaying('');
  }
    try {
      Spotify.getPreview(id)
      .then(previewUrl => {
          if (previewUrl) {
              const audio = new Audio(previewUrl);

              audio.addEventListener('ended', resetAudioState);

              setPlayingAudio(audio);
              setIsPlaying(id);
              audio.play();
          } else {
              console.log('No preview available for this track');
              console.log(previewUrl);
          }
        })
      } catch (error) {
          console.log(error);
      }
    };


    const editPlaylistName = (name) => {
      setPlaylistName((prevName) => {
          sessionStorage.setItem('playlist', name);
          return name;
      });
  };

  return (
    <div className='body'>
        <Header />
        <Searchbar onSearch={search} />
     
      <div className='containers'>
        
         <Results  
         tracks={searchResults}
         onAdd={addTrack} 
         playlistTracks={playlistTracks}
         onPlayPreview={playPreview}
         isPlaying={isPlaying}
         />
        
         <Playlist 
         playlistName={playlistName} 
         tracks={playlistTracks}
         onRemove={removeTrack}
         onPlayPreview={playPreview}
         isPlaying={isPlaying}
         onNameChange={editPlaylistName}
         onSave={savePlaylist}
         />
       </div>
         <Footer />
    </div>
  );
}

export default App;
