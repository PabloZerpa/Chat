<script>
// @ts-nocheck

    import axios from "axios";
    import { Button, Card, Spinner, Modal, Label, Input, Badge, Avatar } from "flowbite-svelte";
    import { FaTimes } from "svelte-icons/fa";

    export let open = false;
    export let datos = [];
    export let param = "";
    export let term = "";
    export let x = "create";

    let users = [];

    async function handleSearch(){ 
        try {
            if(term === ""){
                users = [];
            }
            else{
                const { data } = await axios(`http://localhost:5000/api/user?search=${term}`);
                users = data;
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    async function selectUser(user){
        console.log(user);
    }

</script>

<Modal bind:open={open} size="xs" autoclose={false} class="w-full">
    <form class="flex flex-col space-y-6" >
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Group Chat</h3>

        <div class="flex gap-4">
            {#each datos as dato}
                <Badge class="gap-2">
                    {dato[param]} 
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="w-2 cursor-pointer" on:click={() => console.log(dato[param])}><FaTimes /> </div>
                </Badge>
            {/each}
        </div>

        <Label class="space-y-2">
            <Input type="text" name="chatName" placeholder="Chat Name" required />
        </Label>
        <Label class="space-y-2">
            <Input type="text" name="user" placeholder="Add User" bind:value={term} on:keyup={handleSearch} required />
        </Label>

        {#await users}
            <div class="text-center"><Spinner color="blue" size={10} /></div>
        {:then results}
            {#each results as user}
            <Card padding='xs' on:click={() => {selectUser(user)}} >
                <div class="flex items-center gap-4 cursor-pointer">
                    <Avatar size="md" src={user.pic} />
                    <div class="flex flex-col">
                        <h5 class="text-base font-medium text-gray-900 dark:text-white">{user.name}</h5>
                        <span class="text-sm text-gray-900 dark:text-white"><span class="font-bold">Email:</span> {user.email}</span>
                    </div>
                </div>
            </Card>
            {/each}
        {:catch error}
            <p>An error occurred: {error.message}</p>
        {/await}

        {#if x === "create"}
            <Button class="w-full">Create Chat</Button>
        {:else}
            <Button color="red" type="submit" class="w-full">Leave Group</Button>
        {/if}
    </form>
</Modal>