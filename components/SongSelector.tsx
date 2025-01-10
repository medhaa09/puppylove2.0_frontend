import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SongSelectorProps {
  onConfirm: (selectedSongIds: string[]) => void;
}

const SongSelector: React.FC<SongSelectorProps> = ({ onConfirm }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState<any[]>([]);
  const [accessToken, setAccessToken] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const clientId = '';
      const clientSecret = '';
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      setAccessToken(response.data.access_token);
    };
    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!searchQuery) {
        setSongs([]);
        return;
      }

      setIsLoading(true);
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchQuery,
          type: 'track',
          limit: 10,
        },
      });
      setSongs(response.data.tracks.items);
      setIsLoading(false);
    };

    const debounceTimeout = setTimeout(fetchSongs, 200); // Debounce search
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, accessToken]);

  const handleSongSelection = (song: any) => {
    if (selectedSongs.some((s) => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter((s) => s.id !== song.id));
    } else if (selectedSongs.length < 4) {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm(selectedSongs.map((song) => song.id));
    setSearchQuery(''); // Clear search bar
    setSongs([]); // Clear search results
  };
  const handleEdit = () => {
    setIsConfirmed(false);
  };

  const handleRemoveSong = (songId: string) => {
    setSelectedSongs(selectedSongs.filter((song) => song.id !== songId));
  };

  return (
    <div style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}>
      <h2>Select your top 4 songs</h2>
      <input
        type="text"
        placeholder="Type a song name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 15px',
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
          border: '2px solid #ff69b4',
          borderRadius: '20px',
          outline: 'none',
          fontSize: '16px',
          color: '#333',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#ff1493')}
        onBlur={(e) => (e.target.style.borderColor = '#ff69b4')}
      />

      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: '5px' }}>
          <span>Loading...</span>
        </div>
      )}

{selectedSongs.length > 0 && (
  <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f2f2f2', borderRadius: '8px' }}>
    <h3>Your Top 4 Songs:</h3>
    {selectedSongs.map((song) => (
      <div key={song.id} style={{ position: 'relative', marginBottom: '5px' }}>
        <iframe
          src={`https://open.spotify.com/embed/track/${song.id}`}
          width="100%"
          height="80"
          allow="encrypted-media"
          title={song.name}
          style={{ borderRadius: '8px' }}
        ></iframe>
        {!isConfirmed && (
          <button
            onClick={() => handleRemoveSong(song.id)}
            style={{
              position: 'absolute',
              top: '-10px',  
              right: '-15px',
              backgroundColor: 'transparent',
              border: 'none',
              color: 'black',
              fontSize: '23px',
              cursor: 'pointer',
            }}
          >
            &times;
          </button>
        )}
      </div>
    ))}
  </div>
)}


      {selectedSongs.length > 0 && (
        !isConfirmed ? (
          <button
            onClick={handleConfirm}
            style={{
              marginTop: '10px',
              padding: '10px 15px',
              backgroundColor: selectedSongs.length < 4 ? '#d3d3d3' : '#ff69b4', 
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '16px',
              cursor: selectedSongs.length < 4 ? 'not-allowed' : 'pointer', 
              width: '100%',
            }}
            disabled={selectedSongs.length < 4}
          >
            Confirm My Choices
          </button>
        ) : (
          <button
            onClick={handleEdit}
            
            style={{
              marginTop: '10px',
              padding: '10px 15px',
              backgroundColor: '#ff69b4',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Edit My Top 4
          </button>
        )
      )}

      <div style={{ marginTop: '10px' }}>
        {songs.map((song) => (
          <div key={song.id} style={{ marginBottom: '3px', width: '100%', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedSongs.some((s) => s.id === song.id)}
              onChange={() => handleSongSelection(song)}
              disabled={isConfirmed || (!selectedSongs.some((s) => s.id === song.id) && selectedSongs.length >= 4)}
              style={{ marginRight: '10px' }}
            />
            <iframe
              src={`https://open.spotify.com/embed/track/${song.id}`}
              width="90%"
              height="80"
              allow="encrypted-media"
              title={song.name}
              style={{ borderRadius: '8px' }}
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongSelector;
