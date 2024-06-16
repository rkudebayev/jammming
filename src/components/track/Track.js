import React from 'react';
import './Track.css';

function Track({track, onAdd, onRemove, isRemoval, isPlaying, onPlayPreview}) {

  const playButton = () => {
    return isPlaying === track.id ? <i className='fa-solid fa-pause'></i> :
    track.previewUrl === null ? <i className="fa-solid fa-play unclickable" onClick={ playPreview }></i> : 
    <i className="fa-solid fa-play" onClick={ playPreview }></i>;
    };
  
  const buttonRender = () => {
    if(isRemoval) {
      return <i id='remove-button' className='fa-solid fa-minus' onClick={removeTraack}></i>
    } else {
      return  <i id='add-button' className='fa-solid fa-plus' onClick={addTrack}></i>
    }
  }

  const addTrack = () => {
    onAdd(track);
  };

  const removeTraack = () => {
    onRemove(track);
  }
  
  const playPreview = () => {
    onPlayPreview(track.id);
  }

  return (
    <div className='listOfTracks'>
      <div className="track">
          <div id='play-button'>
            {playButton()}
          </div>
          <img 
            className="cover"
            src={track.image} 
            alt={track.name} 
          />
          
          <div className='track-info'>
            <p className='track-name'>{track.name}</p>                    
            <span className='artist'>{track.artist}</span>
          </div>
          <div className='add-button'>
            {buttonRender()}
          </div>
      </div>
    </div>
  )
}

export default Track
