<template lang="html">
  <div class="datepicker">

    <el-popover
          ref="popover"
          trigger="click"
          placement="bottom-start">
          <div slot="reference">
            <div>start | end date</div>
          </div>

          <!--content-->
          <div class="date-range-test">
            <div class="date-range-presets">
              <ul>
                <li v-for="item in shortcuts">
                  <span @click="callbackPreset(item.type)">
                    {{item.text}}
                  </span>
                </li>
              </ul>
            </div>
            <div
              class="date-range-picker date-range-start"
              :class="disabled ? 'disabled' : ''">
              <span>{{ minDate }}</span>
              <input type="text" name="dateStart" v-model="customModel.customMinDate">
              <datepicker
                :inline="true"
                :format="format"
                :highlighted="highlighted"
                :open-date="openDateFrom"
                :clear-button="true"
                v-model="customModel.customMinDate"
                v-on:selected="highlightFrom"
                v-on:cleared="clear"
                v-on:changedMonth="changedMonthFrom">
              </datepicker>
            </div>
            <div
              class="date-range-picker date-range-end"
              :class="disabled ? 'disabled' : ''">
              <input type="text" name="dateEnd" v-model="customModel.customMaxDate">
              <datepicker
                :inline="true"
                :highlighted="highlighted"
                :format="format"
                :open-date="openDateTo"
                :clear-button="true"
                v-model="customModel.customMaxDate"
                v-on:selected="highlightTo"
                v-on:cleared="clear"
                v-on:changedMonth="changedMonthTo">
              </datepicker>
            </div>
          </div>
    </el-popover>


  </div>
</template>

<script>

import Vue from 'vue'
import ElementUI from 'element-ui'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import VueMoment from 'vue-moment'
Vue.use(VueMoment)
Vue.use(ElementUI)

const pickerShortcuts = () => {
    return [{
      text: 'Прошлая неделя',
      type: 'week'
    }, {
      text: 'Прошлый месяц',
      type: 'month'
    }, {
      text: 'Прошлые 3 месяца',
      type: 'three month'
    }]
  };

export default {
  name: 'Home',
  components: {
    Datepicker,
    ElementUI
  },
  data() {
    return {
      format: "YYYY MMMM dd",
      customModel: {
        customMinDate: '',
        customMaxDate: ''
      },
      highlighted: {},
      openDateFrom: new Date(),
      openDateTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      shortcuts: pickerShortcuts(),
      disabled: true
    }
  },
  watch: {
    // watch date on click on presets
    openDateFrom() {
      console.log(Date.parse(this.openDateFrom))
    }
  },
  computed: {
    minDate() {
      let minDate = this.customModel.customMinDate
      return moment(minDate).format("d MMMM YYYY")
    }
  },
  methods: {
    changedMonthFrom(val) {
      if ( (val.getMonth() + 1) === this.openDateTo.getMonth() ) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    changedMonthTo(val) {
      if ( (val.getMonth() - 1) === this.openDateFrom.getMonth() ) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    },
    clear() {
      this.highlighted = {}
    },
    callbackPreset(type) {
      let val = type.toLowerCase()
      const end = new Date();
      const start = new Date();

      if (val === 'week') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.openDateFrom = start
        this.highlighted = {
          to: end,
          from: start
        }
      } else if (val === 'month') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.openDateFrom = start
        this.highlighted = {
          to: end,
          from: start
        }
      } else if (val === 'three month') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        this.openDateFrom = start
        this.highlighted = {
          to: end,
          from: start
        }
      }
    },
    highlightFrom(val) {
      if (typeof this.highlighted.from === "undefined") {
        this.highlighted = {
          to: this.highlighted.to,
          from: null
        };
        this.highlighted.from = val;
      } else if (typeof this.highlighted.to === "undefined") {

        this.highlighted = {
          to: null,
          from: this.highlighted.from
        }
        this.highlighted.to = val;
        this.customModel.customMaxDate = val
        console.log(this.customModel.customMinDate)
      } else {
        if ( Date.parse(val) < this.highlighted.from ) {
          this.highlighted = {
            to: this.highlighted.to,
            from: null
          };
          this.highlighted.from = val;
        } else if ( Date.parse(val) > this.highlighted.from ) {
          this.highlighted = {
            to: null,
            from: this.highlighted.from
          }
          this.highlighted.to = val;
        }
      }
    },
    highlightTo(val) {
      if (typeof this.highlighted.to === "undefined" && typeof this.highlighted.from !== "undefined") {
        this.highlighted = {
          to: null,
          from: this.highlighted.from
        }
      }
      this.highlighted.to = val;
    },
  }
  // filters: {
  //   moment: function(date) {
  //     return moment(date).format("d MMMM yyyy")
  //   }
  // }
}
</script>

<style lang="css">
  .date-range-start.disabled .next,
  .date-range-end.disabled .prev {
    opacity: 0;
    visibility: hidden;
  }
  .date-range-test {
    display: flex;
  }
  .date-range-test li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .date-range-picker {
    margin: 0 10px;
  }
  .datepicker {
    float: left;
    position: relative;
  }
  .el-popover {
    top: 50px;
  }

</style>
