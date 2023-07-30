
<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { FaArrowLeft, FaArrowRight } from "svelte-icons/fa";
    import MyChat from "../components/MyChat.svelte";
    import ChatBox from "../components/ChatBox.svelte";
    import NavBar from "../components/NavBar.svelte";

    const user = localStorage.getItem("userInfo");
    let showChats = false;
    $: container = window.innerWidth;

    onMount(() => {
        if(!user) 
            navigate('/', { replace: true });
    });

    window.addEventListener('resize', () => {
        container = window.innerWidth;
    });

</script>

<div class="relative flex flex-col items-center h-screen gap-4 bg-blue-900 border-2 border-green-500 border-solid">
    <NavBar/>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    
    <div class="absolute top-20 left-2 flex sm:hidden w-4 text-white cursor-pointer" on:click={() => {showChats = !showChats}}>
        {#if showChats} 
            <FaArrowLeft />
        {:else} 
            <FaArrowRight />
        {/if}
    </div>

    <div class="w-full h-screen grid grid-rows-1 grid-flow-col gap-8 px-4 pt-28 border-2 border-purple-500 border-solid">
        {#if container >= 640}
            <div><MyChat/></div>
            <div class="col-span-6"><ChatBox/></div>
        {:else if showChats}
            <div><MyChat/></div>
        {:else} 
            <div class="col-span-6"><ChatBox/></div>
        {/if}
    </div>
</div>