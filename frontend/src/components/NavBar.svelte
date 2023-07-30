
<script>
// @ts-nocheck

  import { Navbar, NavBrand, Avatar, Dropdown, 
    DropdownItem, DropdownDivider, Modal } from 'flowbite-svelte'
  import SideDrawer from './SideDrawer.svelte';
  import { navigate } from 'svelte-routing';
  import { ifSelectedChat } from "../store.js";

  let profile = false;
  let userInfo = JSON.parse(localStorage.getItem("userInfo"));

  function logout(){
    localStorage.removeItem("userInfo");
    ifSelectedChat.set(null);
    navigate("/");
  }

</script>

<div class="fixed w-full z-50">

    <Navbar let:hidden>
      <SideDrawer />

      <NavBrand class="hidden sm:flex">
        <img
          src="/icon.svg"
          class="mr-3 h-6 sm:h-9"
          alt="Flowbite Logo"
        />
        <span class="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">
          Chat
        </span>
      </NavBrand>
    
      <div class="flex items-center gap-6 md:order-2">
        <Avatar class="cursor-pointer" id="avatar-menu" src={userInfo.pic} />
      </div>
    
      <!-- AVATAR OPTIONS -->
      <Dropdown placement="bottom" triggeredBy="#avatar-menu">
        <DropdownItem on:click={() => profile = true}>Profile</DropdownItem>
        <DropdownDivider />
        <DropdownItem on:click={logout} >Sign out</DropdownItem>
      </Dropdown>
        
    </Navbar>

    <Modal bind:open={profile} size="xs" autoclose={false} class="w-3/4">
      <div class="flex flex-col gap-2 items-center cursor-pointer">
          <Avatar size="lg" src={userInfo.pic} />
          <h1 class="text-xl font-bold" >{userInfo.name}</h1>
          <h1 class="text-lg font-bold">{userInfo.email}</h1>
      </div>
    </Modal>

</div>