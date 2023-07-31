
<script>
// @ts-nocheck

  import { ifSelectedChat } from "../store.js";
  import { onMount } from "svelte";
  import { Button, Textarea, Alert, ToolbarButton, Modal, Avatar } from "flowbite-svelte";
  import { FaEye, FaRegPaperPlane } from "svelte-icons/fa";
  import { useEffect } from "./hooks.js";
  import Message from "./Message.svelte";
  import axios from "axios";
  import io from "socket.io-client";

  const ENDPOINT = "http://localhost:5000";
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let profile = false;
  let hiddenChat = false;
  let socket, chatBox;
  let text = "";
  $: messages = [];
  $: socketConnected = false;
  
  
  // SOCKET.IO CONNECTION 
  onMount(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => socketConnected = true);
  });

  const scrollToBottom = async (node) => {
      if(node)
          node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  };

  async function sendMessage(){

      const config = {
          headers: { Authorization: `Bearer ${userInfo.token}`, },
      };

      messages.push(text);
      const { data } = await axios.post("http://localhost:5000/api/message", {content: text, chatId: $ifSelectedChat._id, email: userInfo.email}, config);
      socket.emit("new message", data);
      text = "";
      getAllMessage();
  }

  useEffect(() => {
    getAllMessage();
    scrollToBottom(chatBox);
  }, () => [messages]);

  $: if($ifSelectedChat) {
        getAllMessage();
  }

//   $: if(messages) {
//       getAllMessage();
//   }

  async function getAllMessage(){
      if(!$ifSelectedChat) return
      const config = {
          headers: { Authorization: `Bearer ${userInfo.token}`, },
      };
      
      const { data } = await axios.get(`http://localhost:5000/api/message/${$ifSelectedChat._id}`, config);
      messages = data;
  }

</script>

<div class="w-full h-5/6 flex flex-col gap-4 bg-zinc-800 rounded p-4">

    {#if !$ifSelectedChat}
        <h1 class="font-bold text-4xl text-white">Click on a chat to start</h1>
    {:else}
        <div class="flex justify-between">
            <h1 class="text-3xl text-white font-bold">{$ifSelectedChat.chatName}</h1>
            <Button color="primary" on:click={() => profile = true} ><div class="w-4"><FaEye /></div></Button>
        </div>

        <div class="relative flex flex-col flex-grow w-full h-full bg-zinc-100 shadow-xl rounded-lg overflow-hidden">
            <div class="relative flex flex-col flex-grow h-0 p-4 overflow-auto" bind:this={chatBox}>
                {#each messages as message}
                    {#if message.sender._id === userInfo._id}
                        <Message 
                            message={message.content} 
                            time={message.createdAt} 
                            img={userInfo.pic}  
                            name={userInfo.name}
                            user={false} 
                        />
                    {:else} 
                        <Message 
                            message={message.content} 
                            time={message.createdAt} 
                            img={message.sender.pic} 
                            name={message.sender.name}
                        />
                    {/if}
                {/each}
            </div>
            
            <Alert color="light" class="rounded-none rounded-b">
                <svelte:fragment slot="icon">
                <Textarea id="chat" class="mx-4" rows="1" placeholder="Your message..." bind:value={text} 
                    on:keyup={(e) => {
                        if(e.key === 'Enter') sendMessage();
                    }}
                />
                <ToolbarButton on:click={sendMessage} class="w-10 rounded-full text-primary-600 dark:text-primary-500">
                    <FaRegPaperPlane />
                </ToolbarButton>
                </svelte:fragment>
            </Alert>
        </div>

        <Modal bind:open={profile} size="xs" autoclose={false} class="w-full">
            <div class="flex flex-col gap-2 items-center cursor-pointer">
                <Avatar size="lg" src={$ifSelectedChat.users[0].pic} />
                <h1 class="text-xl font-bold" >{$ifSelectedChat.users[0].name}</h1>
                <h1 class="text-lg font-bold">{$ifSelectedChat.users[0].email}</h1>
            </div>
        </Modal>
    {/if}

</div>

