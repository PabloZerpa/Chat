
<script>
// @ts-nocheck

  import { Button, Textarea, Alert, ToolbarButton, Modal, Avatar } from "flowbite-svelte";
  import { FaEye, FaPaperclip, FaRegPaperPlane, FaRegSmile, FaArrowLeft } from "svelte-icons/fa";
  import Message from "./Message.svelte";
  import { ifSelectedChat, notification } from "../store.js";
  import axios from "axios";
  import { onMount } from "svelte";
  import io from "socket.io-client";

  let profile = false;
  let hiddenChat = false;
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  let text = "";
  let time = "";
  $: messages = [];
  $: newMessages = [];

  $: socketConnected = false;
  $: typing = false;
  $: isTyping = false;

  const ENDPOINT = "http://localhost:5000";
  let socket, selectedChatCompare;

  onMount(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => socketConnected = true);
    socket.on("typing", () => isTyping = true);
    socket.on("stop typing", () => isTyping = false);
  });

  onMount(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // if (!notification.includes(newMessageRecieved)) {
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        // }
      } else {
        messages = [...messages, newMessageRecieved];
      }
    });
  });

  async function sendMessage(){
    socket.emit("stop typing", $ifSelectedChat._id);

    messages.push(text);
    let today = new Date();
    time = today.toLocaleString();

    const { data } = await axios.post("http://localhost:5000/api/message", {content: text, chatId: $ifSelectedChat._id, email: userInfo.email});
    socket.emit("new message", data);

    // console.log(data);
    notification.set(data);

    text = "";
    getAllMessage();
    selectedChatCompare = $ifSelectedChat;

    console.log($notification);
  }
 
  async function getAllMessage(){
    if(!$ifSelectedChat)
        return

    const { data } = await axios.get(`http://localhost:5000/api/message/${$ifSelectedChat._id}`);
    messages = data;
    socket.emit("join chat", ifSelectedChat._id);
    //console.log(data);
  }

  const typingHandler = (e) => {
    newMessages = e.target.value;

    // console.log(isTyping);

    if (!socketConnected) return;

    if (!typing) {
        typing = true;
        socket.emit("typing", $ifSelectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", $ifSelectedChat._id);
            typing = false;
        }
        }, timerLength);
    };


</script>

<div class="w-full h-5/6 sm:flex hidden flex-col gap-4 bg-zinc-800 rounded p-4 border-2 border-blue-500 border-solid">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="flex sm:hidden w-4 text-white cursor-pointer" on:click={() => {hiddenChat = true}}>
        <FaArrowLeft />
    </div>

    {#if !$ifSelectedChat}
        <h1 class="font-bold text-4xl text-white">Click on a chat to start</h1>
    {:else}
        <div class="flex justify-between">
            <h1 class="text-3xl text-white font-bold">{$ifSelectedChat.chatName}</h1>
            <Button color="primary" on:click={() => profile = true} ><div class="w-4"><FaEye /></div></Button>
        </div>

        <div class="flex flex-col flex-grow w-full h-full bg-zinc-100 shadow-xl rounded-lg overflow-hidden">
            <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">

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
                <ToolbarButton color="dark" class="w-10 text-gray-500 dark:text-gray-400">
                    <FaPaperclip />
                </ToolbarButton>
                <ToolbarButton color="dark" class="w-10 text-gray-500 dark:text-gray-400">
                    <FaRegSmile />
                </ToolbarButton>
                {#if isTyping}
                    <div>
                        Loading...
                    </div>
                {:else}
                    <div></div>
                {/if}
                <Textarea id="chat" class="mx-4" rows="1" placeholder="Your message..." bind:value={text} 
                    on:keypress={typingHandler}
                    on:keydown={(e) => {
                        if(e.key === 'Enter'){
                            sendMessage();
                        }
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
