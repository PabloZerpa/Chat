<script>
  // @ts-nocheck

  import axios from "axios";
  import { Button, Fileupload, Input, Label } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
  
  $: name = null; 
  $: email = null; 
  $: password = null; 
  $: confirmpassword = null; 
  // $: img = null;
  
  const showToast = (title, description, type) => {
    const toast = toasts.add({
      title: title,
      description: description,
      duration: 3000, // 0 or negative to avoid auto-remove
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
  
  async function sendData(){
  
    if(password.length > 7){
      if(password === confirmpassword){
        try {
          const {data} = await axios.post("http://localhost:5000/api/user/",{name,email,password});
          localStorage.setItem("userInfo", JSON.stringify(data));
          showToast('EXITO', 'REGISTRO EXITOSO', 'success');
        } catch (error) {
          showToast('ERORR', error.response.data.message, 'error');
        }
      }
      else{
        showToast('ERORR', 'CONTRASEÑAS NO COINCIDEN', 'error');
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

  <!-- <div class="mb-6 w-full">
    <Label class="space-y-2 mb-2">
      <span>Upload file</span>
      <Fileupload bind:img/>
    </Label>
  </div> -->

  <Button type="submit">Sign Up</Button>
</form>