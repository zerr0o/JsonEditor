<template>
  <v-overlay >
    <v-card style="min-width: 50vw; border-radius: 2em; padding: 1em">
      <v-row>
        <v-col cols="10">
          <v-card-title>{{ edit ? 'EDIT ELEMENT' : 'ADD ELEMENT' }}</v-card-title>
        </v-col>
        <v-col cols="2">
          <v-btn color="error" icon @click.stop="callClose()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>


      <v-item-group>
        <v-container>
          <v-row v-if="!edit">
            <v-col v-for="(n , index) in elementType" :key="n" cols="12" md="4">
              <v-card :color="activeElem === index ? 'primary' : ''" class="d-flex align-center" dark height="50"
                      @click="activeElem=index">

                <div class="text-h7 flex-grow-1 text-center">
                  <v-icon left>{{ elementIcon[index] }}</v-icon>
                  {{ elementType[index] }}
                </div>

              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-row v-if="!edit || array === -1">
                <v-col cols="1" align-self="center">
                  <v-btn icon outlined @click="disabled = !disabled" :color="disabled ? 'red': 'green'" >
                    <v-icon >mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="11">
                  <v-text-field :disabled="edit && disabled" autofocus v-model="name" :label="elementType[activeElem]+' name'"></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="activeElem===2">
                <v-col offset="1" cols="11">
                  <v-text-field v-model="filedValue" label="variable value"></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2">
              <v-btn height="100%" block :disabled="activeElem===-1" color="primary" @click.stop="addElem()">
                <v-icon>{{edit ? 'mdi-check-bold' : 'mdi-plus' }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-card>
  </v-overlay>
</template>

<script>
export default {
  name: "ElementAdder",
  props: ['returnFunction', 'close', 'array', 'edit'],
  data: () => {
    return {
      elementType: ['object', 'array', 'variable'],
      elementIcon: ['mdi-folder', 'mdi-application-array', 'mdi-help-circle-outline'],
      activeElem: 0,
      name: '',
      filedValue: null,
      disabled:true
    }
  },
  created() {
    if (this.edit) {
      this.activeElem = this.edit.type === this.$constants.ELEM_TYPE_OBJ ? 0 : this.edit.type === this.$constants.ELEM_TYPE_ARRAY ? 1 : 2;
      this.name = this.edit.key
      this.filedValue = this.edit.value;
      console.log("editing " + this.name + " with actual valu : " + this.filedValue);
    }

  },
  methods:
      {
        addElem() {
          this.returnFunction(this.array && this.edit > -1 ? this.array : this.name, this.filedValue, this.activeElem);
        },
        callClose() {
          this.$emit('closeOverlay');
        }
      }

}
</script>

<style scoped>

</style>