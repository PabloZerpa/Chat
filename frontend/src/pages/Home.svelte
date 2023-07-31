<script>
  // @ts-nocheck
    
  import { onMount } from 'svelte';
  import { Button } from 'flowbite-svelte'
  import { navigate } from 'svelte-routing';
  import Login from '../components/auth/Login.svelte';
  import SignUp from '../components/auth/SignUp.svelte';

  const user = localStorage.getItem("userInfo");
  let login = true;

  onMount(() => {
    if(user)
      navigate('/chat', { replace: true });
  });
  
</script>

<div class="relative h-screen flex flex-col justify-center items-center gap-4 bg-zinc-800">

  <div class="absolute top-16 animate-bounce">
    <img
      src="/icon.svg"
      class="mr-3 h-24"
      alt="Chat Logo"
    />
  </div>

  <div class="flex gap-8">
    {#if login}
      <Button type="button" on:click={() => {login = true}}>Login</Button>
      <Button type="button" outline on:click={() => {login = false}}>Sign Up</Button>
    {:else}
      <Button type="button" outline on:click={() => {login = true}}>Login</Button>
      <Button type="button" on:click={() => {login = false}}>Sign Up</Button>
    {/if}
  </div>
  
  {#if login}
    <Login />
  {:else}
    <SignUp />
  {/if}


</div>


    