/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import _merge from 'lodash/merge';
import _debounce from 'lodash/debounce';

window.MOUSE_LEAVE_HIDE_DROPDOWN_TIME = 500;
// add hide mixin
const MOUSE_LEAVE_CONST = function (mouseMixinOptions) {
  return {
    data() {
      return {
        needHideDropDown: false,
        mouseMixinOptions: mouseMixinOptions
      }
    },
    methods: {
      mouseLeave() {
        if (this[this.mouseMixinOptions.visibleFlag]) {
          this.needHideDropDown = true;
          this.checkHide();
        }
      },
      mouseEnter() {
        if (this[this.mouseMixinOptions.visibleFlag]) {
          this.needHideDropDown = false;
        }
      },
      checkHide: _debounce(function () {
        if (this.needHideDropDown) {
          this.needHideDropDown = false;
          this[this.mouseMixinOptions.hideMethodName]();
        }
      }, window.MOUSE_LEAVE_HIDE_DROPDOWN_TIME)
    }
  }
};

ElementUI.Dropdown.mixins.push(_merge(
  MOUSE_LEAVE_CONST({hideMethodName: 'hide', visibleFlag: 'visible'}),
  {
    mounted() {
      $(this.$el).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
      $(this.popperElm).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
    },
    beforeDestroy() {
      $(this.$el).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
      $(this.popperElm).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
    }
  }
));
ElementUI.Select.mixins.push(_merge(
  MOUSE_LEAVE_CONST({hideMethodName: 'handleClose', visibleFlag: 'visible'}),
  {
    mounted() {
      $(this.$el).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
      $(this.$refs.popper.$el).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
    },
    beforeDestroy() {
      $(this.$el).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
      $(this.$refs.popper.$el).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
    }
  }
));
ElementUI.DatePicker.mixins.push(_merge(
  MOUSE_LEAVE_CONST({hideMethodName: 'handleClose', visibleFlag: 'visible'}),
  {
    data() {
      return {initDropDownHandler: false, needHideDropDown: false, mouseMixinOptions: {visibleFlag: 'pickerVisible'}}
    },
    watch: {
      pickerVisible(val) {
        if (val && !this.initDropDownHandler) {
          setTimeout(() => {
            $(this.popperElm).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
            this.initDropDownHandler = true;
          }, 5);
        }
      },
    },
    methods: {
      checkHide: _debounce(function () {
        if (this.needHideDropDown) {
          this.needHideDropDown = false;
          this.handleClose();
          $('input', $(this.$el)).blur();
        }
      }, window.MOUSE_LEAVE_HIDE_DROPDOWN_TIME),
    },
    mounted() {
      $(this.$el).on('mouseleave', this.mouseLeave).on('mouseenter', this.mouseEnter);
    },
    beforeDestroy() {
      $(this.$el).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
      $(this.popperElm).off('mouseleave', this.mouseLeave).off('mouseenter', this.mouseEnter);
    },
    created() {
      _merge(this.$options.propsData.pickerOptions, [{firstDayOfWeek: 1}]);
    }
  }
));
ElementUI.Dialog.mixins.push(_merge(
  {
    mounted() {
      if (this.modalAppendToBody) document.body.appendChild(this.$refs.dialog.parentNode)
    },
    beforeDestroy() {
      if (this.modalAppendToBody) document.body.removeChild(this.$refs.dialog.parentNode)
    }
  }
));
ElementUI.Switch.props.height = {type: Number, default: 2};
ElementUI.Switch.computed.transform = function () {
  return {
    height: this.height - .4 + 'rem',
    width: this.height - .4 + 'rem',
    transform: `translate(${this.checked ? this.coreWidth - this.height : '.2'}rem, .2rem)`
  };
};
ElementUI.Switch.render = Vue.compile(`
<label class="el-switch" :class="{ 'is-disabled': disabled, 'el-switch--wide': hasText, 'is-checked': checked }" :style="{height: height+'rem'}">
    <div class="el-switch__mask" v-show="disabled"></div>
    <input
      class="el-switch__input"
      :class="{ 'allow-focus': allowFocus }"
      type="checkbox"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      ref="input"
      :name="name"
      :true-value="onValue"
      :false-value="offValue"
      :disabled="disabled">
    <span class="el-switch__core" ref="core" :style="{ 'width': coreWidth + 'rem', height: height+'rem', borderRadius: height+'rem'}" @click="setFocus">
      <span class="el-switch__button" :style="transform"></span>
    </span>
    <transition name="label-fade">
      <div
        class="el-switch__label el-switch__label--left"
        v-show="checked"
        :style="{ 'width': coreWidth + 'rem', height: height+'rem'}">
        <i :class="[onIconClass]" v-if="onIconClass"></i>
        <span v-if="!onIconClass && onText" :style="{lineHeight: height+'rem'}">{{ onText }}</span>
      </div>
    </transition>
    <transition name="label-fade">
      <div
        class="el-switch__label el-switch__label--right"
        v-show="!checked"
        :style="{ 'width': coreWidth + 'rem', height: height+'rem'}">
        <i :class="[offIconClass]" v-if="offIconClass"></i>
        <span v-if="!offIconClass && offText" :style="{lineHeight: height+'rem'}">{{ offText }}</span>
      </div>
    </transition>
  </label>
`).render;

Vue.use(ElementUI);
