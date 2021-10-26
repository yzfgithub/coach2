import Vue from 'vue';
import Router from 'vue-router';

const LeaveList = () => import('@/views/LeaveList');
const LeavePreview = () => import('@/views/LeavePreview');
const LeaveApply = () => import('@/views/LeaveApply');
const LeaveDetail = () => import('@/views/LeaveDetail');
const LeaveRules = () => import('@/views/LeaveRules');
const TimeTable = () => import('@/views/TimeTable');
const TemporaryTable = () => import('@/views/TemporaryTable');
const FixedTable = () => import('@/views/FixedTable');
const CreateFixedTable = () => import('@/views/CreateFixedTable');
const AdjustRule = () => import('@/views/AdjustRule');
const EffectKlass = () => import('@/views/EffectKlass');
const RecommendList = () => import('@/views/RecommendList');

// 老师等级相关
const MyGrade = () => import('@/views/MyGrade');
const GradeDetail = () => import('@/views/GradeDetail');
const GradeRules = () => import('@/views/GradeRules');
const RemindAdjust = () => import('@/views/RemindAdjust');

const CanTeachGrade = () => import('@/views/CanTeachGrade');
// 老师差评
const KlassesDetail = () => import('@/views/KlassesDetail');
const Appeal = () => import('@/views/Appeal');
// 调查问卷
const Survey = () => import('@/views/survey/Survey');
const SurveyOk = () => import('@/views/survey/SurveyOk');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: '/frontend',
  routes: [
    {
      path: '/LeaveList',
      component: LeaveList,
      name: 'LeaveList',
      meta: { title: '请假' },
    },
    {
      path: '/LeavePreview',
      component: LeavePreview,
      name: 'LeavePreview',
      meta: { title: '请假预览' },
    },
    {
      path: '/LeaveApply',
      component: LeaveApply,
      name: 'LeaveApply',
      meta: { title: '请假申请' },
    },
    {
      path: '/LeaveDetail',
      component: LeaveDetail,
      name: 'LeaveDetail',
      meta: { title: '请假详情' },
    },
    {
      path: '/LeaveRules',
      component: LeaveRules,
      name: 'LeaveRules',
      meta: { title: '请假规则' },
    },
    {
      path: '/TimeTable',
      component: TimeTable,
      name: 'TimeTable',
      meta: { title: '时段表' },
    },
    {
      path: '/TemporaryTable',
      component: TemporaryTable,
      name: 'TemporaryTable',
      meta: { title: '临时开放时间' },
    },
    {
      path: '/FixedTable',
      component: FixedTable,
      name: 'FixedTable',
      meta: { title: '固定开放时间' },
    },
    {
      path: '/CreateFixedTable',
      component: CreateFixedTable,
      name: 'CreateFixedTable',
      meta: { title: '固定开放时间' },
    },
    {
      path: '/AdjustRule',
      component: AdjustRule,
      name: 'AdjustRule',
      meta: { title: '调整规则' },
    },
    {
      path: '/EffectKlass',
      component: EffectKlass,
      name: 'EffectKlass',
      meta: { title: '开放时间预览' },
    },
    {
      path: '/recommendList',
      component: RecommendList,
      name: 'RecommendList',
      meta: { title: '老师推荐列表' },
    },
    {
      path: '/MyGrade',
      component: MyGrade,
      name: 'MyGrade',
      meta: { title: '我的等级' },
    },
    {
      path: '/GradeDetail',
      component: GradeDetail,
      name: 'GradeDetail',
      meta: { title: '等级明细' },
    },
    {
      path: '/GradeRules',
      component: GradeRules,
      name: 'GradeRules',
      meta: { title: '成长规则' },
    },
    {
      path: '/RemindAdjust',
      component: RemindAdjust,
      name: 'RemindAdjust',
      meta: { title: '调整时间' },
    },
    {
      path: '/CanTeachGrade',
      component: CanTeachGrade,
      name: 'CanTeachGrade',
      meta: { title: '设置可排课学生等级' },
    },
    // 老师差评申诉
    {
      path: '/klasses',
      component: KlassesDetail,
      name: 'klasses',
      meta: { title: '评价详情' },
    },
    {
      path: '/appeal',
      component: Appeal,
      name: 'appeal',
      meta: { title: '申诉' },
    },
    // 调查问卷
    {
      path: '/survey',
      component: Survey,
      name: 'survey',
      meta: { title: '调查问卷' },
    },
    {
      path: '/surveyOk',
      component: SurveyOk,
      name: 'surveyOk',
      meta: { title: '调查问卷' },
    },
  ],
});
