
<script>
    export let message = "";
    export let time = "";
    export let img = "";
    export let name = "Unknown";
    export let user = true;
</script>

{#if user}
    <div class="flex max-w-xl mt-2 space-x-3 max-w-xs">
        <div>
            <p class="text-xs font-bold mb-1">{name}</p>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"><img class="rounded-full" src={img} alt="img"></div>
        </div>

        <div class="mt-4">
            <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                <p class="text-sm">{message}</p>
            </div>
            <span class="text-xs text-gray-500 leading-none">{time}</span>
        </div>
    </div>
{:else}
    <div class="flex max-w-xl mt-2 space-x-3 max-w-xs ml-auto justify-end">
        <div class="mt-4">
            <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p class="text-sm">{message}</p>
            </div>
            <span class="text-xs text-gray-500 leading-none">{time}</span>
        </div>

        <div>
            <p class="text-xs font-bold mb-1">{name}</p>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"><img class="rounded-full" src={img} alt="img"></div>
        </div>
    </div>
{/if}