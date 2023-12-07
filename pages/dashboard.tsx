"use client"
import React, { useEffect, useState } from 'react'
import {motion} from "framer-motion";
import styles from "../styles/login.module.css";
import "../styles/dashboard.css"
import Image from "next/image";
import { BsSearch } from "react-icons/bs";
import Card from "@/components/card";
import Hearts from "@/components/Hearts";
import ClickedStudent from "@/components/clickedstudent";
import "../app/globals.css";
import GoToTop from '@/components/GoToTop';
import { useRouter } from 'next/router';
import Clear from '@/components/clear';import { SendHeart } from '@/utils/API_Calls/Send_Heart';
import {receiverIds} from '../utils/UserData';

interface Student {
    _id: string;
    b: string;
    d: string;
    g: string;
    h: string;
    n: string;
    p: string;
    r: string;
    i: string;
}

const New = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [students, setStudents] = useState<Student[]>([]);
    const [access_token, setAccessToken] = useState<string | null>(null);
    const [clickedStudents, setClickedStudents] = useState<Student[]>([]);
    const [user, setUser] = useState(null);

    const handleButtonClick = (studentRoll: string) => {
        if (clickedStudents.length >= 4) {
            alert('You have already selected the maximum number of students 4.');
            return;
        }
        const student = students.find((s) => s.i === studentRoll);

        if (student && !clickedStudents.find((s) => s.i === studentRoll)) {
            setClickedStudents([...clickedStudents, student]);
        } else {
            alert('This student has already been clicked!');
        }
    };

    const handleUnselectStudent = (studentRoll: string) => {
        const updatedStudents = clickedStudents.filter((s) => s.i !== studentRoll);
        setClickedStudents(updatedStudents);
    };

    const Handle_SendHeart = async () => {
        await SendHeart_api(false)
      }
    
      const Handle_SubmitHeart = async () => {
        await SendHeart_api(true)
      }
    
      const SendHeart_api = async (Submit: boolean) => {
        if(!Submit) {
          for(let i=0; i <4; i++) {
            const id: string = clickedStudents[i]?.i
            receiverIds[i] = id
          }
        }
        const query = new URLSearchParams(window.location.search);
        const id = query.get("id")
        const isValid = await SendHeart(id as string, receiverIds, Submit)
        if(isValid) {
          // ALERT HEART SENT
          console.log("HEARTS SEND")
        }
        else {
          console.log("Error")
        }
      }

    useEffect(() => {
        if (!access_token) {
            fetchAccessToken();
        }
    }, [access_token]);

    const config = {
        APP_ID: "data-yubip",
        API_KEY: "XvhvZNBWObiDyf651zDE8LsSx59zssBKVMlTHSftn566l7rXoVrbQxnW0L2p6L5A",
        cluster_name: "Cluster0",
        db_name: "student_data",
        collection_name: "student_data",
    };

    const fetchAccessToken = async () => {
        try {
            const response = await fetch(`https://ap-south-1.aws.realm.mongodb.com/api/client/v2.0/app/${config.APP_ID}/auth/providers/api-key/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: config.API_KEY,
                }),
            });
            const data = await response.json();
            setAccessToken(data.access_token);
        } catch (error) {
            console.error("Error fetching access token:", error);
        }
    };

    const fetchData = async (search: string) => {
        try {
            if (!access_token) {
                console.error("Access token is not available.");
                return [];
            }

            const student_data = await fetch(`https://ap-south-1.aws.data.mongodb-api.com/app/${config.APP_ID}/endpoint/data/v1/action/find`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
                body: JSON.stringify({
                    dataSource: config.cluster_name,
                    database: config.db_name,
                    collection: config.collection_name,
                    filter: {
                        $or: [
                            {
                                n: {
                                    $regex: search,
                                    $options: 'i',
                                },
                            },
                            {
                                i: {
                                    $regex: search,
                                    $options: 'i',
                                },
                            },
                        ],
                    },
                    limit: 20,
                }),
            });

            const response = await student_data.json();
            return response.documents;
        } catch (error) {
            console.error("Error fetching student data:", error);
            return [];
        }
    };
    const FetchUser = async (id: string) => {
        const user = await fetchData(id);
        setUser(user[0]);
    }
    useEffect(() => {


        const { id } = router.query;
        const userId = id?.toString();
        FetchUser(userId);
        //Change it
    }, [router, FetchUser]);

    useEffect(() => {
        fetchStudents();
    }, [searchQuery]);

    const fetchStudents = async () => {
        try {
            const studentData = await fetchData(searchQuery);
            setStudents(studentData);
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const filteredStudents = students.filter((student) =>
        student.n.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.i.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stylesss = {
        backgroundImage: `url("https://home.iitk.ac.in/~${user?.u}/dp"), url("https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${user?.i}_0.jpg"), url("/_next/static/media/GenericMale.592f9e48.png")`,
      };

    return (
        <div className='box'>
            <Clear />
            <div className='hero'>
            <div className='section-A'>
                <div className='section_1'>
                    <div className="info">
                        <div className="image-container">
                            <div className="image-box">
                            <div className="profile" style={stylesss}></div>
                            </div>
                            {user && <div className="detail">
                                <div className="details-text-name">{user?.n}</div>
                                <div className="details-text" >{user?.d}</div>
                                <div className="details-text" >{user?.i}</div>
                                {/* <p>{receiverIds[0]}</p>
                                <p>{receiverIds[1]}</p>
                                <p>{receiverIds[2]}</p>
                                <p>{receiverIds[3]}</p> */}
                                <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={styles["heart-submit-button"]}
                                onClick={Handle_SubmitHeart}
                                style={{ color: "white" }}
                                // style={{ color: "black" }}
                                >
                                    Submit Button
                                </motion.div>
                            </div>}

                        </div>
                    </div>
                </div>
                
                <div className='section_2'>
                    {clickedStudents.length > 0 ?
                    <div>
                        <ClickedStudent clickedStudents={clickedStudents} onUnselectStudent={handleUnselectStudent} />
                    </div>
                        :
                        <h2>Clicked Students :</h2>
                    }
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={styles["save-button"]}
                        onClick={Handle_SendHeart}
                        style={{ color: "black"}}
                        // style={{ color: "black" }}
                    >
                        Save
                    </motion.div>
                    {/* <div onClick={Handle_SendHeart}>SEND HEART</div> */}
                </div>
            </div>
            <div className="section-B">
            <div className='section_3'><Hearts /></div>
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
                        {filteredStudents.map((student) => (
                            <Card key={student._id} student={student} onClick={handleButtonClick} clickedCheck={clickedStudents.includes(student)} />
                        ))}
                    </div>
                </div>
                <GoToTop />
            </div>
            </div>
            <Clear />
        </div>

    )
}

export default New