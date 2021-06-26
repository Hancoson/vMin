<template>
  <div id="wrapper">
    <add-files></add-files>
    <list></list>
  </div>
</template>

<script>
import addFiles from "@/components/AddFiles";
import list from "@/components/List";

export default {
  name: "home-page",
  components: {
    addFiles,
    list,
  },
};
</script>
