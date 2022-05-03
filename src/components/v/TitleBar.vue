<template>
  <div style="border-radius: 2em; padding-left: 1em; ">
    <v-row no-gutters dense style="margin: 0 !important;">

      <v-col align-self="center" cols="1">
        <v-icon :color="getColor(content)" >{{ getIcon()}}</v-icon>
      </v-col>
      <v-col align-self="center" :cols="content ? 2 :8">
        <h5 style="text-align: start; color: grey; padding-left: 1.5em"
            :style="{ 'background-color': !arrayElem ? 'rgba(76,255,0,0.18)' :  'rgba(76,255,255,0.18)'}"
        >{{ title }}</h5>
      </v-col>
      <v-col align-self="center" v-if="content" cols="6">
        <h5 style=" text-align: center; overflow: hidden; background-color: rgba(255,0,0,0.18)">{{ content }}</h5>
      </v-col>

      <v-col cols="1" align="center" >
        <v-btn icon v-if="actions[0].enable" elevation="0" color="green" :disabled="$pastebin.type === null"
               @click="useAction(0)">
          <v-icon >mdi-content-paste</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="1" align="center">
        <v-btn icon v-if="actions[1].enable" elevation="0" color="primary" @click="useAction(1)">
          <v-icon >mdi-content-copy</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="1" align="center">
        <v-btn icon v-if="actions[2].enable" @click="useAction(2)">
          <v-icon  color="red">mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>


  </div>
</template>

<script>
export default {
  name: "TitleBar",
  props: ['title', 'icon', 'actions', "opened" , "content" , "arrayElem"],
  methods: {
    useAction(index) {
      this.actions[index].fAction();
    },
    getIcon() {

      if (this.opened) {
        switch (this.icon) {
          case this.$constants.ELEM_TYPE_OBJ :
            if( this.arrayElem )
              return "mdi-arrow-down"
              else
            return "mdi-folder-open";
          case this.$constants.ELEM_TYPE_ARRAY :
            return "mdi-application-array-outline"
          case this.$constants.ELEM_TYPE_VAR :
            return this.getIconAndType(this.content)
          default:
            return "mdi-arrow-down"
        }

      } else {
        switch (this.icon) {
          case this.$constants.ELEM_TYPE_OBJ :
            if( this.arrayElem )
              return "mdi-arrow-right"
            else
            return "mdi-folder";
          case this.$constants.ELEM_TYPE_ARRAY :
            return "mdi-application-array"
          case this.$constants.ELEM_TYPE_VAR :
            return this.getIconAndType(this.content)
          default:
            return "mdi-arrow-right"
        }
      }

    },
    getIconAndType(value) {
      if (!value) {
        return "mdi-help-circle-outline";
      }

      let stringValue = value.toString();
      switch (true) {
        case stringValue.includes(".mp4") || stringValue.includes(".MP4"):
          return "mdi-youtube";
        case stringValue.includes(".jpg") || stringValue.includes(".JPG") || stringValue.includes(".png") || stringValue.includes(".PNG"):
          return "mdi-file-image";
        case !isNaN(parseInt(stringValue)):
          return "mdi-numeric";
        case stringValue === "true" || stringValue === "false":
          return stringValue === "true" ? "mdi-checkbox-outline" : "mdi-checkbox-blank-outline";
        default :
          return "mdi-alphabetical-variant";
      }

    },
    getColor()
    {
      let value = this.content;
      if (!value) {
        return "black";
      }

      let stringValue = value.toString();
      switch (true) {
        case stringValue.includes(".mp4") || stringValue.includes(".MP4"):
          return "red";
        case stringValue.includes(".jpg") || stringValue.includes(".JPG") || stringValue.includes(".png") || stringValue.includes(".PNG"):
          return "yellow";
        case !isNaN(parseInt(stringValue)):
          return "green";
        case stringValue === "true" || stringValue === "false":
          return stringValue === "true" ? "blue" : "red";
        default :
          return "orange";
      }
    }
  }
}
</script>

<style scoped>

</style>
