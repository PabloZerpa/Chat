<script>
// @ts-nocheck

  import { Button, Input, Label } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";

  export let loading = false;

  $: email = null;
  $: password = null;
  
  async function sendData(){

    if(password.length > 7){
      try {
        const {data} = await axios.post("http://localhost:5000/api/user/login/", {email,password});
        localStorage.setItem("userInfo", JSON.stringify(data));
        loading = true;
        
        setTimeout(() => {
          navigate('/chat', { replace: true });
        }, 2000);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    else{
      console.log("CONTRASEÑA MUY CORTA");
    }

  }
  
</script>

<form 
  on:submit|preventDefault={sendData} 
  class="w-1/2 md:w-1/3 p-4 bg-zinc-400 flex flex-col justify-center items-center rounded border-2 border-blue-500 border-solid">

  <div class="mb-6 w-full">
    <Label for="email" class="mb-2">Email address</Label>
    <Input type="email" id="email" placeholder="john.doe@company.com" bind:value={email} required />
  </div>

  <div class="mb-6 w-full">
    <Label for="password" class="mb-2">Password</Label>
    <Input type="password" id="password" placeholder="Password" bind:value={password} required />
  </div>

  <Button type="submit">Login</Button>
</form>
