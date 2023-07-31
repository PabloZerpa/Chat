<script>
// @ts-nocheck

  import { Button, Input, Label } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";

  const showToast = (title, description, type) => {
    
    const toast = toasts.add({
      title: title,
      description: description,
      duration: 2000, // 0 or negative to avoid auto-remove
      type: type,
      placement: 'top-center',
      theme: 'dark',
      showProgress: true,
      onClick: () => {},
      onRemove: () => {
        if(type === 'success')
          navigate('/chat', { replace: true });
      },
    });
  };

  $: email = null;
  $: password = null;
  
  async function sendData(){

    if(password.length > 7){
      try {
        const {data} = await axios.post("http://localhost:5000/api/user/login/", {email,password});
        localStorage.setItem("userInfo", JSON.stringify(data));
        showToast('EXITO', 'INICIO DE SESION COMPLETO', 'success');
      } catch (error) {
        showToast('ERORR', error.response.data.message, 'error');
      }
    }
    else{
      showToast('ERORR', 'CONTRASEÑA MUY CORTA', 'error');
    }

  }
  
</script>

<ToastContainer placement="top-center" let:data={data}>
  <FlatToast {data} />
</ToastContainer>

<form 
  on:submit|preventDefault={sendData} 
  class="w-1/2 md:w-1/3 p-4 bg-zinc-400 flex flex-col justify-center items-center rounded">

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
