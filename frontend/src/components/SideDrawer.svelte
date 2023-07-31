
<script>
// @ts-nocheck

  import { Drawer, Button, CloseButton, Spinner, Search, Card, Avatar } from 'flowbite-svelte';
  import { ifSelectedChat } from "../store.js";
  import { sineIn } from 'svelte/easing';
  import { FaSearch } from "svelte-icons/fa/";
  import axios from 'axios';

  let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  let hidden1 = true; 
  let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
  };
  
  $: term = "";
  $: datos = [];

  async function handleSearch(){
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}`, },
      };

      if(term === "")
        datos = [];
      else{
        setTimeout(async () => {
          const { data } = await axios(`https://chat-app-zyr4.onrender.com/api/user?search=${term}`, config);
          datos = data;
        }, 500);
      }
      
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  async function accessChat(userId,name){
    try {
      const { data } = await axios.post(`https://chat-app-zyr4.onrender.com/api/chat`, {userId, name});
      ifSelectedChat.set(data);
      hidden1 = true;
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

</script>

<div class="text-center">
  <Button on:click={() => (hidden1 = false)}>
    <div class="w-4 mr-2">
      <FaSearch />
    </div>
    Search Users
  </Button>
</div>

<Drawer transitionType="fly" {transitionParams} bind:hidden={hidden1} id='sidebar1' class="flex flex-col gap-4">
  
  <div class='flex items-center'>
    <h1 class="font-bold">Search Users</h1>
    <CloseButton on:click={() => (hidden1 = true)} class='mb-4 dark:text-white'/>
  </div>
  
  <form class="flex gap-2">
    <Search size="md" bind:value={term} on:keyup={handleSearch} />
  </form>

  {#await datos}
    <div class="text-center"><Spinner color="blue" size={10} /></div>
  {:then results}
    {#each results as dato}
      <Card padding='xs' on:click={() => {accessChat(dato._id, dato.name)}} >
        <div class="flex flex-col items-center cursor-pointer">
          <Avatar size="md" src={dato.pic} />
          <h5 class="text-base font-medium text-gray-900 dark:text-white">{dato.name}</h5>
          <span class="text-sm text-gray-900 dark:text-white"><span class="font-bold">Email:</span> {dato.email}</span>
        </div>
      </Card>
    {/each}
  {:catch error}
    <p>An error occurred: {error.message}</p>
  {/await}

</Drawer>