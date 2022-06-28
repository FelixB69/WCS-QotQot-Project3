import { useSession } from "next-auth/react";
import { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useCallback } from "react";

export const CurrentUserContext = createContext({});

export default function CurrentUserContextProvider({ children }) {
  const { status } = useSession();

  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [orderNumberState, setOrderNumberState] = useState("");
  const [orderStatut, setOrderStatut] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentUserLogged = useMemo(
    () => currentUserProfile,
    [currentUserProfile]
  );

  const getProfile = useCallback(() => {
    axios
      .get("/api/profile")
      .then(({ data }) => {
        setCurrentUserProfile(data);
      })
      .catch(() => {
        // when we have a stale cookie, disconnect
        // signOut();
      });
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      getProfile();
    } else if (status === "unauthenticated") {
      setCurrentUserProfile(null);
    }
  }, [status, getProfile]);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUserProfile,
        currentUserLogged,
        setCurrentUserProfile,
        getProfile,
        status,
        orderNumberState,
        setOrderNumberState,
        orderStatut,
        setOrderStatut,
        orderDate,
        setOrderDate,
        orderAmount,
        setOrderAmount,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
