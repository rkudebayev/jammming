import React, { useState} from 'react';
import './SearchBar.css'

function Searchbar({onSearch}) {
  const [term, setTerm] = useState('');
  
  const handleKeyPress = (event) => {
    // Check if the pressed key is "Enter"
    if (event.key === 'Enter' || event.key === 'Go' || event.key === 'Search') {
       onSearch(term);
    }
 };


  return (
    <div className='search-bar'>
      <div className='search-input'>
        <input 
          onChange={e => {setTerm(e.target.value)}} 
          className='form-control' 
          type='text' 
          placeholder='Find your song' 
          onKeyDown={handleKeyPress}
        />
      </div>
      <div>
      <button onClick={(e) => {onSearch(term)}} className='search-button'>Search</button>
      </div>
    </div>
  )
}

export default Searchbar
