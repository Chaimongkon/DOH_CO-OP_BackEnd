// app/components/ActivityMonitor.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const ActivityMonitor = () => {
  const { data: session } = useSession();
  const lastActivityTimeRef = useRef(Date.now());

  // Function to update the last activity time when activity is detected
  const handleUserActivity = () => {
    lastActivityTimeRef.current = Date.now();
  };

  useEffect(() => {
    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []); // Empty dependency array ensures this runs once

  // Periodically check for inactivity (e.g., every 30 seconds)
  useEffect(() => {
    if (!session) return; // Avoid setting intervals if there's no session

    const checkInactivity = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityTimeRef.current;
      const maxInactivityTime = 30 * 60 * 1000; // 30 minutes

      if (timeSinceLastActivity > maxInactivityTime) {
        // Log the user out using NextAuth's signOut function
        signOut({ callbackUrl: "/Login" }); // Redirect to login page after sign out
      }
    }, 30 * 1000); // Check every 30 seconds

    return () => clearInterval(checkInactivity); // Cleanup interval on component unmount
  }, [session]); // Only rerun if the session changes

  return null; // This component doesn't render anything, just handles session monitoring
};

export default ActivityMonitor;
