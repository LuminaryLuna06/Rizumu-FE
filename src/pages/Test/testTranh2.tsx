import axiosClient from "@rizumu/api/config/axiosClient";
import SelectInput from "@rizumu/components/SelectInput";
import TextArea from "@rizumu/components/TextArea";
import TextInput from "@rizumu/components/TextInput";
import { useAuth } from "@rizumu/context/AuthContext";
import { useEffect, useState } from "react";
const data = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte", disabled: true },
];
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
    <div className="bg-primary h-[80vh]">
      <TextInput label="Hello World" placeholder="Hello there" />
      <TextArea label="Hello world" placeholder="Hello There" />
      <SelectInput data={data} />
    </div>
  );
}

export default testTranh2;
