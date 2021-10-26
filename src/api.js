import axios from 'axios';
// import Qs from 'qs';

axios.defaults.timeout = 50000;
const api = axios.create();
axios.interceptors.request.use = api.interceptors.request.use;
axios.interceptors.response.use = api.interceptors.response.use;

api.interceptors.request.use(
  // (config) => {
  //   config.headers.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJpYXQiOjE1ODQ0MzUxMzgsIm5iZiI6MTU4NDQzNTEzOCwianRpIjoiaXNZekw0IiwicHJ2IjoiYTQ1MGRiNTQxOTQxNTI3YjMyOTljMTQyYjlmMmZiNDcxNTAzNzRjYiIsInN1YiI6ImEyMTIzZTIwLTdhN2UtMTFlOC05YjVmLWJmYjRkNzFkNzY5ZCIsInByb3ZpZGVyIjoiV2VDaGF0In0.auqfiSh_idaRHYaeYRhwWXpPMfLwMnD11vOxkrZHmxw';
  //   return config;
  // },
  config => config,
  err => Promise.reject(err),
);

api.interceptors.response.use(
  (res) => {
    if (res.data.code === 4010) {
      GlobalToast.showTip(res.data.msg);
    } else if (res.data.code === 500) {
      GlobalToast.showTip(res.data.msg);
    } else {
      return res;
    }
  },
  (res) => {
    if (res.response.status === 401) {
      GlobalToast.showTip(res);
    }
    if (res.response.status === 500) {
      GlobalToast.showTip('服务器开小差了，请稍后再试！');
    }
  },
);

export default {
  getLeaveMonth(params) {
    return api.get('/coach_wechat/api/v2/leave/get_month', { params });
  },
  getLeaveInfo(params) {
    return api.get('/coach_wechat/api/v2/leave/info', { params });
  },
  postLeaveDay(params) {
    return api.post('/coach_wechat/api/v2/leave/get_day', params);
  },
  postLeavePreview(params) {
    return api.post('/coach_wechat/api/v2/leave/preview', params);
  },
  postLeaveSubmit(params) {
    return api.post('/coach_wechat/api/v2/leave/submit', params);
  },
  getTimeTableChours(params) {
    return api.get('/coach_wechat/api/v2/coach/chours', { params });
  },
  putUpdateCusedCursor(params) {
    return api.put('/coach_wechat/api/v2/coach/update_cused_cursor', params);
  },
  getCoachLoopTimes() {
    return api.get('/coach_wechat/api/v2/coach/coach_loop_times');
  },
  // 获取初始化时间块表
  getInitializeChours(params) {
    return api.get('/api/initialize_chours', { params });
  },
  getCoachDetail(params) {
    return api.get('/api/coach_detail', { params });
  },
  // 获取某老师的时间循环规则
  getCoachChourList(params) {
    return api.get('/api/coach_loop_times', { params });
  },
  // 获取某时间循环规则
  getCoachFixKlassLoopTimes(id, params) {
    return api.get(`/api/coach_loop_times/${id}`, { params });
  },
  // 新建 循环时间前 检查影响的课
  postCoachLoopTimeCheck(params) {
    return api.post('/api/coach_loop_times/preview', params);
  },
  postCoachLoopTime(params) {
    return api.post('/api/coach_loop_times', params);
  },
  // 编辑 循环时间前 检查影响的课
  putCoachLoopTimeCheck(id, params) {
    return api.put(`/api/coach_loop_times/${id}/preview`, params);
  },
  putCoachLoopTime(id, params) {
    return api.put(`/api/coach_loop_times/${id}`, params);
  },
  postEffactAddKlassList(params) {
    return api.post('/api/coach_loop_times/addition_preview', params);
  },
  putEffactAddKlassList(id, params) {
    return api.put(`/api/coach_loop_times/${id}/addition_preview`, params);
  },

  // 老师等级
  getBatchList() {
    return api.get('/coach_wechat/api/v2/ranking/batch_list');
  },
  getBatchInfo(id) {
    return api.get(`/coach_wechat/api/v2/ranking/batch?batch=${id}`);
  },
  getBatchLog(id) {
    return api.get(`/coach_wechat/api/v2/ranking/logs?batch=${id}`);
  },
  // 老师可排等级学生
  getCoachPlatoonKlassLeve() {
    return api.get('/coach_wechat/api/v2/coach/platoonKlassLeve');
  },
  putCoachPlatoonKlassLeve(params) {
    return api.put('/coach_wechat/api/v2/coach/platoonKlassLeve', params);
  },

  // 老师是否调整时间
  putCoachSettings(params) {
    return api.put('/api/coach_settings', params);
  },
  // 差评申诉相关
  getClassDetail(id, params) {
    return api.get(`/api/klasses/${id}`, { params });
  },
  getUploadRole() {
    return api.get('/api/get_upload_assume_role');
  },
  postAppeal(params) {
    return api.post('/api/appeals', params);
  },
  // 推荐列表
  getRecommendTeacherList(params) {
    return api.get('/api/followerListApplyInfo', { params });
  },
  // 调查问卷
  getSurveyQuestion(params) {
    return api.get('/api/questionnaires', { params });
  },
  postSurveyQuestion(params) {
    return api.post('/api/questionnaires', params);
  },

};
