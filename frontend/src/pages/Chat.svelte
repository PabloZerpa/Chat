
<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import MyChat from "../components/MyChat.svelte";
    import ChatBox from "../components/ChatBox.svelte";
    import NavBar from "../components/NavBar.svelte";

    const user = localStorage.getItem("userInfo");

    onMount(() => {
        if(!user) navigate('/', { replace: true });
    });
</script>

<div class="flex flex-col items-center h-screen gap-4 bg-blue-900 border-2 border-green-500 border-solid">
    <NavBar/>

    <div class="w-full h-screen grid grid-rows-1 grid-flow-col gap-8 px-4 pt-20 border-2 border-purple-500 border-solid">
        <div><MyChat/></div>
        <div class="col-span-6"><ChatBox/></div>
    </div>
</div>