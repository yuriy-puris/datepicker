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
              <input
                type="text"
                name="dateStart"
                v-model="fromValue"
                :placeholder="placeholderFrom"
                v-mask="'##/##/####'">
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
              <input
                type="text"
                name="dateEnd"
                v-model="toValue"
                :placeholder="placeholderTo"
                v-mask="'##/##/####'">
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
import VueMask from 'v-mask'

Vue.use(VueMoment)
Vue.use(ElementUI)
Vue.use(VueMask);


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
      fromValue:'',
      toValue: '',
      highlighted: {},
      shortcuts: pickerShortcuts(),
      disabled: true,
      openDateFrom: new Date(),
      openDateTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      controlFromMonth: '',
      controlToMonth: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      placeholderFrom: moment().format('L'),
      placeholderTo: moment().add(1, 'month').format('L'),
    }
  },
  watch: {
    // отслеживаем изменение в филдах
    // и транслируем в календаре
    fromValue() {
      let timeFromValue = new Date(this.fromValue)
      if ( !isNaN(timeFromValue.getTime() )) {
        console.log(timeFromValue);
        this.customModel.customMinDate = timeFromValue
        this.highlighted.from = timeFromValue
      }
    },
    toValue() {
      let timeToValue = new Date(this.toValue)
      if ( !isNaN(timeToValue.getTime() )) {
        this.highlighted.to = timeToValue
      }
    }
  },
  methods: {
    filterDate(date) {
      return moment(date).format('l')
    },
    controlMonthOnChange(val) {
      this.controlFromMonth = val
    },
    changedMonthFrom(val) {
      this.controlFromMonth = val
      if (moment(moment(val).format()).isBefore(moment(this.controlToMonth))) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    changedMonthTo(val) {
      this.controlToMonth = new Date(new Date(val).setMonth(new Date(val).getMonth() - 1))
      if (moment(moment(this.controlToMonth).format()).isAfter(moment(this.controlFromMonth))) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    clear() {
      this.fromValue = ''
      this.toValue = ''
      this.highlighted = {}
    },
    callbackPreset(type) {
      this.clear();
      let val = type.toLowerCase()
      let end = new Date();
      let start = new Date();

      if (val === 'week') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.openDateFrom = start
        this.openDateTo = end
        this.controlFromMonth = start
        this.controlToMonth = end
        this.highlighted = {
          to: end,
          from: start
        }
      } else if (val === 'month') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.openDateFrom = start
        this.openDateTo = end
        this.controlFromMonth = start
        this.controlToMonth = end
        this.highlighted = {
          to: end,
          from: start
        }
      } else if (val === 'three month') {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        this.openDateFrom = start
        this.openDateTo = end
        this.controlFromMonth = start
        this.controlToMonth = end
        this.highlighted = {
          to: end,
          from: start
        }
      }
    },
    // селект по первому календарю
    highlightFrom(val) {
      if (typeof this.highlighted.from === "undefined") {
        this.highlighted = {
          to: this.highlighted.to,
          from: null
        };
        this.highlighted.from = val;
        this.fromValue = this.filterDate(val);
      } else if (typeof this.highlighted.to === "undefined") {
        this.highlighted = {
          to: null,
          from: this.highlighted.from
        }
        this.highlighted.to = val;
        // записываем в инпут дату
        this.toValue = this.filterDate(val);
        // переопределяем открытие месяца календаря
        this.openDateTo = new Date(new Date().setMonth(new Date().getMonth() + 1))
      } else {
        // ели выбраны все даты 'from' и 'to'
        if ( Date.parse(val) < this.highlighted.from ) {
          this.highlighted = {
            to: this.highlighted.to,
            from: null
          };
          this.highlighted.from = val;
          // записываем в инпут дату
          this.fromValue = this.filterDate(val);
          // переопределяем открытие месяца календаря
          this.openDateTo = new Date(new Date().setMonth(new Date().getMonth() + 1))
        } else if ( Date.parse(val) > this.highlighted.from ) {
          let from = this.highlighted.from;
          // обнуление состояния всех календарей
          Array.prototype.slice.call(document.querySelectorAll('.vdp-datepicker__clear-button')).forEach(elem => {
            elem.click()
          })
          // переинициализация календаря
          this.highlighted = {
            to: null,
            from: from
          };
          this.highlighted.to = val;
          // записываем в инпут дату
          this.fromValue = this.filterDate(this.highlighted.from);
          this.toValue = this.filterDate(val);
        }
      }
    },
    // селект по второму календарю
    highlightTo(val) {
      if (typeof this.highlighted.to === "undefined" && typeof this.highlighted.from !== "undefined") {
        this.highlighted = {
          to: null,
          from: this.highlighted.from
        }
      }
      this.highlighted.to = val;
      this.toValue = this.filterDate(val)
    },
  },
  mounted() {

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
