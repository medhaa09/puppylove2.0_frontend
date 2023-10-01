import React, { useState } from "react";
import styles from "../styles/login.module.css"; // Import your CSS module
import { MdEmail } from "react-icons/md";
import "../app/globals.css";
import Link from "next/link";
import { motion } from "framer-motion";
import Dog from "@/components/Dog";
import Clear from "@/components/clear";

const RegisterPage: React.FC = () => {
  const [data, setData] = useState({
    username: "",
    rollNo: "",
    email: "",
    password: "",
  });

  const handleLog = () => {
    console.log(data);
    setData({ username: "", rollNo: "", email: "", password: "" });
    console.log(data);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data);
  };

  return (
    <div>
      <Clear/>
    <div className={styles["login-box"]}>
      <div className={styles["login-box2"]}>
        <Dog />
        <div className={styles["login-container"]}>
          <h1 className={styles["login-title"]}>Register</h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={styles["login-form-group"]}
          >
            <MdEmail size={18} />

            <input
              className={styles["login-input"]}
              type="email"
              name="email"
              value={data.email}
              onChange={handleSubmit}
              required
              placeholder="Email"
            />
          </motion.div>
          <div className={styles["login-bottom"]}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles["login-submit-button"]}
            >
              <Link style={{ color: "black"}} href={"/login"}>Go to Login</Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={styles["login-submit-button"]}
              onClick={handleLog}
            >
              <Link href={"/verify"} style={{ color: "black"}}>Send OTP</Link>
            </motion.div>
          </div>
        </div>
        <Link href={'/'} className={styles["close-button"]}>
          &times;
        </Link>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;
