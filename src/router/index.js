import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', module: 0 }
  },
  {
    path: '/ml-basics',
    name: 'MLBasics',
    component: () => import('@/views/MLBasics.vue'),
    meta: { title: '机器学习基础', module: 1 }
  },
  {
    path: '/deep-learning',
    name: 'DeepLearning',
    component: () => import('@/views/DeepLearning.vue'),
    meta: { title: '深度学习核心', module: 2 }
  },
  {
    path: '/cnn',
    name: 'CNN',
    component: () => import('@/views/CNN.vue'),
    meta: { title: '卷积神经网络', module: 3 }
  },
  {
    path: '/rnn',
    name: 'RNN',
    component: () => import('@/views/RNN.vue'),
    meta: { title: '循环神经网络', module: 4 }
  },
  {
    path: '/transformer',
    name: 'Transformer',
    component: () => import('@/views/TransformerView.vue'),
    meta: { title: 'Transformer与大模型', module: 5 }
  },
  {
    path: '/generative',
    name: 'Generative',
    component: () => import('@/views/Generative.vue'),
    meta: { title: '生成模型', module: 6 }
  },
  {
    path: '/practice',
    name: 'Practice',
    component: () => import('@/views/Practice.vue'),
    meta: { title: '实践与工程', module: 7 }
  },
  {
    path: '/frontier',
    name: 'Frontier',
    component: () => import('@/views/Frontier.vue'),
    meta: { title: '前沿研究方向', module: 8 }
  },
  {
    path: '/knowledge-graph',
    name: 'KnowledgeGraph',
    component: () => import('@/views/KnowledgeGraph.vue'),
    meta: { title: '知识图谱', module: 0 }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'ML-Visualizer'} | ML-Visualizer`
  next()
})

export default router
