import React from 'react'
import Tracklist from '../tracklist/Tracklist';
import './Playlist.css'

function Playlist({tracks, onRemove, isPlaying, onPlayPreview, onNameChange, playlistName, onSave}) { 
  const handleChangeName = (e) => {
    onNameChange(e.target.value)
  }

  
  return (
    <div className='playlist'>
      <input 
      placeholder='New Playlist'
      onChange={handleChangeName}
      id='name'
      value={playlistName}
      />
      <hr />
      <Tracklist 
        tracks={tracks} 
        onRemove={onRemove} 
        isRemoval={true}
        onPlayPreview={onPlayPreview}
        isPlaying={isPlaying}
      />
      <div className='add-button'>
       <button type='button' className='button' onClick={onSave}>Save to Spotify</button>
      </div>
    </div>
  )
}

export default Playlist;
