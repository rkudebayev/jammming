import React from 'react'
import Tracklist from '../tracklist/Tracklist';
import './Results.css'

function Results({tracks, onAdd, playlistTracks, isPlaying, onPlayPreview}) {

  const filteredResults = tracks.filter(track => !playlistTracks.some(playlistTrack => playlistTrack.id === track.id));

  return (
    <div className='results'>
        <h4>Results</h4>
        <hr />
        <Tracklist 
          tracks={filteredResults} 
          onAdd={onAdd} 
          isRemoval={false}
          onPlayPreview={onPlayPreview}
          isPlaying={isPlaying}
          />
    </div>
  )
}

export default Results;
