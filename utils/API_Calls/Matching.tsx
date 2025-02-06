import { Decryption, Decryption_AES } from '../Encryption';
import { PrivK, Sent_Hearts, Hearts,receiverSongs,receiverIds } from '../UserData';
const SERVER_IP = process.env.SERVER_IP;

export const FetchReturnedHearts = async () => {
  const res = await fetch(`${SERVER_IP}/users/fetchReturnHearts`, {
    method: 'GET',
    credentials: 'include', // For CORS
  });
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
  }
  const data = await res.json();
  // console.log(data)
  await Promise.all(
    data.map(async (elem: any) => {
      const encoded_sha = elem.enc;
      const sha = await Decryption(encoded_sha, PrivK);

      if (sha === 'Fail') {
        return;
      }

      // console.log(sha)

      for (const key in Sent_Hearts) {
        const heart = Sent_Hearts[key as keyof Hearts];
        const my_sha = await Decryption_AES(heart.sha_encrypt, PrivK);
        // console.log(my_sha)
        if (my_sha === sha) {
          const id_plain: string = await Decryption(heart.id_encrypt, PrivK);
         console.log(id_plain)
          const id_parts = id_plain.split('-');
          if (id_parts.length !== 3) {
            console.error(`Invalid id_plain format: ${id_plain}`);
            return;
          }
          const R1 = id_parts[0];
          const R2 = id_parts[1];
          let receiverIndex = -1;

          if (receiverIds.indexOf(R1) !== -1) {
          receiverIndex = receiverIds.indexOf(R1)
          } else if (receiverIds.indexOf(R2) !== -1) {
          receiverIndex = receiverIds.indexOf(R2);
          }
          console.log(receiverIndex);
          let receiver_song = "Unknown Song"; 
          if (receiverIndex !== -1) {
            receiver_song = receiverSongs[receiverIndex];
            console.log(receiver_song)
          }
          await match(encoded_sha, id_plain,receiver_song);
        }
      }
    })
  );
};

const match = async (enc: string, id_plain: string,song: string) => {
  const res = await fetch(`${SERVER_IP}/users/verifyreturnhearts`, {
    method: 'POST',
    credentials: 'include', // For CORS
    body: JSON.stringify({
      enc: enc,
      secret: id_plain,
      song:song,
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
  }
  // console.log(`THERE IS A MATCH ${id_plain.slice(0,6)} ${id_plain.slice(6,12)}`)
};
