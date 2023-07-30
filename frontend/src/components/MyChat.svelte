
<script>
// @ts-nocheck

  import axios from "axios";
  import { ifSelectedChat } from "../store.js";
  import { Button, Card, Spinner, Modal, Label, Input, Badge, Avatar } from "flowbite-svelte";
  import { onMount } from "svelte";
  import { FaEdit, FaTimes } from "svelte-icons/fa";

  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  let createModal = false;
  let updateModal = false;
  let chatName = "";
  let chatId = "";
  $: selectedChat = [];
  $: chatUser = [];
  $: chats = [];
  $: users = [];
  $: term = "";

// FUNCTION TO GET ALL CHATS
  async function fetchChats(){
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };
        const userId = userInfo._id;
        const { data } = await axios.post("http://localhost:5000/api/chat/userchat", {userId}, config); 
        chats = data;
    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO CREATE CHAT
  async function createChat(chat){
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        const users = chatUser;
        const name = chatName;
        await axios.post("http://localhost:5000/api/chat/group", {name, users}, config);
        createModal = false;
    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO OPEN UPDATE CHAT
  async function updateChat(chat){
    try {
        updateModal = true;
        selectedChat = chat;
        chatUser = selectedChat.users;
        chatName = selectedChat.chatName;
        chatId = selectedChat._id;

        console.log(chat);
    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO UPDATE CHAT
  async function update(){
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        await axios.put("http://localhost:5000/api/chat/rename", { chatName, chatId }, config);
        updateModal = false;
    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO REMOVE USER
  async function removeUser(user){
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        const userId = user._id;
        await axios.put("http://localhost:5000/api/chat/groupremove", { chatId, userId }, config);

        excludeUser(user);

    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO ADD USER
  async function addUser(user){
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        const userId = user._id;
        await axios.put("http://localhost:5000/api/chat/groupadd", { chatId, userId }, config);

        selectUser(user);
    } catch (error) {
        console.log(error);
    }
  };

  // FUNCTION TO SEARCH BY TERM
  async function handleSearch(){ 
    try {
        const config = {
            headers: { Authorization: `Bearer ${userInfo.token}`, },
        };

        if(term === ""){
            users = [];
        }
        else{
            const { data } = await axios(`http://localhost:5000/api/user?search=${term}`, config);
            users = data;
        }
    } catch (error) {
        console.log(error.response.data.message);
    }
  }

  // FUNCTION TO SELECT USER AND EXCLUDE THE USER ITSELF
  async function selectUser(user){

    let repeat = false;
    const newChatUser = chatUser.filter(function (item) {
        if(item.name === user.name)
            repeat = true;
        return item.name === user.name;
    });
    
    if(!repeat){
        chatUser.push(user);
        chatUser = chatUser;
    }
  }

  // FUNCTION TO EXCLUDE USER
  async function excludeUser(user){
    const newChatUser = chatUser.filter(function (item) {
        return item.name !== user.name;
    });
    chatUser = newChatUser;
  } 

  onMount(() => {
    fetchChats();
  });


</script>

<div class="w-9/10 h-5/6 flex flex-col justify-between p-4 bg-zinc-800 rounded overflow-auto border-2 border-red-500 border-solid">

    <div class="w-full h-12 flex flex-col sm:flex-row justify-between items-center dark:text-white">
        <h1 class="text-lg font-bold">My Chats</h1>
        <Button class="w-32 h-12" on:click={() => {createModal = true; chatUser = []}}>New Group Chat +</Button>
    </div>

    <div class="h-full flex flex-col py-4">
        {#await chats}
            <div class="text-center"><Spinner color="blue" size={10} /></div>
        {:then results}
            {#each results as chat}
            <Card 
                padding='xs' 
                class="relative my-2 flex items-center justify-center"
            >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div 
                    class="w-3/4 flex flex-row bg-slate-700 hover:bg-slate-500 rounded my-2 items-center justify-center gap-4 p-2 cursor-pointer"
                    on:click={() => {
                        ifSelectedChat.set(chat); 
                    }}
                >
                    <Avatar size="md" src={chat.pic} />
                    <h1>{chat.chatName}</h1>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="w-4 text-white absolute top-1 right-1 cursor-pointer" on:click={() => updateChat(chat)} ><FaEdit /></div> 
            </Card>
            {/each}
        {:catch error}
            <p>An error occurred: {error.message}</p>
        {/await}
    </div>


    <!-- MODAL PARA CREAR CHAT -->
    <Modal bind:open={createModal} size="xs" autoclose={false} class="w-full">
        <form class="flex flex-col space-y-6" >
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Group Chat</h3>

            <div class="flex gap-4">
                {#each chatUser as user}
                    <Badge class="gap-2">
                        {user.name}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="w-2 cursor-pointer" on:click={() => {excludeUser(user)}}><FaTimes /></div>
                    </Badge> 
                {/each}
            </div>

            <Label class="space-y-2">
                <Input type="text" name="chatName" placeholder="Chat Name" bind:value={chatName} required />
            </Label>
            <Label class="space-y-2">
                <Input type="text" name="user" placeholder="Add User" bind:value={term} on:keyup={handleSearch} required />
            </Label>

            {#await users}
                <div class="text-center"><Spinner color="blue" size={10} /></div>
            {:then results}
                {#each results as user}
                <Card padding='xs' on:click={() => {selectUser(user)}} >
                    <div class="flex items-center gap-4 cursor-pointer">
                        <Avatar size="md" src={user.pic} />
                        <div class="flex flex-col">
                            <h5 class="text-base font-medium text-gray-900 dark:text-white">{user.name}</h5>
                            <span class="text-sm text-gray-900 dark:text-white"><span class="font-bold">Email:</span> {user.email}</span>
                        </div>
                    </div>
                </Card>
                {/each}
            {:catch error}
                <p>An error occurred: {error.message}</p>
            {/await}

        <Button class="w-full1" on:click={createChat}>Create Chat</Button>
        </form>
    </Modal>

    <!-- MODAL PARA ACTUALIZAR CHAT -->
    <Modal bind:open={updateModal} size="xs" autoclose={false} class="w-full">
        <form class="flex flex-col space-y-6" >
            <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">{selectedChat.chatName}</h3>

            <div class="flex gap-4">
                {#each chatUser as user}
                    <Badge class="gap-2">
                        {user.name} 
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div class="w-2 cursor-pointer" on:click={() => {removeUser(user)}}><FaTimes /> </div>
                    </Badge>
                {/each}
            </div>

            <Label class="space-y-2 flex gap-4">
                <Input type="text" name="chatName" placeholder="Chat Name" bind:value={chatName} required />
                <Button color="green" class="w-full1" on:click={update} >Update</Button>
            </Label>
            <Label class="space-y-2">
                <Input type="text" name="user" placeholder="Add User" bind:value={term} on:keyup={handleSearch} required />
            </Label>

            {#await users}
                <div class="text-center"><Spinner color="blue" size={10} /></div>
            {:then results}
                {#each results as user}
                <Card padding='xs' on:click={() => {addUser(user)}} >
                    <div class="flex items-center gap-4 cursor-pointer">
                        <Avatar size="md" src={user.pic} />
                        <div class="flex flex-col">
                            <h5 class="text-base font-medium text-gray-900 dark:text-white">{user.name}</h5>
                            <span class="text-sm text-gray-900 dark:text-white"><span class="font-bold">Email:</span> {user.email}</span>
                        </div>
                    </div>
                </Card>
                {/each}
            {:catch error}
                <p>An error occurred: {error.message}</p>
            {/await}

            <Button color="red" type="submit" class="w-full1">Leave Group</Button>
        </form>
    </Modal>

</div>