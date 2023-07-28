<script>
// @ts-nocheck

  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import Chat from "./pages/Chat.svelte";
  import Window from "./components/Window.svelte";
  
</script>


<Router>
  <Route path="*">
    <Home />
  </Route>
  <Route path="/chat">
    <Chat />
  </Route>

  <Route path="/prueba">
    <Window />
  </Route>
</Router>