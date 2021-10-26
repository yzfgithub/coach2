<template>
	<div class="leave-apply-page">
		<div class="appeal-submit" v-if="appealStatus === '1'">
			<div class="page-container">
				<div class="container-title">
					<img src="@/assets/img/warn-icon.png" alt class="title-icon" />
					<span class="title">请选择要申诉的异常行为</span>
				</div>
				<!-- TODO: 目前仅展示申诉差评的选项，后期可以把异常行为搬过来 -->
				<CheckboxGroup class="tips" v-model="checkList" v-if="type === '1'">
					<Checkbox option="1">差评</Checkbox>
				</CheckboxGroup>
			</div>
			<div class="page-container">
				<div class="container-title">
					<img src="@/assets/img/record-icon.png" class="title-icon" />
					<span class="title">申诉理由</span>
				</div>
				<div class="edit-info">
					<Textarea
						v-model="remark"
						style="width:100%;height:80px"
						maxlength="500"
						:indicator="indicator"
						placeholder="请输入不少于5个字的申诉说明"
						autoExpand="true"
					></Textarea>
				</div>

				<div class="edit-info">
					<div class="upload-imgs">
							<div v-for="(item, key) in imgArray" :key="key" class="prodect-img">
									<i @click.stop="deleteImg(key)" class="cubeic-wrong delete-btn"></i>
									<img :src="item" alt="">
							</div>
							<div v-if="imgArray.length < 9" @click="clickInput" class="prodect-img">
								<i class="add-icon"></i>
							</div>

							<input ref="input" type="file" accept="image/*" @change="uploadIDCardImg" name="file" class="input-file" />
					</div>
				</div>
				<div class="note">本地选择文件（上传或拍摄）</div>
			</div>
			<div class="page-container">
				<div class="leave-tips">
					<Checkbox v-model="checked"
						>本人承诺信息真实，并愿意承担相应法律责任</Checkbox
					>
				</div>
				<div class="bottom-btn">
					<div class="big-btn default-btn" @click="nextToPreview">提交申诉</div>
				</div>
				<div class="leave-tips" style="margin-top:5px;text-align:center;">
					<span style="color: #F8542E;"
						>申诉结果将在提交申诉后7个工作日内反馈</span
					>
				</div>
			</div>
		</div>
		<div class="appeal-res" v-else>
			<div class="main-wrap">
				<div class="infos">
					<div class="title">
						<img src="../assets/img/course.png" />申诉信息
					</div>
					<div class="sub-title">
						申诉单号：
						<span>{{ appealRes.id }}</span>
					</div>
					<div class="sub-title">
						申诉行为：
						<span v-if="appealRes.type === 1">差评</span>
					</div>
					<div class="sub-title">
						申诉理由：
						<span>{{ appealRes.appeal_reason }}</span>
					</div>
					<div
						class="appeal-imgs"
						v-if="appealRes.appealImageList && appealRes.appealImageList.length"
					>
						<img
							v-for="(appealImg, index) in appealRes.appealImageList"
							:key="index"
							:src="appealImg"
							@click="handleImgsClick(index)"
						/>
					</div>
				</div>
			</div>
			<div class="main-wrap">
				<div class="infos">
					<div class="title">
						<img src="../assets/img/detail-icon.png" />处理结果
					</div>
					<div class="sub-title">
						差评：
						<span style="color: #F8542E;">{{
							behaviorRes[appealRes.negative_comment]
								? behaviorRes[appealRes.negative_comment]
								: '无需处理'
						}}</span>
					</div>
					<div class="sub-title" v-if="appealRes.negative_comment === 0">
						<span style="color: #F8542E;"
							>（申诉结果将在提交申诉后7个工作日内反馈，请老师耐心等待）</span
						>
					</div>
					<div v-if="appealRes.handle_reason" class="sub-title">
						处理理由：
						<span>{{ appealRes.handle_reason }}</span>
					</div>
					<div v-if="appealRes.updated_at" class="sub-title">
						处理时间：
						<span>{{ appealRes.updated_at }}</span>
					</div>
				</div>
			</div>
			<div class="btn-wrap">
				<div @click="goBack" class="appeal-btn active">
					<span>返回</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
  Textarea, Checkbox, CheckboxGroup,
} from 'cube-ui';
import axios from 'axios';
import cookie from '@/tool/cookie';
import { baseUrl } from '@/tool/common';
import api from '../api';

const OSS = require('ali-oss');

export default {
  name: 'appeal',
  components: {
    Textarea,
    Checkbox,
    CheckboxGroup,
  },
  data() {
    return {
      appealStatus: '1', // 1,申诉； 2,查看结果
      type: '1', // 1，差评； 0，异常行为
      klassId: '',
      initialIndex: 0, // 用于预览图片
      klassInfo: {},
      appealRes: {}, // 申诉结果
      behaviorRes: ['待处理', '通过', '不通过'],
      checkList: ['1'],
      checked: true,
      remark: '',
      indicator: {
        remain: true,
        negative: true,
      },
      imgArray: [],
    };
  },
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
      window.location.href = this.isDev
        ? 'http://coachwechat.weilaicheng.com/auth/bindPage'
        : 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    } else {
      const { appealStatus, klassId } = this.$route.query;
      this.appealStatus = appealStatus;
      this.klassId = klassId;
      if (appealStatus === '3') {
        console.log('appealStatus=== "3"', appealStatus === '3');
        this.getClassDetails();
      }
    }
  },
  methods: {
    clickInput() {
      this.$refs.input.click();
    },
    uploadIDCardImg(e) {
      const imgFile = e.target.files[0];
      axios.get(baseUrl('get_upload_assume_role'))
        .then((response) => {
          const { ret, data } = response.data;
          if (ret) {
            const Oss = OSS.Wrapper;
            let progress = 0; // 用于记录上传的进度
            const host = window.location.host === 'p.coachwechat.kuaipeilian.com' ? 'prd-kpl' : 'dev-kpl';
            const ossClient = new OSS({
              region: 'oss-cn-shanghai',
              accessKeyId: data.AccessKeyId,
              accessKeySecret: data.AccessKeySecret,
              bucket: host, // prd-kpl
              stsToken: data.SecurityToken,
              endpoint: 'oss-cn-shanghai.aliyuncs.com',
            });
            const contents = imgFile.name.split('.');
            const ext = contents[contents.length - 1];
            const filename = `appeal/${Math.random().toString(36).substr(2)}.${ext}`;
            GlobalToast.showToast('正在上传图片', 0);
            const ret = ossClient.multipartUpload(filename, imgFile, {
              async progress(p, checkpoint) {
                progress = p;
              },
            })
              .then((result) => {
                GlobalToast.hideToast();
                GlobalToast.showTip('图片上传成功');
                if (result.url) {
                  this.imgArray.push(result.url);
                } else if (progress === 1) {
                  const fileUrl = `http://${host}.oss-cn-shanghai.aliyuncs.com/${filename}`;
                  this.imgArray.push(fileUrl);
                } else {
                  this.$createDialog({
                    type: 'alert',
                    title: '上传提示',
                    content:
										'图片上传失败',
                    confirmBtn: {
                      text: '我知道了',
                      active: true,
                      disabled: false,
                      href: 'javascript:;',
                    },
                  }).show();
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            GlobalToast.hideToast();
            GlobalToast.showTip('图片上传失败', 1500, 'error', true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteImg(key) {
      this.imgArray.splice(key, 1);
    },
    getClassDetails() {
      api.getClassDetail(this.klassId, { server: this.$route.query.server }).then((res) => {
        const { data, ret } = res.data;
        if (ret) {
          this.klassInfo = data;
          this.appealRes = data.coachAppealLog;
        }
      });
    },
    nextToPreview() {
      const verify = this.checkList.length && this.remark.length > 4;
      if (verify) {
        GlobalToast.showTip('正在加载中');
        const appealParams = {
          appealImageList: this.imgArray,
          klassId: this.klassId,
          type: this.type,
          abnormalList: ['negativeComment'],
          appealReason: this.remark,
          server: this.$route.query.server,
        };
        this.submitAppeal(appealParams).then((appealRes) => {
          if (appealRes) {
            this.$createDialog({
              type: 'alert',
              title: '申诉提示',
              content:
									'申诉成功！申诉结果将在提交后7个工作日内反馈，请老师耐心等待',
              confirmBtn: {
                text: '我知道了',
                active: true,
                disabled: false,
                href: 'javascript:;',
              },
              onConfirm: () => {
                location.href = `/frontend/klasses?id=${this.klassId}&server=${this.$route.query.server}`;
              },
            }).show();
          }
        });
        // }
      } else if (!this.checkList.length) {
        GlobalToast.showTip('请选择要申诉的异常行为！');
      } else if (this.remark.length < 5) {
        GlobalToast.showTip('申诉理由不少于5个字！');
      } else {
        GlobalToast.showTip('请填写申诉理由');
      }
    },
    /**
		 * 获取阿里云的oss地址并上传图片，（一次上传一张）
		 */
    submitAppeal(params) {
      return new Promise((resolve, reject) => {
        api.postAppeal(params).then((res) => {
          const { data, ret } = res.data;
          if (ret) {
            resolve(ret);
          } else {
            GlobalToast.showTip(res.data.error);
          }
        });
      }).catch((err) => {
        console.log('err:', err);
      });
    },
    handleImgsClick(index) {
      this.initialIndex = index;
      const params = {
        $props: {
          imgs: this.appealRes.appealImageList,
          initialIndex: 'initialIndex', // 响应式数据的key名
          loop: false,
        },
        $events: {
          change: (i) => {
            // 必须更新 initialIndex
            this.initialIndex = i;
          },
        },
      };
      this.$createImagePreview({ ...params }).show();
    },
    goBack() {
      this.$router.back(-1);
    },
  },
};
</script>

<style lang="stylus" scoped>
.page-container {
	border-radius: 0;
}

.leave-apply-page {
	.edit-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 22px 16px 16px;
		font-size: 14px;

		.title {
			color: #9B9B9D;
			font-size: 14px;
		}

		.edit-select {
			border: none;
		}

		.placeholder {
			color: #C7C7C7;
		}

		.select-date {
			color: #666;
		}

		.leave-day {
			color: #666;
		}
	}
}

.cube-select {
	padding-right: 22px;
	padding: 0 22px 0 0;
}

.cube-select::after {
	border: none;
}
.tips {
	color: #FE5806;
	font-size: 14px;
	text-align: left;
}

.tips::before, .tips::after {
	border: 0;
}

.text-area::after {
	border: 0;
}

.leave-tips {
	color: #FE5806;
	font-size: 12px;
	text-align: left;
	line-height: 18px;
}

.note {
	font-size: 12px;
	color: #C7C7C7;
	text-align: left;
}

.main-wrap {
	margin-bottom: 10px;

	.infos {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 15px;
		background: #fff;
		box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.04);
	}

	.title {
		font-size: 16px;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(53, 53, 54, 1);
		display: flex;
		align-items: center;

		img {
			width: 22px;
			margin-right: 5px;
		}
	}

	.sub-title {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(102, 102, 102, 1);
		margin-top: 16px;
		text-align: left;

		span {
			font-size: 12px;
			color: #777;
		}
	}

	.appeal-imgs {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: stretch;

		img {
			width: 80px;
			height: 80px;
			margin: 10px;
		}
	}
	.time {
		margin-top: 8px;
		font-size: 12px;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(199, 199, 199, 1);
	}

	.score {
		font-size: 15px;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(102, 102, 102, 1);
		margin-top: 16px;
	}

	.tags-wrap {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
		justify-content: flex-start;
	}

	.tags-item {
		background: #FFF2EF;
		border-radius: 20px;
		font-size: 13px;
		font-family: PingFang SC;
		font-weight: 400;
		padding: 5px 15px;
		color: #F8542E;
		margin-right: 12px;
		margin-bottom: 12px;
	}

	.desc {
		margin-top: 10px;
		font-size: 13px;
		line-height: 20px;
		text-align: left;
		color: #9B9B9D;
	}
}

.btn-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 50px;
	margin-bottom: 50px;

	.appeal-btn {
		width: 85%;
		height: 48px;
		line-height: 48px;
		border-radius: 48px;
		font-size: 20px;
		background: #FFD2C3;
		color: #fff;
	}

	.active {
		background: rgba(248, 84, 46, 1);
	}
}

 .upload-imgs{
    display: flex;
    flex-wrap: wrap;
    margin-top: 18px;
    width: 100%;
    position: relative;
    .prodect-img{
			margin-bottom: 18px;
			margin-right: 12px;
			width: 80px;
			height: 80px;
			overflow: hidden;
			position: relative;
			border: 0.505px solid #ddd;
			border-radius: 5px;
			img{
					width: 95px;
					display: block;
			}
			.delete-btn{
				font-size: 26px;
				position: absolute;
				right: 0;
				top: 0;
			}
			.add-icon::before{
				content: "";
				position: absolute;
				top: 50%;
				left: 50%;
				width: 0.533333rem;
				height: 0.053333rem;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				background-color: #666;
			}
			.add-icon::after{
				content: "";
				position: absolute;
				top: 50%;
				left: 50%;
				width: 0.533333rem;
				height: 0.053333rem;
				-webkit-transform: translate(-50%, -50%);
				transform: translate(-50%, -50%);
				background-color: #666;
				transform: translate(-50%, -50%) rotate(90deg);
			}
    }
    .input-file{
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
    }
  }
</style>
