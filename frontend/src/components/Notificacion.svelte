
<script>
// @ts-nocheck

  import { Toast } from "flowbite-svelte";
  import { FaCheckCircle, FaTimesCircle} from "svelte-icons/fa/";
  import { fly } from "svelte/transition";

  export let show = false;
  export let type = "error";
  export let message = "ERROR";

  //let show = false;
  let counter = 4;

  function active() {
    show = true;
    trigger();
  }

  function trigger() {
    //show = true;
    counter = 4;
    timeout();
  }

  function timeout() {
    if (--counter > 0)
      return setTimeout(timeout, 1000);
    show = false;
  }

</script>
 

{#if type === "error"}
  <Toast transition={fly} params="{{y: -200}}" color="red" bind:open={show} on:load={trigger()} >
      <div class="flex items-center gap-4">
          <div class="w-12 text-red-500">
              <FaTimesCircle />
          </div>
          <div class="text-red-500 text-lg font-bold">{message}</div>
      </div>
  </Toast>
{:else}
  <Toast transition={fly} params="{{y: -200}}" color="green" bind:open={show} on:load={trigger()} >
    <div class="flex items-center gap-4">
        <div class="w-12 text-green-500">
            <FaCheckCircle />
        </div>
        <div class="text-green-500 text-lg font-bold">{message}</div>
    </div>
  </Toast>
{/if}