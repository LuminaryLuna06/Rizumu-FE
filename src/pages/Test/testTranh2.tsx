import axiosClient from "@rizumu/api/config/axiosClient";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState } from "react";

function testTranh2() {
  const [room, setRoom] = useState();
  // const { user, isLoading } = useAuth();
  // useEffect(() => {
  //   const getRoom = async () => {
  //     if (user && !isLoading) {
  //       const response = await axiosClient.get(
  //         `/room/id/${user?.current_room_id}`
  //       );
  //       console.log(response);
  //     }
  //     // setRoom(response);
  //   };
  //   getRoom();
  // }, [user]);
  return (
    <div className="bg-primary h-[30vh]">
      <TextInput label="Hello World" placeholder="Hello there" />
    </div>
  );
}

export default testTranh2;
