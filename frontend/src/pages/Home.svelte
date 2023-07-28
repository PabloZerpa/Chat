<script>
  // @ts-nocheck
    
  import { onMount } from 'svelte';
  import { Button, Spinner } from 'flowbite-svelte'
  import { navigate } from 'svelte-routing';
  import Login from '../components/auth/Login.svelte';
  import SignUp from '../components/auth/SignUp.svelte';

  const user = localStorage.getItem("userInfo");
  let login = true;
  let loading = false;

  onMount(() => {
    if(user)
      navigate('/chat', { replace: true });
  });
  
</script>

<div class="h-screen flex flex-col justify-center items-center gap-4 bg-zinc-800 border-2 border-red-500 border-solid">

  <div class="flex gap-4">
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


    