/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import axios from "axios";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
  } from "firebase/auth";
  import { GoogleAuthProvider } from "firebase/auth";
  import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";

  export const AuthContext = createContext(null);
  const googleProvider = new GoogleAuthProvider();
  
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const signInGoogle = () => {
      setLoading(true);
      return signInWithPopup(auth, googleProvider);
    };
  
    const signOutUser = () => {
      setLoading(true);
      return signOut(auth);
    };
  
    // const updateMyProfile = (name, photo) => {
    //   return updateProfile(auth.currentUser, {
    //     displayName: name,
    //     photoURL: photo,
    //   });
    // };
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log("Currently logged user", currentUser);
        setUser(currentUser);
        if (currentUser) {
          const userInfo = { email: currentUser?.email };
        await axios.post("https://backend-gules-alpha.vercel.app/jwt", userInfo)
        .then((res) => {
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
              setLoading(false);
            }
          });
        }
        else {
          localStorage.removeItem("access-token");
          setLoading(false);
        }
      });
      return () => {
        unSubscribe();
      };
    }, [axios]);
  
    const authInfo = {
      user,
      loading,
      setUser,
      signInGoogle,
      signOutUser,
    };
    return (
      <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;
  