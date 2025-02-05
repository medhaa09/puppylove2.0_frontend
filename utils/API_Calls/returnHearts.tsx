import { Encryption } from '../Encryption';
import {
  Claims,
  ReturnHearts,
  ReturnHearts_Late,
  Claims_Late,
  receiverIds,
  receiverSongs
} from '../UserData';
import { get_pubKey } from './Send_Heart';
const SERVER_IP = process.env.SERVER_IP;

export const returnHearts = async () => {
  // console.log(Claims)
  for (let i = 0; i < Claims.length; i++) {
    const sha = Claims[i].sha;
    //const song=receiverSongs[i];
    for (let j = 0; j < 4; j++) {
      const song=receiverSongs[j];
      if (receiverIds[j] === '') {
        continue;
      }
      const pubKey = await get_pubKey(receiverIds[j]);
      const enc = await Encryption(sha, pubKey);
      const song_enc = await Encryption(song,pubKey);
      ReturnHearts.push({ enc: enc, sha: sha, song:song_enc});
    }
  }
};

export const returnHearts_Late = async () => {
  if (Claims_Late.length === 0) {
    return;
  }
  // console.log(Claims_Late);
  for (let i = 0; i < Claims_Late.length; i++) {
    const sha = Claims_Late[i].sha;
    //const song=receiverSongs[i];
    for (let j = 0; j < 4; j++) {
      const song=receiverSongs[j];
      if (receiverIds[j] === '') {
        continue;
      }
      const pubKey = await get_pubKey(receiverIds[j]);
      const enc = await Encryption(sha, pubKey);
      const song_enc = await Encryption(song,pubKey);
      ReturnHearts_Late.push({ enc: enc, sha: sha, song:song_enc });
    }
  }
  const res = await fetch(`${SERVER_IP}/special/returnclaimedheartlate`, {
    method: 'POST',
    credentials: 'include', // For CORS
    body: JSON.stringify({
      returnhearts: ReturnHearts_Late,
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
  }
};
