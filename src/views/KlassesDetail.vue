<template>
	<div id="box" class="detail-ctn">
		<div class="top-wrap">
			<div class="user">
				<div class="logo">
					<img
						:src="klassInfo.studentAvatar || '../assets/img/default_avatar.png'"
					/>
				</div>
				<div class="user-info">
					<div class="stu-name">{{ klassInfo.studentName }}</div>
					<div class="stu-des">
						<span>{{ sexs[klassInfo.studentSex] }}</span>
						<span class="accompany">&nbsp;|&nbsp;</span>
						<span>{{ klassInfo.studentAge || 0 }}岁</span>
					</div>
				</div>
			</div>
		</div>
		<div class="main-wrap">
			<div class="infos">
				<div class="title"><img src="../assets/img/course.png" />课程信息</div>
				<div class="sub-title">{{ klassInfo.titleForCoach }}</div>
				<div class="time">
					{{ klassInfo.startDate }} {{ klassInfo.dayOfWeekDesc }}
					{{ klassInfo.timeBlockPeriod }}
				</div>
			</div>
		</div>
		<div class="main-wrap">
			<div class="infos">
				<div class="title">
					<img src="../assets/img/evaluate.png" />学生评价
				</div>
				<div class="score">评分： {{ klassInfo.evaluateRank }}分</div>
				<div class="tags-wrap" v-if="klassInfo.evaluateTagList">
					<div
						class="tags-item"
						v-for="(item, index) in klassInfo.evaluateTagList"
						:key="index"
					>
						<span>{{ item }}</span>
					</div>
				</div>
				<div class="desc">{{ klassInfo.evaluateContent }}</div>
			</div>
		</div>
		<div class="btn-wrap">
			<div
				@click="goAppeal"
				class="appeal-btn"
				:class="{
					active: klassInfo.appealStatus === 1 || klassInfo.appealStatus === 3,
				}"
			>
				<span>{{ btnStatus[klassInfo.appealStatus] }}</span>
			</div>
		</div>
	</div>
</template>
<script>
import cookie from '@/tool/cookie';
import meta from '../tool/meta';
import api from '../api';

export default {
  data() {
    return {
      tags: ['有责任心', '上课迟到', '口齿不清', '不够专业', '有点凶'],
      klassInfo: {},
      sexs: ['未知', '男', '女'],
      btnStatus: ['不可申诉', '申诉', '已过期', '查看结果'],
    };
  },

  components: {},
  props: {},
  created() {
    if (cookie.getCookie('webAuthToken') === '') {
    	window.location.href = this.isDev
    		? 'http://coachwechat.weilaicheng.com/auth/bindPage'
    		: 'http://p.coachwechat.kuaipeilian.com/auth/bindPage';
    } else {
      this.getClassDetails();
    }
  },
  methods: {
    getClassDetails() {
	  const id = this.$route.query.id;
	  const server = this.$route.query.server;
      api.getClassDetail(id, { server }).then((res) => {
        const { data, ret } = res.data;
        if (ret) {
          this.klassInfo = data;
        }
      });
    },
    goAppeal() {
      if (this.klassInfo.appealStatus === 1 || this.klassInfo.appealStatus === 3) {
        location.href = `/frontend/appeal?klassId=${this.$route.query.id}&appealStatus=${this.klassInfo.appealStatus}&server=${this.klassInfo.server}`;
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.top-wrap, .main-wrap {
	width: 100vw;
	position: relative;
}

.user {
	display: flex;
	justify-content: flex-start;
	padding: 15px;
	height: 64px;
	background: #fff;
	box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.04);

	.logo {
		width: 64px;
		height: 100%;
		position: relative;

		img {
			width: 56px;
			height: 56px;
			border-radius: 50%;
			border: 1px solid #fff;
		}
	}

	.user-info {
		margin-left: 12px;
	}

	.user-info {
		font-size: 14px;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;

		.stu-name {
			font-size: 18px;
			font-weight: 500;
			color: rgba(53, 53, 54, 1);
		}

		.stu-des {
			margin-top: 5px;

			.accompany {
				color: #ccc;
			}
		}
	}
}

.main-wrap {
	margin-top: 10px;

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
</style>
