<script>
    import axios from "axios";
    import { Button, Fileupload, Input, Label } from "flowbite-svelte";
    import { navigate } from "svelte-routing";

    $: name = null; 
    $: email = null; 
    $: password = null; 
    $: confirmpassword = null; 
    $: img = null;

    async function sendData(){

      if(password.length > 7){
        if(password === confirmpassword){
          await axios.post("http://localhost:5000/api/user/",{name,email,password});

          setTimeout(() => {
            navigate('/', { replace: true });
          }, 4000);

          console.log("LOGIN EXITOSO");
        }
        else{
          console.log("CONTRASEÑAS INCORRECTAS");
        }
      }
      else{
        console.log("CONTRASEÑA MUY CORTA");
      }

      setTimeout(() => {
        navigate('/', { replace: true });
      }, 4000);

    }
    
</script>

<form 
  on:submit|preventDefault={sendData} 
  class="w-1/2 md:w-1/3 p-4 bg-zinc-400 flex flex-col justify-center items-center rounded border-2 border-blue-500 border-solid">

  <div class="mb-6 w-full">
    <Label for="name" class="mb-2">Name</Label>
    <Input type="text" id="name" placeholder="John Doe" bind:value={name} required />
  </div>

  <div class="mb-6 w-full">
    <Label for="email" class="mb-2">Email address</Label>
    <Input type="email" id="email" placeholder="john.doe@company.com" bind:value={email} required />
  </div>

  <div class="mb-6 w-full">
    <Label for="password" class="mb-2">Password</Label>
    <Input type="password" id="password" placeholder="•••••••••" bind:value={password} required />
  </div>

  <div class="mb-6 w-full">
    <Label for="confirmpassword" class="mb-2">Confirm Password</Label>
    <Input type="password" id="confirmpassword" placeholder="•••••••••" bind:value={confirmpassword} required />
  </div>

  <div class="mb-6 w-full">
    <Label class="space-y-2 mb-2">
      <span>Upload file</span>
      <Fileupload bind:img/>
    </Label>
  </div>

  <Button type="submit">Sign Up</Button>
</form>