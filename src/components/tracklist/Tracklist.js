import React from 'react';
import Track from '../track/Track';

function Tracklist({tracks, onAdd, onRemove, isRemoval, isPlaying, onPlayPreview}) {
  return (
    <div>
        {
            tracks && tracks.map(track => {
                return (           
                <Track 
                    key={track.id}
                        track={track}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        isRemoval={isRemoval}
                        onPlayPreview={onPlayPreview}
                        isPlaying={isPlaying}

                />
                    )})
        }
    </div>
  )
}

export default Tracklist;
