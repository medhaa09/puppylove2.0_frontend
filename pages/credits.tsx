import Image from 'next/image';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import '../styles/credits.css';
import Clear from '@/components/clear';
import { useEffect, useState } from 'react';
import { Student, search_students } from '@/utils/API_Calls/search';
import CreditCard from '@/components/credits-card';

const Credits = () => {
  const ld = [
    { u: 'spratham21', i: '210755', n: 'Pratham Sahu' },
    { u: 'nmeena21', i: '210667', n: 'Nikhil Meena' },
  ];
  const dg1 = [
    { u: 'amansg22', i: '220120', n: 'Aman Singh Gill' },
    { u: 'sameer22', i: '220950', n: 'Sameer Yadav' },
    { u: 'shreyash22', i: '221029', n: 'Shreya Shree' },
    { u: 'yashps22', i: '221223', n: 'Yash Pratap Singh' },
  ];
  const dg2 = [
    { u: 'manasjain23', i: '230626', n: 'Manas Jain Kuniya' },
    { u: 'medhaagar23', i: '230645', n: 'Medha Agarwal' },
    { u: 'aayusha23', i: '230065', n: 'Aayush Anand' },
  ];

  return (
    <div className="credits section_padding">
      <div>
        <h1 className="credit-font">Lead Developers</h1>
        <div className="credits-sec1">
          {ld.map((student) => (
            // <div key={student.i}>{student.i}</div>
            <CreditCard key={student.i} student={student} matched />
          ))}
        </div>
      </div>
      <div>
        <h1 className="credit-font">Developers</h1>
        <div className="credits-sec1">
          {dg1.map((student) => (
            <CreditCard key={student.i} student={student} matched />
          ))}
        </div>
        <div className="credits-sec1">
          {dg2.map((student) => (
            <CreditCard key={student.i} student={student} matched />
          ))}
        </div>
      </div>
      <Clear />
    </div>
  );
};

export default Credits;
