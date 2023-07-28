
<script>
// @ts-nocheck

  // ARREGLAR SCROLL

  import { ifSelectedChat } from "../store.js";
  import { onMount } from "svelte";
  import { Button, Textarea, Alert, ToolbarButton, Modal, Avatar } from "flowbite-svelte";
  import { FaEye, FaPaperclip, FaRegPaperPlane, FaRegSmile, FaArrowLeft, FaCircle } from "svelte-icons/fa";
  import Message from "./Message.svelte";
  import axios from "axios";
  import io from "socket.io-client";
  import { useEffect } from "./hooks.js";

  let profile = false;
  let hiddenChat = false;
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
  const ENDPOINT = "http://localhost:5000";
  let socket, selectedChatCompare;
  let chatBox;
  let text = "";
  let time = "";
  $: messages = [];
  $: newMessages = [];
  $: scrollState = true;

  $: socketConnected = false;
  $: typing = false;
  $: isTyping = false;
  
  
  // SOCKET.IO CONNECTION 
  onMount(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => socketConnected = true);
  });

  useEffect(() => {
    socket.on("typing", () => {isTyping = true; console.log('TYPING')});
    socket.on("stop typing", () => {isTyping = false; console.log('NO TYPING')});
    console.log(`VALOR DE TYPING ES: ${isTyping}`);
  }, () => []);

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

    const scrollToBottom = async (node) => {
        // console.log('HACIENDO SCROLL')
        if(node)
            node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
    };

    // useEffect(() => {
    //     scrollToBottom(chatBox);
    //     scrollState = false;
    // }, () => [scrollState]);

    async function sendMessage(){

        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        socket.emit("stop typing", $ifSelectedChat._id);

        messages.push(text);
        let today = new Date();
        time = today.toLocaleString();

        const { data } = await axios.post("http://localhost:5000/api/message", {content: text, chatId: $ifSelectedChat._id, email: userInfo.email}, config);
        socket.emit("new message", data);
        // notification.set(data);

        text = "";
        selectedChatCompare = $ifSelectedChat;
        scrollState = true;
        
        //console.log($notification);
    }

    $: if($ifSelectedChat || messages) {
        getAllMessage();
        scrollToBottom(chatBox);
    }

    async function getAllMessage(){
        if(!$ifSelectedChat) return

        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };
        
        const { data } = await axios.get(`http://localhost:5000/api/message/${$ifSelectedChat._id}`, config);
        messages = data;
        // socket.emit("join chat", ifSelectedChat._id);
    }

    // const typingHandler = (e) => {
    //     newMessages = e.target.value;

    //     if(newMessages){
    //         isTyping = true;
    //         //typing = true;
    //     }
    //     else {
    //         isTyping = false;
    //         //typing = true;
    //     }

    //     if (!socketConnected) return;

    //     if (!typing) {
    //         typing = true;
    //         socket.emit("typing", $ifSelectedChat._id);
    //     }
    //     let lastTypingTime = new Date().getTime();
    //     let timerLength = 3000;

    //     setTimeout(() => {
    //         let timeNow = new Date().getTime();
    //         let timeDiff = timeNow - lastTypingTime;
    //         if (timeDiff >= timerLength && typing) {
    //             socket.emit("stop typing", $ifSelectedChat._id);
    //             typing = false;
    //         }
    //         }, timerLength);
    // };

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
            <!-- {#if isTyping}
                <div class="absolute bottom-20 left-4 animate-bounce flex gap-1 w-6 text-orange-400" >
                    <FaCircle /><FaCircle /><FaCircle />
                </div>
            {:else}
                <div></div>
            {/if} -->
            
            
            <Alert color="light" class="rounded-none rounded-b">
                <svelte:fragment slot="icon">
                <ToolbarButton color="dark" class="w-10 text-gray-500 dark:text-gray-400">
                    <FaPaperclip />
                </ToolbarButton>
                <ToolbarButton color="dark" class="w-10 text-gray-500 dark:text-gray-400">
                    <FaRegSmile />
                </ToolbarButton>
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

