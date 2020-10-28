<template>
  <el-popover placement="bottom" width="500" class="member-tag" trigger="hover" :open-delay="300">
    <div class="popover-info">
      <div class="popover-info-item text-ellipsis">
        <span class="popover-info-item-title">标签：</span>
        {{ tag.name }}
      </div>
      <div class="popover-info-item text-ellipsis" v-if="tag.remark">
        <span class="popover-info-item-title">备注：</span>
        {{ tag.remark }}
      </div>
      <div class="popover-info-item text-ellipsis">
        <span class="popover-info-item-title">创建：</span>
        <user :creator="tag.creator" />
      </div>
      <div class="popover-info-item text-ellipsis">
        <span class="popover-info-item-title">工号：</span>
        {{ tag.creator.uid }}
      </div>
      <div class="popover-info-item text-ellipsis">
        <span class="popover-info-item-title">部门：</span>
        {{ tag.creator.department }}
      </div>
    </div>
    <el-tag
      slot="reference"
      class="member-tag-btn"
      :closable="closable"
      :size="size"
      @close="$emit('close-tag')"
    >{{ tag.name }}</el-tag>
  </el-popover>
</template>

<script>
import User from '@/views/components/User'

export default {
  name: 'SelectAlarmTag',
  components: { User },
  props: {
    tag: {
      type: Object,
      required: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
.member-tag {
  margin-right: 10px;
  .member-tag-btn {
    cursor: pointer;
  }
}
// popover 信息块
.popover-info {
  .popover-info-item {
    position: relative;
    line-height: 2.2;
    padding-left: 56px;

    .popover-info-item-title {
      position: absolute;
      left: 0;
      display: inline-block;
      width: 48px;
      font-weight: 600;
    }
  }
}
</style>
