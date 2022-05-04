<template>
  <div style="margin : 0 0 0 2em">
    <div v-for="(item,index) in content" :key="$ObjectOperation.makeId(5)+index.toString()" style="position: relative">

      <div v-if="!$ObjectOperation.isAVar(item,index)" style="position: absolute; height: 100%; width: 100%; top:0 ; left: 0;"
           :class="{'openedDiv' : isOpened[index] }" ></div>

      <title-bar
          :title="index"
          :content="item"
          :array-elem="index"
          :deepness="deepness+1"
          :delete-item="(x)=>deleteThisItem(x)"
      ></title-bar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArrayProp',
  props: ["content", "deepness", "tittle"],
  data: () => {
    return {
      mainObject: [],
      isOpened: []
    }
  },
  created() {
    for (let i = 0; i < this.content.length; i++) {
      this.isOpened.push(false);
    }
  },
  methods: {

    makeID() {
      this.$ObjectOperation.makeId(5)
    },
    deleteThisItem(item)
    {
      console.log("deleting index : " + item.index);
      this.content.splice(item.index , 1);
      this.$emit('reOpen');
    }



  }
}
</script>

<style scoped>

</style>
