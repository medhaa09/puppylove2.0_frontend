import React, { useState } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button, Box, Checkbox } from '@chakra-ui/react';
import '../styles/selectcard.css';

const Card = ({ student, onClick, hearts_submitted, topSongs }: any) => {
  const userName = student.u;
  const roll = student.i;

  const stylesss = {
    backgroundImage: `url("https://home.iitk.ac.in/~${userName}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${roll}_0.jpg"), url("/dummy.png")`,
  };

  const [isClicked, setIsClicked] = useState(false);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);

  const clicked = () => {
    if (!isClicked) {
      onClick(student.i);
      setIsClicked(true);
    } else {
      alert('This student has already been selected');
    }
  };

  const handleCheckboxChange = (songId: string) => {
    setSelectedSong(songId === selectedSong ? null : songId);
  };

  return (
    <div className="select-card">
      <div className="select-image-box">
        <div className="select-profile" style={stylesss}></div>
      </div>
      <p className="select-card-details">{student.n}</p>
      <p className="select-card-details">{student.i}</p>
      {!hearts_submitted ? (
        <div className="carddetails">
          <button className="select-button" onClick={clicked}>
            Unselect
          </button>

          <Menu>
            <MenuButton as={Button}>
              Select Song
            </MenuButton>
            <MenuList
              maxH="300px"
              overflowY="auto"
              bg="white"
              borderRadius="md"
              boxShadow="lg"
            >
              {topSongs.map((songId: string) => (
                <MenuItem
                  key={songId}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  bg={selectedSong === songId ? "gray.100" : "gray.200"}
                >
                  <Checkbox
                    isChecked={selectedSong === songId}
                    onChange={() => handleCheckboxChange(songId)}
                    mb="2"
                  >
                    {selectedSong === songId ? "Selected" : "Select"}
                  </Checkbox>
                  <iframe
                    src={`https://open.spotify.com/embed/track/${songId}`}
                    width="250"
                    height="80"
                    allow="encrypted-media"
                    style={{ borderRadius: '8px', marginBottom: '10px' }}
                    title={songId}
                  ></iframe>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {selectedSong && (
            <Box mt="1rem">
              <iframe
                src={`https://open.spotify.com/embed/track/${selectedSong}`}
                width="160%"
                height="120"
                allow="encrypted-media"
                style={{ borderRadius: '8px' }}
                title="Selected Song"
              ></iframe>
            </Box>
          )}
        </div>
      ) : (
        <div className="carddetails">Hearts Submitted</div>
      )}
    </div>
  );
};

export default Card;
