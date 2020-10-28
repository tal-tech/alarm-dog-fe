<template>
  <el-form :model="postForm" class="form-container" label-width="120px" ref="form" :rules="rules">
    <el-form-item label="任务名称" prop="name">
      <el-input v-model="postForm.name"/>
    </el-form-item>
    <el-form-item label="部门" prop="department_id">
      <el-select v-model="postForm.department_id" filterable placeholder="请选择部门">
        <el-option
          v-for="department in departments"
          :key="department.id"
          :label="department.name"
          :value="department.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联标签" prop="task_tags">
      <add-tags-select v-model="postForm.task_tags" />
    </el-form-item>
    <el-form-item label="告警入库存储" prop="flag_save_db">
      <el-radio-group v-model="postForm.flag_save_db">
        <el-radio :label="1">入库存储</el-radio>
        <el-radio :label="0">不入库存储</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="读写权限" prop="permission_rw">
      <add-members-select v-model="postForm.permission.rw" >
        <template v-if="!postForm.id" slot="before-tags">
          <select-member-tag :member="user" :closable="false" />
        </template>
      </add-members-select>
    </el-form-item>
    <el-form-item label="只读权限" prop="permission_ro">
      <add-members-select v-model="postForm.permission.ro" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="$emit('change-active', 'receiver')">下一步</el-button>
      <el-button @click="$emit('go-back')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import AddMembersSelect from '@/views/components/AddMembers/Select'
import SelectMemberTag from '@/views/components/AddMembers/SelectMemberTag'
import AddTagsSelect from '@/views/components/AddAlarmTags/Select'
import SelectAlarmTag from '@/views/components/AddAlarmTags/SelectAlarmTag'
import { simpleDepartments } from '@/api/department'
import { formatInArrayNumber, formatNumber } from '@/utils/helpers'

export default {
  name: 'CreateBasic',
  components: { AddMembersSelect, SelectMemberTag, AddTagsSelect, SelectAlarmTag },
  model: {
    prop: 'postForm'
  },
  props: {
    postForm: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      departments: [],
      rules: {
        name: [
          { required: true, message: '任务名称不能为空', trigger: 'blue' }
        ],
        department_id: [
          { required: true, message: '请选择部门', trigger: 'blue' }
        ]
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    buId () {
      return this.$store.state.app.buId
    }
  },
  watch: {
    buId () {
      this.getDepartments()
    }
  },
  created () {
    this.getDepartments()
  },
  methods: {
    // 部门列表
    getDepartments () {
      simpleDepartments(null, null, this.buId)
        .then(res => {
          this.departments = formatInArrayNumber(res.data.departments, ['id'])
        })
    },
    // 初始化填充表单数据
    initForm (task) {
      return {
        task_tags: task.task_tags ? formatInArrayNumber(task.task_tags, ['id']) : [],
        name: task.name,
        department_id: formatNumber(task.department_id, 0),
        flag_save_db: formatNumber(task.flag_save_db, 1),
        permission: {
          rw: task.permission.rw ? formatInArrayNumber(task.permission.rw, ['uid']) : [],
          ro: task.permission.ro ? formatInArrayNumber(task.permission.ro, ['uid']) : []
        }
      }
    },
    // 格式化表单
    getFormData () {
      const basic = {
        task_tags: this.postForm.task_tags.map(i => i.id),
        name: this.postForm.name,
        department_id: this.postForm.department_id,
        flag_save_db: this.postForm.flag_save_db,
        permission: {
          rw: this.postForm.permission.rw.map(u => u.uid),
          ro: this.postForm.permission.ro.map(u => u.uid)
        }
      }
      if (this.postForm.id) {
        basic['id'] = this.postForm.id
      }

      return basic
    }
  }
}
</script>
