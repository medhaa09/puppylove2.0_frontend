'use client';
import React, { useEffect, useState } from 'react';
import { Button, useToast, Box } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import styles from '../styles/login.module.css';
import '../styles/dashboard.css';
import { BsSearch } from 'react-icons/bs';
import Card from '@/components/card';
import Hearts from '@/components/Hearts';
import ClickedStudent from '@/components/clickedstudent';
import '../app/globals.css';
import GoToTop from '@/components/GoToTop';
import { useRouter } from 'next/router';
import Clear from '@/components/clear';
import { SendHeart } from '@/utils/API_Calls/Send_Heart';
import { receiverIds, setUser, user } from '../utils/UserData';
import { handle_Logout } from '@/utils/API_Calls/login_api';
import { Id, Submit } from '../utils/UserData';
import { search_students, Student } from '@/utils/API_Calls/search';
import Image from 'next/image';
import SongSelector from '@/components/SongSelector';
const SERVER_IP = process.env.SERVER_IP;

const New = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  // const cancelRef = React.useRef()
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [hearts_submitted, set_hearts_submitted] = useState(Submit);
  const [clickedStudents, setClickedStudents] = useState<Student[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const handleConfirm = (selectedSongs: string[]) => {
   // console.log('Selected Song IDs:', selectedSongIds);
    setSelectedSongIds(selectedSongs);
  };

  useEffect(() => {
    toast.closeAll();
  }, []);

  useEffect(() => {
    if (Id === '') {
      router.push('/login');
    } else {
      setUser(search_students(Id)[0]);
    }
  }, []);

  useEffect(() => {
    const handle_Tab_Close = async (e: any) => {
      await handle_Logout();
      return;
    };

    if (!hearts_submitted) {
      window.addEventListener('beforeunload', handle_Tab_Close);
    }

    return () => {
      window.removeEventListener('beforeunload', handle_Tab_Close);
    };
  }, []);

  const fetchAndSelectStudents = () => {
    const selected: Student[] = [];
    for (let i = 0; i < 4; i++) {
      const id = receiverIds[i];
      if (id === '') {
        continue;
      }
      const data = search_students(id);
      if (data == undefined) {
        return;
      }
      const student = data[0];
      if (student) {
        selected.push(student);
      }
    }
    setClickedStudents([...clickedStudents, ...selected]);
  };

  useEffect(() => {
    fetchAndSelectStudents();
  }, []);

  const handleButtonClick = async (studentRoll: string) => {
    if (clickedStudents.length >= 4) {
      toast({
        title: 'You cannot select more than 4 students',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const student = students.find((s) => s.i === studentRoll);

    if (student && !clickedStudents.find((s) => s.i === studentRoll)) {
      setClickedStudents([...clickedStudents, student]);
    } else {
      toast({
        title: 'This student has already been clicked!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUnselectStudent = async (studentRoll: string) => {
    const updatedStudents = clickedStudents.filter((s) => s.i !== studentRoll);
    setClickedStudents(updatedStudents);
  };

  const Handle_SendHeart = async () => {
    await SendHeart_api(true);
  };

  const handleYes = async () => {
    console.log('YES');
    await Handle_SendHeart();
    toast.closeAll();
  };

  const handleToast = () => {
    toast({
      position: 'top',
      duration: null,
      isClosable: true,
      render: ({ onClose }) => (
        <Box bg="gray.100" borderRadius="md" p={4} textAlign="center">
          <p style={{ fontWeight: 'bold', color: 'black' }}>
            Are you sure you want to Submit?
          </p>
          <Button
            colorScheme="black"
            color="gray.800"
            bg="gray.300"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            colorScheme="pink"
            ml={2}
            onClick={() => {
              handleYes();
            }}
          >
            Yes
          </Button>
        </Box>
      ),
    });
  };

  const SendHeart_api = async (Submit: boolean) => {
    if (hearts_submitted) {
      return;
    }
    if (Submit) {
      set_hearts_submitted(true);
    }
    for (let j = 0; j < clickedStudents.length; j++) {
      const id: string = clickedStudents[j].i;
      receiverIds[j] = id;
     
    }
    for (let j = clickedStudents.length; j < 4; j++) {
      receiverIds[j] = '';
    }
    const isValid = await SendHeart(Id, receiverIds, selectedSongIds,Submit);
    if (isValid && Submit) {
      toast({
        title: 'HEARTS SENT',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } else if (!isValid && Submit) {
      toast({
        title: 'Error occurred , Hearts not sent',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } else if (!isValid && !Submit) {
      toast({
        title: 'Choices not saved',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const Logout = async () => {
    // console.log(clickedStudents)

    await SendHeart_api(false);
    const isValid = await handle_Logout();
    router.push('/');
    if (!isValid) {
      toast({
        title: 'Some error occured while Logging Out',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } else {
      toast({
        title: 'Logged Out',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  useEffect(() => {
    const updateVirtualHeart = async () => {
      // console.log(clickedStudents)
      if (clickedStudents.length) {
        await SendHeart_api(false);
      }
    };

    if (clickedStudents.length > 0) updateVirtualHeart();
  }, [clickedStudents]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const res = await fetch(`${SERVER_IP}/users/activeusers`, {
          method: 'GET',
          credentials: 'include', // For CORS
        });
        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
        }
        const active = await res.json();
        setActiveUsers(active.users);
      } catch (err) {
        // Cannot fetch Active users
        console.log(err);
      }
    };

    fetchActiveUsers();
  }, []);

  const isActive = (id: string) => {
    return activeUsers.includes(id);
  };

  useEffect(() => {
    fetchStudents();
  }, [searchQuery]);

  const fetchStudents = () => {
    if (searchQuery === '') {
      setStudents([]);
      return;
    }
    const studentData = search_students(searchQuery);
    if (studentData == undefined) {
      // console.log("Not able to Fetch Students");
      return;
    }
    setStudents(studentData);
  };

  // const handleShowStud = () => {
  //   setShowStud(!isShowStud);
  // };

  const stylesss = {
    backgroundImage: `url("https://home.iitk.ac.in/~${user?.u}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${user?.i}_0.jpg"), url("/dummy.png")`,
  };

  if (Id == '') return;

  return (
    <div className="box">
      <Clear />
      {/* LOGOUT BUTTON */}
      <div className="logout-button-div">
        <Button
          as="a"
          className="chakra-button"
          onClick={Logout}
          leftIcon={<FaSignOutAlt />}
        >
          Logout
        </Button>
      </div>
      <div className="hero">
        <div className="section-A">
          <div className="section_1">
            <div className="info">
              <div className="image-container">
                <div className="image-box">
                  <div className="profile" style={stylesss}></div>
                </div>
                {user && (
                  <div className="detail">
                    <div className="details-text-name">{user?.n}</div>
                    {/* <div className="details-text" >{user?.d}</div> */}
                    <div className="details-text">{user?.i}</div>
                    {!hearts_submitted ? (
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={styles['heart-submit-button']}
                        onClick={handleToast}
                        style={{ color: 'white', margin: '12px 0px' }}
                      >
                        Submit
                      </motion.div>
                    ) : (
                      <motion.div
                        className={styles['heart-submit-button']}
                        style={{ color: 'white', backgroundColor: 'grey' }}
                      >
                        Submitted
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* 
                    <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Submit Hearts</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button ref={cancelRef} onClick={Handle_SendHeart} colorScheme='pink' ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <div className="section_2">
      <SongSelector onConfirm={handleConfirm}/>
      </div>
          {/* <div className="section_2">
            <div className="logout-button-div">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="hide-show-btn"
                style={{
                  marginBottom: '8px',
                  position: 'sticky',
                  top: '0px',
                  cursor: 'pointer',
                }}
                onClick={handleShowStud}
              >
                {isShowStud ? 'Hide' : 'Show'}
              </motion.div>
            </div>
            <div>
              {isShowStud ? (
                clickedStudents.length > 0 ? (
                  <div>
                    <ClickedStudent
                      clickedStudents={clickedStudents}
                      onUnselectStudent={handleUnselectStudent}
                      hearts_submitted={hearts_submitted}
                    />
                  </div>
                ) : (
                  <h2>Use search to select someone</h2>
                )
              ) : (
                ''
              )}
            </div>
          </div> */}

{/* Button to open the modal */}
<div style={{ textAlign: 'center', marginTop: '1rem' }}>
  <Button
    colorScheme="pink"
    bg="pink.400" 
    _hover={{
      transform: "scale(1.1)", 
      transition: "transform 0.2s ease-in-out" 
    }}
    size="lg" 
    onClick={openModal}
  >
    Show Selections
  </Button>
</div>

        </div>
        <div className="section-B">
          <div className="section_3">
            <Hearts />
          </div>
          <div className="section_4">
            <div className="search-div">
              <BsSearch className="icon" size={20} />
              <input
                type="text"
                className="search-bar details-text "
                placeholder="Enter Name To Search."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="student-container">
              {students.length == 0 && (
                <div>
                  {/* <p>Welcome to Puppy Love</p> */}
                  <Image
                    src={'/dashboard.jpeg'}
                    alt="Logo"
                    width={500}
                    height={30}
                  />
                </div>
              )}

              {students.map(
                (student) =>
                  student.i != Id && (
                    <Card
                      key={student._id}
                      student={student}
                      onClick={handleButtonClick}
                      clickedCheck={clickedStudents.includes(student)}
                      isActive={isActive}
                      hearts_submitted={hearts_submitted}
                    />
                  )
              )}
            </div>
          </div>
          <GoToTop />
        </div>
      </div>
  {/* Modal Implementation */}
  <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
  <ModalOverlay />
  <ModalContent bg="white" color="black" borderRadius="md" padding="0.6rem" maxWidth="70%" width="100%"
  >
    <ModalHeader>My Selections</ModalHeader>
    <ModalCloseButton />

    <ModalBody
      style={{
        display: 'flex',
        flexDirection: 'column', // Adjust layout for smaller screens
        gap: '1rem',
        maxHeight: '80vh', // Prevent overflowing
        overflowY: 'auto', // Add scrolling for long content
      }}
    >
      {clickedStudents.length === 0 ? (
        <h2 style={{ textAlign: 'center' }}>Use search to select someone</h2>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column', // Stack columns for small screens
            gap: '2rem',
          }}
        >
          {/* Column for Student Cards */}
          <div>
            <ClickedStudent
                      clickedStudents={clickedStudents}
                      onUnselectStudent={handleUnselectStudent}
                      hearts_submitted={hearts_submitted} topSongs={selectedSongIds}/>
          </div>

          {/* Column for Songs */}
          <div>
            {selectedSongIds.length === 0 ? (
              <h3 style={{ color: 'black', textAlign: 'center' }}>
                Please select your top songs as well!
              </h3>
            ) : ("")
              // <div>
              //   {clickedStudents.map((student, index) => (
              //     <div
              //       key={student._id}
              //       style={{
              //         marginBottom: '1rem',
              //         display: 'flex',
              //         alignItems: 'center',
              //         justifyContent: 'center',
              //         flexDirection: 'column', 
              //       }}
              //     >
              //       {selectedSongIds[index] ? (
              //         <iframe
              //           src={`https://open.spotify.com/embed/track/${selectedSongIds[index]}`}
              //           width="250"
              //           height="200"
              //           allow="autoplay; encrypted-media"
              //           allowFullScreen
              //           style={{ borderRadius: '8px' }}
              //         ></iframe>
              //       ) : (
              //         <div
              //           style={{
              //             width: '250px',
              //             height: '200px',
              //             display: 'flex',
              //             alignItems: 'center',
              //             justifyContent: 'center',
              //             border: '1px dashed #ccc',
              //             borderRadius: '8px',
              //           }}
              //         >
              //           <p style={{ textAlign: 'center', color: '#888' }}>
              //             No song selected
              //           </p>
              //         </div>
              //       )}
              //     </div>
              //   ))}
              // </div>
            }
          </div>
        </div>
      )}
    </ModalBody>
  </ModalContent>
</Modal>

    <Clear />
    </div>
  );
};

export default New;
